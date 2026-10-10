export type PropertyType = 'Independent house' | 'Apartment complex' | 'Commercial or institution';

export type RoofSurface = 
  | 'Concrete terrace (RCC)' 
  | 'Clay or Mangalore tile' 
  | 'Metal sheet' 
  | 'Asbestos or cement sheet';

export type SoilType = 
  | 'Red soil or laterite' 
  | 'Sandy or gravelly' 
  | 'Clayey or black soil' 
  | 'Hard rock close to surface';

export type MainWaterSource = 
  | 'Private tanker' 
  | 'BWSSB piped supply' 
  | 'Own borewell';

export type CauveryCoverage = 'Limited' | 'Partial' | 'Full';

export type StressBand = 'Very high' | 'High' | 'Medium' | 'Low-medium' | 'Low';

export interface AreaData {
  id: string;
  name: string;
  kannadaName: string;
  zone: string;
  stressIndex: number; // 0-100
  cauveryCoverage: CauveryCoverage;
  eligibleProperties: number;
  registeredSystems: number;
  openReports: number;
  concernFlag: 'Groundwater dependent' | 'None';
  coordinates: { x: number; y: number }; // Relative position on map 0-100%
  description?: string;
}

export interface PlanInputs {
  area: string;
  propertyType: PropertyType;
  yearBuilt: number;
  plotLength: number; // ft
  plotWidth: number; // ft
  roofAreaSqFt: number; // sq ft
  roofSurface: RoofSurface;
  peopleCount: number;
  openGroundSqFt: number; // sq ft
  soilType: SoilType;
  existingBorewell: boolean;
  mainWaterSource: MainWaterSource;
  
  // Custom overrides (optional)
  customWaterPrice?: number;
  customInstallCost?: number;
  customUpkeepCost?: number;
  annualRainfallOverride?: number; // default 970 mm
  nonDrinkingUseOverride?: number; // default 45 L/person/day
  designStormOverride?: number; // default 25 mm
  shareHarvestUsedOverride?: number; // default 0.65
}

export interface PlanOutputs {
  plotAreaSqFt: number;
  roofAreaM2: number;
  runoffCoefficient: number;
  estimatedAnnualHarvestLitres: number;
  estimatedAnnualHarvestKL: number;
  nonDrinkingDemandLitres: number;
  waterCouldUseLitres: number;
  shareDemandCoveredPct: number;
  designStormVolumeM3: number;
  soilDrainsWell: boolean;
  enoughOpenGround: boolean;
  largeOrNonResidential: boolean;
  
  // Tank
  tankVolumeM3: number;
  tankCapacityLitres: number;
  tankWaterDepthM: number;
  tankPlanAreaM2: number;
  tankLengthM: number;
  tankWidthM: number;
  
  // Recharge
  rechargeStructureType: 'Recharge well' | 'Recharge pit' | 'Storage tank with safe overflow';
  suggestedSystem: string;
  rechargeVolumeToHandleM3: number;
  pitOrTrenchVolumeM3: number;
  capacityOfOnePitM3: number;
  numberOfPits: number;
  useTrenchInstead: boolean;
  trenchLengthM: number;
  downpipeEstimate: number;
  
  // Cost
  costStorageTank: { low: number; high: number };
  costRechargeStructure: { low: number; high: number };
  costGuttersFilterPlumbing: { low: number; high: number };
  subtotalCost: { low: number; high: number };
  contingencyCost: { low: number; high: number };
  totalInstallCost: { low: number; high: number };
  yearlyUpkeepCost: { low: number; high: number };
  
  // Compliance
  complianceStatus: 'Likely required' | 'Recommended / check' | 'Mandatory under BWSSB Act';
  dualPipeNote: string;
}

export interface ScenarioResult {
  name: 'Conservative' | 'Base' | 'Optimistic';
  installationCost: number;
  yearlyUpkeep: number;
  priceFactor: number;
  priceUsed: number;
  shareHarvestUsed: number;
  waterUsedLitres: number;
  savingPerYear: number;
  netSavingAfterUpkeep: number;
  simplePaybackYears: number | null; // null if no payback
  tankerLoadsAvoidedPerYear: number;
  cumulative10Years: number[]; // Year 0 to 10
}

export interface MonthlyRainData {
  month: string;
  typicalRainMm: number;
  shareOfYearPct: number;
}

export type ReportCategory = 
  | 'Waterlogging' 
  | 'Overflowing storm drain' 
  | 'Broken RWH structure' 
  | 'Groundwater concern' 
  | 'Other';

export type ReportStatus = 
  | 'Submitted' 
  | 'Acknowledged' 
  | 'Assigned' 
  | 'Resolved' 
  | 'Closed';

export type Department = 
  | 'BWSSB' 
  | 'City corporation, storm water drains' 
  | 'City corporation, ward office' 
  | 'Lake authority' 
  | 'Karnataka Ground Water Authority' 
  | 'Other';

export interface CitizenReport {
  id: string;
  receiptNumber: string;
  timestamp: string;
  area: string;
  streetLandmark: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  assignedDepartment?: Department;
  editorNote?: string;
  imageUrl?: string;
}

export interface RegisteredSystem {
  id: string;
  timestamp: string;
  area: string;
  propertyType: PropertyType;
  roofAreaSqFt: number;
  tankCapacityLitres: number;
  rechargeStructure: string;
  installedBy?: string;
  status: 'Installed' | 'Being built' | 'Planned';
}
