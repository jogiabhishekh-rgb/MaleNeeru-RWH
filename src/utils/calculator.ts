import { 
  PlanInputs, 
  PlanOutputs, 
  ScenarioResult
} from '../types/rwh';
import { 
  ROOF_RUNOFF_MAP, 
  SOIL_DRAINAGE_MAP, 
  WATER_SOURCE_PRICES,
  BENGALURU_AREAS,
  MONTHLY_RAIN_PATTERN
} from '../data/bengaluruData';

const SQFT_TO_M2 = 0.092903;
const DEFAULT_COLLECTION_EFFICIENCY = 0.85;
const DEFAULT_ANNUAL_RAINFALL_MM = 970;
const DEFAULT_NON_DRINKING_USE_LITRES_PER_DAY = 45;
const DEFAULT_SHARE_HARVEST_USED = 0.65;
const DEFAULT_DESIGN_STORM_MM = 25;
const MIN_OPEN_GROUND_SQFT_FOR_PIT = 50;
const MIN_TANK_VOLUME_M3 = 1.0;
const PIT_MEDIA_VOIDS = 0.35;
const PIT_CAPACITY_M3 = 3.39;
const DOWNPIPE_COVERAGE_M2 = 50;
const DUAL_PIPING_ROOF_AREA_THRESHOLD_SQFT = 10000;

const roundTo = (value: number, decimalPlaces: number) => {
  const factor = 10 ** decimalPlaces;
  return Math.round(value * factor) / factor;
};

export function calculateRwhPlan(inputs: PlanInputs): PlanOutputs {
  const plotAreaSqFt = inputs.plotLength * inputs.plotWidth;
  const roofAreaM2 = inputs.roofAreaSqFt * SQFT_TO_M2;
  const runoffCoefficient = ROOF_RUNOFF_MAP[inputs.roofSurface] ?? 0.80;
  const collectionEfficiency = DEFAULT_COLLECTION_EFFICIENCY;
  const annualRainfall = inputs.annualRainfallOverride ?? DEFAULT_ANNUAL_RAINFALL_MM;

  // Annual harvest: rainfall (mm) x roof area (m2) x runoff coefficient x collection efficiency
  const estimatedAnnualHarvestLitres = Math.round(
    annualRainfall * roofAreaM2 * runoffCoefficient * collectionEfficiency
  );
  const estimatedAnnualHarvestKL = roundTo(estimatedAnnualHarvestLitres / 1000, 1);

  // Demand
  const nonDrinkingLPerDay = inputs.nonDrinkingUseOverride ?? DEFAULT_NON_DRINKING_USE_LITRES_PER_DAY;
  const nonDrinkingDemandLitres = Math.round(inputs.peopleCount * nonDrinkingLPerDay * 365);

  const shareHarvestUsed = inputs.shareHarvestUsedOverride ?? DEFAULT_SHARE_HARVEST_USED;
  const waterCouldUseLitres = Math.min(
    Math.round(estimatedAnnualHarvestLitres * shareHarvestUsed),
    nonDrinkingDemandLitres
  );

  const shareDemandCoveredPct = nonDrinkingDemandLitres > 0
    ? Math.min(100, roundTo((waterCouldUseLitres / nonDrinkingDemandLitres) * 100, 1))
    : 0;

  // Design storm volume (m3) = roof m2 * runoff * efficiency * storm depth (m)
  const designStormDepthMm = inputs.designStormOverride ?? DEFAULT_DESIGN_STORM_MM;
  const designStormVolumeM3 = roundTo(
    roofAreaM2 * runoffCoefficient * collectionEfficiency * (designStormDepthMm / 1000)
  , 2);

  const soilDrainsWell = SOIL_DRAINAGE_MAP[inputs.soilType] ?? true;
  const enoughOpenGround = inputs.openGroundSqFt >= MIN_OPEN_GROUND_SQFT_FOR_PIT;
  const largeOrNonResidential = 
    inputs.propertyType !== 'Independent house' || inputs.roofAreaSqFt >= DUAL_PIPING_ROOF_AREA_THRESHOLD_SQFT;

  // Tank sizing: Smaller of 15 days demand and design storm volume; min 1 m3; steps of 0.5 m3
  const fifteenDaysDemandM3 = (inputs.peopleCount * nonDrinkingLPerDay * 15) / 1000;
  const rawTankVol = Math.min(fifteenDaysDemandM3, designStormVolumeM3);
  const tankVolumeM3 = Math.max(MIN_TANK_VOLUME_M3, Math.round(rawTankVol * 2) / 2);
  const tankCapacityLitres = Math.round(tankVolumeM3 * 1000);

  // Tank dimensions: 1.5m water depth (2.0m above 10m3) + 0.3m freeboard
  const tankWaterDepthM = tankVolumeM3 > 10 ? 2.0 : 1.5;
  const tankPlanAreaM2 = roundTo(tankVolumeM3 / tankWaterDepthM, 2);
  // Length : width of 1.5 : 1
  const tankLengthM = roundTo(Math.sqrt(tankPlanAreaM2 * 1.5), 1);
  const tankWidthM = roundTo(tankPlanAreaM2 / (tankLengthM || 1), 1);

  // Look up area stress index
  const areaData = BENGALURU_AREAS.find(a => a.name === inputs.area) || BENGALURU_AREAS[0];
  const areaStress = areaData.stressIndex;

  // Recharge structure rule:
  // Well if existing borewell and high stress (>= 50); pit if soil drains and space; else safe overflow
  let rechargeStructureType: 'Recharge well' | 'Recharge pit' | 'Storage tank with safe overflow';
  let suggestedSystem: string;

  if (inputs.existingBorewell && areaStress >= 50) {
    rechargeStructureType = 'Recharge well';
    suggestedSystem = 'Storage tank plus recharge well';
  } else if (soilDrainsWell && enoughOpenGround) {
    rechargeStructureType = 'Recharge pit';
    suggestedSystem = 'Storage tank plus recharge pit';
  } else {
    rechargeStructureType = 'Storage tank with safe overflow';
    suggestedSystem = 'Storage tank with safe overflow';
  }

  // Recharge volume
  const rechargeVolumeToHandleM3 = Math.max(
    0, 
    roundTo(designStormVolumeM3 / 2, 2)
  );
  
  const pitOrTrenchVolumeM3 = rechargeStructureType === 'Recharge pit'
    ? roundTo(rechargeVolumeToHandleM3 / PIT_MEDIA_VOIDS, 2)
    : 0;

  // Circular pit 1.2m dia x 3.0m deep -> volume = pi * r^2 * h = 3.39 m3
  const capacityOfOnePitM3 = PIT_CAPACITY_M3;
  const numberOfPits = rechargeStructureType === 'Recharge pit'
    ? Math.max(1, Math.ceil(pitOrTrenchVolumeM3 / PIT_CAPACITY_M3))
    : 0;

  const useTrenchInstead = numberOfPits > 4;
  const trenchLengthM = useTrenchInstead
    ? roundTo(pitOrTrenchVolumeM3 / (1.0 * 1.5), 1)
    : 0;

  // Downpipes: 100 mm, ~1 per 50 m2 of roof
  const downpipeEstimate = Math.max(1, Math.ceil(roofAreaM2 / DOWNPIPE_COVERAGE_M2));

  // Costs (Low and High ends)
  // Storage tank: ₹9 to ₹16 per L
  const costStorageTank = {
    low: Math.round(tankCapacityLitres * 9),
    high: Math.round(tankCapacityLitres * 16)
  };

  // Recharge structure cost
  let costRechargeStructure = { low: 0, high: 0 };
  if (rechargeStructureType === 'Recharge well') {
    costRechargeStructure = { low: 30000, high: 70000 };
  } else if (rechargeStructureType === 'Recharge pit') {
    const vol = Math.max(pitOrTrenchVolumeM3, PIT_CAPACITY_M3);
    costRechargeStructure = {
      low: Math.round(vol * 4000),
      high: Math.round(vol * 8000)
    };
  } else {
    costRechargeStructure = { low: 3000, high: 7000 }; // simple overflow line
  }

  // Gutters, filter, plumbing: ₹6,000-12,000 plus ₹80-160 per m2
  const costGuttersFilterPlumbing = {
    low: Math.round(6000 + (80 * roofAreaM2)),
    high: Math.round(12000 + (160 * roofAreaM2))
  };

  const subtotalCost = {
    low: costStorageTank.low + costRechargeStructure.low + costGuttersFilterPlumbing.low,
    high: costStorageTank.high + costRechargeStructure.high + costGuttersFilterPlumbing.high
  };

  const contingencyCost = {
    low: Math.round(subtotalCost.low * 0.10),
    high: Math.round(subtotalCost.high * 0.10)
  };

  const totalInstallCost = {
    low: subtotalCost.low + contingencyCost.low,
    high: subtotalCost.high + contingencyCost.high
  };

  // Yearly upkeep: 2-4% with floor of ₹1,500 / ₹3,000
  const yearlyUpkeepCost = {
    low: Math.max(1500, Math.round(totalInstallCost.low * 0.02)),
    high: Math.max(3000, Math.round(totalInstallCost.high * 0.04))
  };

  // Compliance rules
  // Plot of 2,400 sq ft or more likely required; 1,200 to 2,399 sq ft built 2021 or later likely required; else recommended
  let complianceStatus: 'Likely required' | 'Recommended / check' | 'Mandatory under BWSSB Act';
  if (plotAreaSqFt >= 2400) {
    complianceStatus = 'Likely required';
  } else if (plotAreaSqFt >= 1200 && inputs.yearBuilt >= 2021) {
    complianceStatus = 'Likely required';
  } else {
    complianceStatus = 'Recommended / check';
  }

  const dualPipeNote = largeOrNonResidential
    ? 'Buildings of 10,000 sq ft or more or apartment/commercial setups require dual-piping for non-potable harvested water reuse.'
    : 'Not applicable';

  return {
    plotAreaSqFt,
    roofAreaM2: roundTo(roofAreaM2, 1),
    runoffCoefficient,
    estimatedAnnualHarvestLitres,
    estimatedAnnualHarvestKL,
    nonDrinkingDemandLitres,
    waterCouldUseLitres,
    shareDemandCoveredPct,
    designStormVolumeM3,
    soilDrainsWell,
    enoughOpenGround,
    largeOrNonResidential,
    tankVolumeM3,
    tankCapacityLitres,
    tankWaterDepthM,
    tankPlanAreaM2,
    tankLengthM,
    tankWidthM,
    rechargeStructureType,
    suggestedSystem,
    rechargeVolumeToHandleM3,
    pitOrTrenchVolumeM3,
    capacityOfOnePitM3,
    numberOfPits,
    useTrenchInstead,
    trenchLengthM,
    downpipeEstimate,
    costStorageTank,
    costRechargeStructure,
    costGuttersFilterPlumbing,
    subtotalCost,
    contingencyCost,
    totalInstallCost,
    yearlyUpkeepCost,
    complianceStatus,
    dualPipeNote
  };
}

export function calculateCostScenarios(
  inputs: PlanInputs,
  outputs: PlanOutputs
): ScenarioResult[] {
  const baseWaterPrice = inputs.customWaterPrice ?? WATER_SOURCE_PRICES[inputs.mainWaterSource];
  const getRangeValue = (range: { low: number; high: number }, costEnd: 'high' | 'mid' | 'low') => {
    if (costEnd === 'high') return range.high;
    if (costEnd === 'low') return range.low;
    return Math.round((range.low + range.high) / 2);
  };

  const buildScenario = (
    name: 'Conservative' | 'Base' | 'Optimistic',
    priceFactor: number,
    costEnd: 'high' | 'mid' | 'low'
  ): ScenarioResult => {
    const installCost = inputs.customInstallCost ?? getRangeValue(outputs.totalInstallCost, costEnd);
    const upkeep = inputs.customUpkeepCost ?? getRangeValue(outputs.yearlyUpkeepCost, costEnd);
    const priceUsed = roundTo(baseWaterPrice * priceFactor, 3);

    let shareHarvestUsed: number;
    if (name === 'Conservative') {
      shareHarvestUsed = Math.min(inputs.shareHarvestUsedOverride ?? DEFAULT_SHARE_HARVEST_USED, 0.50);
    } else if (name === 'Optimistic') {
      shareHarvestUsed = Math.max(inputs.shareHarvestUsedOverride ?? DEFAULT_SHARE_HARVEST_USED, 0.80);
    } else {
      shareHarvestUsed = inputs.shareHarvestUsedOverride ?? DEFAULT_SHARE_HARVEST_USED;
    }

    const waterUsedLitres = Math.min(
      Math.round(outputs.estimatedAnnualHarvestLitres * shareHarvestUsed),
      outputs.nonDrinkingDemandLitres
    );

    const savingPerYear = Math.round(waterUsedLitres * priceUsed);
    const netSavingAfterUpkeep = savingPerYear - upkeep;

    const simplePaybackYears = netSavingAfterUpkeep > 0
      ? roundTo(installCost / netSavingAfterUpkeep, 1)
      : null;

    const tankerLoadsAvoidedPerYear = roundTo(waterUsedLitres / 12000, 1);

    // 10 year cumulative cash flow
    const cumulative10Years: number[] = [];
    for (let yr = 0; yr <= 10; yr++) {
      if (yr === 0) {
        cumulative10Years.push(-installCost);
      } else {
        cumulative10Years.push(-installCost + yr * netSavingAfterUpkeep);
      }
    }

    return {
      name,
      installationCost: installCost,
      yearlyUpkeep: upkeep,
      priceFactor,
      priceUsed,
      shareHarvestUsed,
      waterUsedLitres,
      savingPerYear,
      netSavingAfterUpkeep,
      simplePaybackYears,
      tankerLoadsAvoidedPerYear,
      cumulative10Years
    };
  };

  return [
    buildScenario('Conservative', 0.6, 'high'),
    buildScenario('Base', 1.0, 'mid'),
    buildScenario('Optimistic', 1.4, 'low')
  ];
}

export function calculateAreaMetrics(areas = BENGALURU_AREAS) {
  return areas.map(area => {
    // Potential harvest in Megalitres (ML):
    // Eligible properties x 80 m2 x rainfall (970) x 0.8 x 0.85 / 1,000,000
    const potentialHarvestML = Math.round(
      (area.eligibleProperties * 80 * 970 * 0.80 * 0.85) / 1000000
    );

    // Priority = 0.6 * stress + 8 * open reports (cap 5), max 100
    const priorityScore = Math.min(
      100,
      Math.round(0.6 * area.stressIndex + 8 * Math.min(area.openReports, 5))
    );

    let stressBand: 'Very high' | 'High' | 'Medium' | 'Low-medium' | 'Low';
    if (area.stressIndex >= 80) stressBand = 'Very high';
    else if (area.stressIndex >= 65) stressBand = 'High';
    else if (area.stressIndex >= 50) stressBand = 'Medium';
    else if (area.stressIndex >= 35) stressBand = 'Low-medium';
    else stressBand = 'Low';

    return {
      ...area,
      potentialHarvestML,
      priorityScore,
      stressBand
    };
  });
}

export function calculateMonthlyHarvest(
  annualRainfall: number,
  roofAreaM2: number,
  runoffCoeff: number,
  efficiency = 0.85
) {
  const totalPatternMm = MONTHLY_RAIN_PATTERN.reduce((acc, m) => acc + m.typicalRainMm, 0); // 951 mm
  const totalAnnualHarvest = annualRainfall * roofAreaM2 * runoffCoeff * efficiency;

  return MONTHLY_RAIN_PATTERN.map(item => {
    const scaledRainMm = Math.round((item.typicalRainMm / totalPatternMm) * annualRainfall * 10) / 10;
    const harvestLitres = Math.round((item.typicalRainMm / totalPatternMm) * totalAnnualHarvest);
    return {
      month: item.month,
      typicalRainMm: item.typicalRainMm,
      scaledRainMm,
      shareOfYearPct: item.shareOfYearPct,
      harvestLitres
    };
  });
}
