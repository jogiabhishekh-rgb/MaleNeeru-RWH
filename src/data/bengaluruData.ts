import { AreaData, MonthlyRainData, RoofSurface, SoilType, MainWaterSource, CitizenReport, RegisteredSystem, ReportCategory, Department } from '../types/rwh';

export const BENGALURU_AREAS: AreaData[] = [
  {
    id: 'whitefield',
    name: 'Whitefield, Mahadevapura',
    kannadaName: 'ವೈಟ್‌ಫೀಲ್ಡ್, ಮಹಾದೇವಪುರ',
    zone: 'East Bengaluru',
    stressIndex: 90,
    cauveryCoverage: 'Limited',
    eligibleProperties: 95000,
    registeredSystems: 4,
    openReports: 1,
    concernFlag: 'Groundwater dependent',
    coordinates: { x: 82, y: 48 },
    description: 'Heavy IT corridor dependent almost entirely on deep borewells (1,200ft+) and private water tankers; acute water crisis during peak summer.'
  },
  {
    id: 'devanahalli',
    name: 'Devanahalli outskirts',
    kannadaName: 'ದೇವನಹಳ್ಳಿ ಹೊರವಲಯ',
    zone: 'North Outer',
    stressIndex: 88,
    cauveryCoverage: 'Limited',
    eligibleProperties: 15000,
    registeredSystems: 1,
    openReports: 0,
    concernFlag: 'Groundwater dependent',
    coordinates: { x: 70, y: 12 },
    description: 'Airport expansion corridor with rocky stratum and deep depleting aquifers; urgent need for artificial recharge.'
  },
  {
    id: 'bellandur',
    name: 'Bellandur, Varthur',
    kannadaName: 'ಬೆಳ್ಳಂದೂರು, ವರ್ತೂರು',
    zone: 'South-East',
    stressIndex: 84,
    cauveryCoverage: 'Partial',
    eligibleProperties: 60000,
    registeredSystems: 2,
    openReports: 1,
    concernFlag: 'Groundwater dependent',
    coordinates: { x: 76, y: 64 },
    description: 'High-density apartment complexes with huge rooftop areas. Heavy tanker reliance and catchment alteration around lake wetlands.'
  },
  {
    id: 'kr_puram',
    name: 'KR Puram',
    kannadaName: 'ಕೆ.ಆರ್. ಪುರಂ',
    zone: 'East Bengaluru',
    stressIndex: 82,
    cauveryCoverage: 'Partial',
    eligibleProperties: 70000,
    registeredSystems: 3,
    openReports: 1,
    concernFlag: 'Groundwater dependent',
    coordinates: { x: 74, y: 38 },
    description: 'Rapidly expanded peripheral wards; partial Cauvery supply with frequent dry borewells.'
  },
  {
    id: 'yelahanka',
    name: 'Yelahanka',
    kannadaName: 'ಯಲಹಂಕ',
    zone: 'North Bengaluru',
    stressIndex: 78,
    cauveryCoverage: 'Partial',
    eligibleProperties: 55000,
    registeredSystems: 3,
    openReports: 1,
    concernFlag: 'Groundwater dependent',
    coordinates: { x: 48, y: 22 },
    description: 'Mix of traditional layouts and new townships. High potential for percolation pits in sandy/red laterite soil.'
  },
  {
    id: 'electronic_city',
    name: 'Electronic City, Hosur Road',
    kannadaName: 'ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ, ಹೊಸೂರು ರಸ್ತೆ',
    zone: 'South Bengaluru',
    stressIndex: 72,
    cauveryCoverage: 'Partial',
    eligibleProperties: 45000,
    registeredSystems: 2,
    openReports: 0,
    concernFlag: 'Groundwater dependent',
    coordinates: { x: 68, y: 84 },
    description: 'Massive tech parks and gated communities reliant on deep groundwater tables.'
  },
  {
    id: 'hsr_layout',
    name: 'HSR, Bommanahalli',
    kannadaName: 'ಹೆಚ್.ಎಸ್.ಆರ್, ಬೊಮ್ಮನಹಳ್ಳಿ',
    zone: 'South-East',
    stressIndex: 66,
    cauveryCoverage: 'Partial',
    eligibleProperties: 50000,
    registeredSystems: 2,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 60, y: 68 },
    description: 'Planned residential sectors experiencing borewell stress during dry spells; strong community RWH adoption.'
  },
  {
    id: 'kalkere',
    name: 'Kalkere, Ramamurthy Nagar',
    kannadaName: 'ಕಲ್ಕೆರೆ, ರಾಮಮೂರ್ತಿನಗರ',
    zone: 'North-East',
    stressIndex: 64,
    cauveryCoverage: 'Partial',
    eligibleProperties: 30000,
    registeredSystems: 0,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 68, y: 30 },
    description: 'Peripheral lake-basin residential cluster with growing commercial demand.'
  },
  {
    id: 'hebbal',
    name: 'Hebbal, Jakkur',
    kannadaName: 'ಹೆಬ್ಬಾಳ, ಜಕ್ಕೂರು',
    zone: 'North Bengaluru',
    stressIndex: 62,
    cauveryCoverage: 'Partial',
    eligibleProperties: 40000,
    registeredSystems: 2,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 50, y: 30 },
    description: 'Lake catchment corridor with good infiltration capacity if roof runoff is desilted.'
  },
  {
    id: 'yeshwanthpur',
    name: 'Yeshwanthpur, Peenya',
    kannadaName: 'ಯಶವಂತಪುರ, ಪೀಣ್ಯ',
    zone: 'North-West',
    stressIndex: 55,
    cauveryCoverage: 'Partial',
    eligibleProperties: 45000,
    registeredSystems: 0,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 30, y: 32 },
    description: 'Industrial and commercial zone with large shed rooftops perfect for high-yield collection.'
  },
  {
    id: 'shivajinagar',
    name: 'Shivajinagar, Frazer Town',
    kannadaName: 'ಶಿವಾಜಿನಗರ, ಫ್ರೇಜರ್ ಟೌನ್',
    zone: 'Central Bengaluru',
    stressIndex: 48,
    cauveryCoverage: 'Full',
    eligibleProperties: 20000,
    registeredSystems: 0,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 52, y: 46 },
    description: 'Old cantonment settlement with piped BWSSB network; small plot sizes where compact filter tanks fit best.'
  },
  {
    id: 'shantinagar',
    name: 'Shantinagar, Richmond Town',
    kannadaName: 'ಶಾಂತಿನಗರ, ರಿಚ್ಮಂಡ್ ಟೌನ್',
    zone: 'Central Bengaluru',
    stressIndex: 45,
    cauveryCoverage: 'Full',
    eligibleProperties: 18000,
    registeredSystems: 0,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 50, y: 54 },
    description: 'Core CBD and leafy layouts with stable municipal supply, but high storm-runoff pressure on old stormwater drains.'
  },
  {
    id: 'basavanagudi',
    name: 'Basavanagudi, VV Puram',
    kannadaName: 'ಬಸವನಗುಡಿ, ವಿ.ವಿ ಪುರಂ',
    zone: 'South-Central',
    stressIndex: 42,
    cauveryCoverage: 'Full',
    eligibleProperties: 30000,
    registeredSystems: 1,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 42, y: 62 },
    description: 'Heritage residential area with heritage rain harvesting traditions and mature trees.'
  },
  {
    id: 'rajajinagar',
    name: 'Rajajinagar, Vijayanagar',
    kannadaName: 'ರಾಜಾಜಿನಗರ, ವಿಜಯನಗರ',
    zone: 'West Bengaluru',
    stressIndex: 40,
    cauveryCoverage: 'Full',
    eligibleProperties: 45000,
    registeredSystems: 1,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 32, y: 48 },
    description: 'Densely populated residential blocks with 30x40 and 60x40 layouts; BWSSB piped connection.'
  },
  {
    id: 'banashankari',
    name: 'Banashankari, Kengeri',
    kannadaName: 'ಬನಶಂಕರಿ, ಕೆಂಗೇರಿ',
    zone: 'South-West',
    stressIndex: 38,
    cauveryCoverage: 'Full',
    eligibleProperties: 60000,
    registeredSystems: 1,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 30, y: 72 },
    description: 'Expansive hilly terrain; high potential for gravity-fed infiltration trenches.'
  },
  {
    id: 'malleswaram',
    name: 'Malleswaram, Seshadripuram',
    kannadaName: 'ಮಲ್ಲೇಶ್ವರಂ, ಶೇಷಾದ್ರಿಪುರಂ',
    zone: 'North-Central',
    stressIndex: 35,
    cauveryCoverage: 'Full',
    eligibleProperties: 25000,
    registeredSystems: 0,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 40, y: 40 },
    description: 'Older established grid layouts with full Cauvery water connection.'
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar, JP Nagar',
    kannadaName: 'ಜಯನಗರ, ಜೆ.ಪಿ ನಗರ',
    zone: 'South Bengaluru',
    stressIndex: 30,
    cauveryCoverage: 'Full',
    eligibleProperties: 55000,
    registeredSystems: 2,
    openReports: 0,
    concernFlag: 'None',
    coordinates: { x: 46, y: 72 },
    description: 'Pioneering ward for RWH demonstration centres and rooftop rainwater injection.'
  }
];

export const ROOF_RUNOFF_MAP: Record<RoofSurface, number> = {
  'Concrete terrace (RCC)': 0.80,
  'Clay or Mangalore tile': 0.75,
  'Metal sheet': 0.90,
  'Asbestos or cement sheet': 0.85
};

export const SOIL_DRAINAGE_MAP: Record<SoilType, boolean> = {
  'Red soil or laterite': true,
  'Sandy or gravelly': true,
  'Clayey or black soil': false,
  'Hard rock close to surface': false
};

export const WATER_SOURCE_PRICES: Record<MainWaterSource, number> = {
  'Private tanker': 0.120, // ₹0.12/L (approx ₹1,440 for 12 kL tanker)
  'BWSSB piped supply': 0.040, // ₹0.04/L (subsidized domestic municipal tariff)
  'Own borewell': 0.010 // ₹0.01/L (electricity pumping & motor upkeep)
};

export const MONTHLY_RAIN_PATTERN: MonthlyRainData[] = [
  { month: 'Jan', typicalRainMm: 2, shareOfYearPct: 0.2 },
  { month: 'Feb', typicalRainMm: 5, shareOfYearPct: 0.5 },
  { month: 'Mar', typicalRainMm: 11, shareOfYearPct: 1.2 },
  { month: 'Apr', typicalRainMm: 40, shareOfYearPct: 4.2 },
  { month: 'May', typicalRainMm: 115, shareOfYearPct: 12.1 },
  { month: 'Jun', typicalRainMm: 80, shareOfYearPct: 8.4 },
  { month: 'Jul', typicalRainMm: 110, shareOfYearPct: 11.6 },
  { month: 'Aug', typicalRainMm: 140, shareOfYearPct: 14.7 },
  { month: 'Sep', typicalRainMm: 195, shareOfYearPct: 20.5 },
  { month: 'Oct', typicalRainMm: 180, shareOfYearPct: 18.9 },
  { month: 'Nov', typicalRainMm: 55, shareOfYearPct: 5.8 },
  { month: 'Dec', typicalRainMm: 18, shareOfYearPct: 1.9 },
];

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'rep-001',
    receiptNumber: 'BLR-RWH-2026-0812',
    timestamp: '2026-10-08 09:30',
    area: 'Whitefield, Mahadevapura',
    streetLandmark: 'ECC Road near ITPL back gate',
    category: 'Groundwater concern',
    description: 'Private water tanker charges increased to ₹2,200 for 10,000L. Layout community borewell went completely dry below 1,150 ft depth. Urgent rooftop recharge support needed.',
    status: 'Assigned',
    assignedDepartment: 'BWSSB',
    editorNote: 'BWSSB sub-division notified. Area tagged for accelerated recharge well audit.'
  },
  {
    id: 'rep-002',
    receiptNumber: 'BLR-RWH-2026-0814',
    timestamp: '2026-10-08 14:15',
    area: 'Bellandur, Varthur',
    streetLandmark: 'Green Glen Layout, near storm drain culvert',
    category: 'Overflowing storm drain',
    description: 'During 30-minute rain shower, roof runoff backed up into street because storm drain is silted with construction debris. Downpour water wasted instead of percolating.',
    status: 'Acknowledged',
    assignedDepartment: 'City corporation, storm water drains',
    editorNote: 'Assigned to BBMP Stormwater Drains division for desilting drive.'
  },
  {
    id: 'rep-003',
    receiptNumber: 'BLR-RWH-2026-0819',
    timestamp: '2026-10-09 11:05',
    area: 'KR Puram',
    streetLandmark: 'Bhattarahalli main road cross',
    category: 'Waterlogging',
    description: 'Road inundated under 1.5 ft water after sudden thunderstorm. Neighboring commercial sheds have no rainwater collection downpipes, discharging 100% roof rain straight onto asphalt.',
    status: 'Submitted',
    assignedDepartment: 'City corporation, storm water drains',
    editorNote: 'Pending page editor verification.'
  },
  {
    id: 'rep-004',
    receiptNumber: 'BLR-RWH-2026-0822',
    timestamp: '2026-10-09 16:40',
    area: 'Yelahanka',
    streetLandmark: 'Kogilu main road, 4th Cross',
    category: 'Broken RWH structure',
    description: 'RWH recharge pit concrete cover cracked due to vehicle movement. Inflow mesh chocked with leaves causing clean rain to bypass to sewer.',
    status: 'Acknowledged',
    assignedDepartment: 'BWSSB',
    editorNote: 'Notified local ward inspector; citizen advised on filter replacement.'
  }
];

export const INITIAL_REGISTERED_SYSTEMS: RegisteredSystem[] = [
  {
    id: 'sys-001',
    timestamp: '2026-09-15',
    area: 'Whitefield, Mahadevapura',
    propertyType: 'Apartment complex',
    roofAreaSqFt: 14000,
    tankCapacityLitres: 45000,
    rechargeStructure: '3 Recharge Wells (12m deep)',
    installedBy: 'Sobha Rainwater Green Volunteers',
    status: 'Installed'
  },
  {
    id: 'sys-002',
    timestamp: '2026-09-18',
    area: 'Whitefield, Mahadevapura',
    propertyType: 'Independent house',
    roofAreaSqFt: 2200,
    tankCapacityLitres: 4000,
    rechargeStructure: 'Recharge well linked to 850ft borewell',
    installedBy: 'Suresh Rao',
    status: 'Installed'
  },
  {
    id: 'sys-003',
    timestamp: '2026-09-22',
    area: 'Whitefield, Mahadevapura',
    propertyType: 'Commercial or institution',
    roofAreaSqFt: 18500,
    tankCapacityLitres: 60000,
    rechargeStructure: 'Recharge well + 2 percolation trenches',
    installedBy: 'Prestige Tech Park Eco Team',
    status: 'Installed'
  },
  {
    id: 'sys-004',
    timestamp: '2026-09-29',
    area: 'Whitefield, Mahadevapura',
    propertyType: 'Independent house',
    roofAreaSqFt: 1800,
    tankCapacityLitres: 3500,
    rechargeStructure: 'Recharge pit with geotextile filter',
    installedBy: 'Anita Narayanan',
    status: 'Being built'
  },
  {
    id: 'sys-005',
    timestamp: '2026-09-10',
    area: 'Devanahalli outskirts',
    propertyType: 'Independent house',
    roofAreaSqFt: 3200,
    tankCapacityLitres: 8000,
    rechargeStructure: 'Direct deep aquifer injection well',
    installedBy: 'Dr. Venkatesh Farm',
    status: 'Installed'
  },
  {
    id: 'sys-006',
    timestamp: '2026-09-12',
    area: 'Bellandur, Varthur',
    propertyType: 'Apartment complex',
    roofAreaSqFt: 22000,
    tankCapacityLitres: 80000,
    rechargeStructure: 'Dual chamber filter + 4 Recharge wells',
    installedBy: 'Adarsh Palm Meadows RWA',
    status: 'Installed'
  },
  {
    id: 'sys-007',
    timestamp: '2026-09-25',
    area: 'Bellandur, Varthur',
    propertyType: 'Independent house',
    roofAreaSqFt: 2400,
    tankCapacityLitres: 5000,
    rechargeStructure: 'Storage tank + Recharge well',
    installedBy: 'Kishore Kumar',
    status: 'Installed'
  },
  {
    id: 'sys-008',
    timestamp: '2026-09-08',
    area: 'KR Puram',
    propertyType: 'Independent house',
    roofAreaSqFt: 1600,
    tankCapacityLitres: 3000,
    rechargeStructure: 'Recharge pit',
    installedBy: 'Manjunath Swamy',
    status: 'Installed'
  },
  {
    id: 'sys-009',
    timestamp: '2026-09-19',
    area: 'KR Puram',
    propertyType: 'Commercial or institution',
    roofAreaSqFt: 8000,
    tankCapacityLitres: 20000,
    rechargeStructure: '2 Recharge Wells',
    installedBy: 'Silicon City Academy',
    status: 'Installed'
  },
  {
    id: 'sys-010',
    timestamp: '2026-10-01',
    area: 'KR Puram',
    propertyType: 'Independent house',
    roofAreaSqFt: 2100,
    tankCapacityLitres: 4000,
    rechargeStructure: 'Storage tank with safe overflow',
    installedBy: 'Pradeep Gowda',
    status: 'Planned'
  },
  {
    id: 'sys-011',
    timestamp: '2026-09-04',
    area: 'Yelahanka',
    propertyType: 'Independent house',
    roofAreaSqFt: 1800,
    tankCapacityLitres: 3000,
    rechargeStructure: 'Storage tank plus recharge well',
    installedBy: 'Abhishek Jogi (Example Plan)',
    status: 'Installed'
  },
  {
    id: 'sys-012',
    timestamp: '2026-09-17',
    area: 'Yelahanka',
    propertyType: 'Apartment complex',
    roofAreaSqFt: 16000,
    tankCapacityLitres: 50000,
    rechargeStructure: '3 Recharge wells + sand filtration',
    installedBy: 'Rail Wheel Factory Colony',
    status: 'Installed'
  },
  {
    id: 'sys-013',
    timestamp: '2026-09-28',
    area: 'Yelahanka',
    propertyType: 'Independent house',
    roofAreaSqFt: 2400,
    tankCapacityLitres: 4500,
    rechargeStructure: 'Recharge pit with aggregate voids',
    installedBy: 'Savitha Ramesh',
    status: 'Installed'
  },
  {
    id: 'sys-014',
    timestamp: '2026-09-14',
    area: 'Electronic City, Hosur Road',
    propertyType: 'Commercial or institution',
    roofAreaSqFt: 25000,
    tankCapacityLitres: 90000,
    rechargeStructure: 'Recharge well battery (4 units)',
    installedBy: 'Wipro Campus Sustainability Cell',
    status: 'Installed'
  },
  {
    id: 'sys-015',
    timestamp: '2026-09-26',
    area: 'Electronic City, Hosur Road',
    propertyType: 'Independent house',
    roofAreaSqFt: 1900,
    tankCapacityLitres: 3500,
    rechargeStructure: 'Storage tank + Recharge well',
    installedBy: 'Vinay Bhaskar',
    status: 'Installed'
  },
  {
    id: 'sys-016',
    timestamp: '2026-09-11',
    area: 'HSR, Bommanahalli',
    propertyType: 'Independent house',
    roofAreaSqFt: 2400,
    tankCapacityLitres: 4000,
    rechargeStructure: 'Storage tank + Recharge pit',
    installedBy: 'Deepa Srinivas, Sector 2',
    status: 'Installed'
  },
  {
    id: 'sys-017',
    timestamp: '2026-09-23',
    area: 'HSR, Bommanahalli',
    propertyType: 'Independent house',
    roofAreaSqFt: 3000,
    tankCapacityLitres: 6000,
    rechargeStructure: 'Recharge well connected to borewell',
    installedBy: 'Raghuveer Murthy, Sector 6',
    status: 'Installed'
  },
  {
    id: 'sys-018',
    timestamp: '2026-09-07',
    area: 'Hebbal, Jakkur',
    propertyType: 'Independent house',
    roofAreaSqFt: 2000,
    tankCapacityLitres: 3500,
    rechargeStructure: 'Recharge pit',
    installedBy: 'Karthik Somanna',
    status: 'Installed'
  },
  {
    id: 'sys-019',
    timestamp: '2026-09-21',
    area: 'Hebbal, Jakkur',
    propertyType: 'Apartment complex',
    roofAreaSqFt: 12000,
    tankCapacityLitres: 35000,
    rechargeStructure: 'Recharge well system',
    installedBy: 'Jakkur Aerodrome Enclave',
    status: 'Installed'
  },
  {
    id: 'sys-020',
    timestamp: '2026-09-05',
    area: 'Basavanagudi, VV Puram',
    propertyType: 'Independent house',
    roofAreaSqFt: 2400,
    tankCapacityLitres: 4000,
    rechargeStructure: 'Ferrocement tank + traditional recharge well',
    installedBy: 'Narasimha Murthy',
    status: 'Installed'
  },
  {
    id: 'sys-021',
    timestamp: '2026-09-16',
    area: 'Rajajinagar, Vijayanagar',
    propertyType: 'Independent house',
    roofAreaSqFt: 1800,
    tankCapacityLitres: 3000,
    rechargeStructure: 'Pop-up filter + storage tank',
    installedBy: 'Shreedhar K',
    status: 'Installed'
  },
  {
    id: 'sys-022',
    timestamp: '2026-09-13',
    area: 'Banashankari, Kengeri',
    propertyType: 'Independent house',
    roofAreaSqFt: 2200,
    tankCapacityLitres: 4000,
    rechargeStructure: 'Recharge trench with gravel filter',
    installedBy: 'Chaitra Hegde',
    status: 'Installed'
  },
  {
    id: 'sys-023',
    timestamp: '2026-09-03',
    area: 'Jayanagar, JP Nagar',
    propertyType: 'Independent house',
    roofAreaSqFt: 2800,
    tankCapacityLitres: 5000,
    rechargeStructure: 'Recharge well + 2-stage filter',
    installedBy: 'Gopal Krishna, 4th Block',
    status: 'Installed'
  },
  {
    id: 'sys-024',
    timestamp: '2026-09-18',
    area: 'Jayanagar, JP Nagar',
    propertyType: 'Commercial or institution',
    roofAreaSqFt: 15000,
    tankCapacityLitres: 40000,
    rechargeStructure: 'Recharge well system',
    installedBy: 'National College Campus',
    status: 'Installed'
  }
];

export const CATEGORY_DEPARTMENT_MAP: Record<ReportCategory, Department> = {
  'Waterlogging': 'City corporation, storm water drains',
  'Overflowing storm drain': 'City corporation, storm water drains',
  'Broken RWH structure': 'BWSSB',
  'Groundwater concern': 'BWSSB',
  'Other': 'Other'
};

export const OFFICIAL_CHANNELS = {
  bwssbHelpline: '1916',
  bwssbWhatsApp: '+91 87622 28888',
  bbmpHelpline: '1533',
  karnatakaGroundwaterAuthority: '080-22262744',
  bwssbRwhThemePark: '40th Cross, 5th Block, Jayanagar (Free Technical Advice & Live Demos)'
};
