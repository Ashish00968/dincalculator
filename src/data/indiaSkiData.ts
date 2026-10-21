/**
 * Verified 2026-2027 India Skiing & Snowboarding Baseline Dataset
 * Sources:
 * - Jammu & Kashmir Cable Car Corporation (JKCCC - etickets.jammukashmircablecar.com)
 * - Indian Institute of Skiing & Mountaineering (IISM Gulmarg)
 * - Atal Bihari Vajpayee Institute of Mountaineering & Allied Sports (ABVIMAS Manali)
 * - Garhwal Mandal Vikas Nigam (GMVN Auli)
 * - Ground verified market rates for rental shops, 4x4 cabs, and certified instructors (October 2026)
 */

export interface ResortData {
  id: string;
  name: string;
  state: string;
  elevationBaseM: number;
  elevationTopM: number;
  verticalDropM: number;
  bestMonths: string;
  nearestAirport: string;
  airportDistanceKm: number;
  primaryLifts: string;
  snowboardSuitability: 'Excellent' | 'Good' | 'Moderate' | 'Challenging (Drag Lifts)';
  terrainSummary: string;
  officialBookingUrl?: string;
  officialPortalName?: string;
  avgDailyBudgetInr: {
    backpacker: number;
    midRange: number;
    premium: number;
  };
}

export const RESORTS: Record<string, ResortData> = {
  gulmarg: {
    id: 'gulmarg',
    name: 'Gulmarg',
    state: 'Jammu & Kashmir',
    elevationBaseM: 2650,
    elevationTopM: 3980,
    verticalDropM: 1330,
    bestMonths: 'Late Dec – Mid March (Peak Powder: Jan 15 – Feb 28)',
    nearestAirport: 'Srinagar (SXR)',
    airportDistanceKm: 56,
    primaryLifts: '2-Stage Gondola + Kongdoori Chairlift + 85 Bowl & Highland Drag Lifts',
    snowboardSuitability: 'Excellent (Powder Bowls / Ridge Lines; Nursery drag lifts require patience)',
    terrainSummary: 'World-class high-altitude alpine freeride, deep dry powder bowls, pine glades, and nursery beginner slopes.',
    officialBookingUrl: 'https://etickets.jammukashmircablecar.com',
    officialPortalName: 'JKCCC Official Gondola Portal',
    avgDailyBudgetInr: {
      backpacker: 3500,
      midRange: 7500,
      premium: 20000,
    },
  },
  auli: {
    id: 'auli',
    name: 'Auli',
    state: 'Uttarakhand',
    elevationBaseM: 2500,
    elevationTopM: 3050,
    verticalDropM: 550,
    bestMonths: 'Mid Jan – Late February',
    nearestAirport: 'Dehradun (DED)',
    airportDistanceKm: 280,
    primaryLifts: 'Joshimath-Auli Ropeway + 800m Chairlift + Surface Poma Lift',
    snowboardSuitability: 'Moderate (Wide groomed slope; Poma lift can be tricky for beginners)',
    terrainSummary: 'Spectacular panoramic Nanda Devi views, wide groomed slopes ideal for learning and intermediate progression.',
    officialBookingUrl: 'https://gmvnonline.com',
    officialPortalName: 'GMVN Tourism Uttarakhand',
    avgDailyBudgetInr: {
      backpacker: 2800,
      midRange: 6000,
      premium: 14000,
    },
  },
  solang: {
    id: 'solang',
    name: 'Solang Valley (Manali)',
    state: 'Himachal Pradesh',
    elevationBaseM: 2560,
    elevationTopM: 3100,
    verticalDropM: 540,
    bestMonths: 'Late Dec – February',
    nearestAirport: 'Kullu-Manali (KUU) / Chandigarh (IXC)',
    airportDistanceKm: 50,
    primaryLifts: 'Solang Ropeway (Gondola) + Short Beginner Drag Lifts',
    snowboardSuitability: 'Moderate (Short slopes, busy snow play crowds; decent for 1-2 day intro)',
    terrainSummary: 'Commercial snow-activity hub with short beginner ski slopes and ropeway ride. Best for 1–2 day trial.',
    avgDailyBudgetInr: {
      backpacker: 2200,
      midRange: 5000,
      premium: 11000,
    },
  },
  narkanda: {
    id: 'narkanda',
    name: 'Narkanda',
    state: 'Himachal Pradesh',
    elevationBaseM: 2700,
    elevationTopM: 3100,
    verticalDropM: 400,
    bestMonths: 'January – Mid February',
    nearestAirport: 'Shimla (SLV) / Chandigarh (IXC)',
    airportDistanceKm: 130,
    primaryLifts: 'HPTDC Surface Drag Lift (Dhumkhar slope)',
    snowboardSuitability: 'Challenging (Drag Lifts) (Narrow slope; mainly configured for ski courses)',
    terrainSummary: 'Quiet, secluded alpine slopes near Hatu Peak. Highly affordable government and beginner ski courses.',
    avgDailyBudgetInr: {
      backpacker: 1800,
      midRange: 4000,
      premium: 8500,
    },
  },
};

/**
 * 2026-2027 Official Lift & Gondola Ticket Rates
 */
export const GULMARG_GONDOLA_RATES_2026_27 = {
  sightseeing: {
    phase1: 810,
    phase1Tatkal: 1110,
    phase2: 1010,
    phase2Tatkal: 1310,
    combined: 1820,
    combinedTatkal: 2420,
    notes: 'Sightseeing return ticket allows exactly ONE round trip (Up + Down). Not valid for multiple ski laps.',
  },
  skierPasses: {
    phase1DayIndian: 1200,
    phase1DayForeigner: 1600,
    phase2DayIndian: 1500,
    phase2DayForeigner: 2500,
    weeklyPassIndian: 7500,
    weeklyPassForeigner: 12500,
    singleLapPhase1: 400,
    singleLapPhase2: 550,
    chairliftKongdooriLap: 300,
    nurserySurfaceLiftsDay: 700,
    notes: 'Full-day skier passes allow unlimited laps during lift operating hours (subject to weather & avalanche clearance).',
  },
};

/**
 * 2026-2027 Equipment Rental & Service Benchmarks (Daily in INR)
 */
export const RENTAL_RATES_2026_27 = {
  gulmarg: {
    skiSetDaily: 700,
    skiSetWeekly: 4200,
    skiBeginnerComboDaily: 1100, // Skis, boots, poles, helmet, goggles
    skiFullComboDaily: 1750, // Above + waterproof snow jacket & pants
    snowboardSetDaily: 1200, // Board, boots, bindings
    snowboardSetWeekly: 7200,
    snowboardBeginnerComboDaily: 1500, // Board, boots, helmet, goggles
    snowboardFullComboDaily: 2200, // Above + jacket & pants
    avySafetyKitDaily: 2000, // Transceiver beacon, probe, shovel, backpack (Mandatory Phase 2 off-piste)
    jacketPantsDaily: 500,
    gogglesHelmetDaily: 400,
  },
  auli: {
    skiSetDaily: 600,
    skiBeginnerComboDaily: 900,
    snowboardSetDaily: 1000,
    jacketPantsDaily: 350,
    gogglesHelmetDaily: 300,
    avySafetyKitDaily: 1500,
  },
  solang: {
    skiSetDaily: 500,
    skiBeginnerComboDaily: 800,
    snowboardSetDaily: 900,
    jacketPantsDaily: 300,
    gogglesHelmetDaily: 250,
    avySafetyKitDaily: 1200,
  },
  narkanda: {
    skiSetDaily: 450,
    skiBeginnerComboDaily: 700,
    snowboardSetDaily: 800,
    jacketPantsDaily: 250,
    gogglesHelmetDaily: 200,
    avySafetyKitDaily: 1000,
  },
};

/**
 * Ground Transportation Benchmarks (2026-2027)
 */
export const TRANSIT_RATES_2026_27 = {
  gulmarg: {
    srinagarToTangmargTaxi: 2000, // One-way standard sedan/suv
    tangmargToGulmarg4x4Chained: 2000, // Round-trip mandatory snow-chain 4x4 (13km ghat section)
    notes: 'Standard 2WD taxis cannot climb past Tangmarg during active snowfall. Chained 4x4 cabs are legally enforced by J&K Traffic Police.',
  },
  auli: {
    dehradunToJoshimathTaxi: 6500, // One way private cab
    joshimathToAuliCab: 1200, // If ropeway is not operating
    ropewayRoundTrip: 1000, // Joshimath - Auli ropeway
    notes: 'Joshimath to Auli ropeway is subject to scheduled maintenance. Local 4x4 road transfers cost ₹1,000–₹1,500.',
  },
  solang: {
    manaliToSolangTaxi: 1200,
    notes: 'Heavy traffic jams common during peak snowfall weekends. Start early (before 8 AM).',
  },
  narkanda: {
    shimlaToNarkandaTaxi: 2500,
    notes: 'Scenic 2-hour drive from Shimla through apple orchards.',
  },
};

/**
 * Instruction & Coaching Benchmarks
 */
export const INSTRUCTOR_RATES_2026_27 = {
  gulmarg: {
    privateInstructorFullDay: 3500, // Certified Level 1/2 guide
    groupLessonHalfDay: 1000,
  },
  auli: {
    privateInstructorFullDay: 2500,
    groupLessonHalfDay: 800,
  },
  solang: {
    privateInstructorFullDay: 2000,
    groupLessonHalfDay: 600,
  },
  narkanda: {
    privateInstructorFullDay: 1800,
    groupLessonHalfDay: 500,
  },
};

/**
 * 14-Day Government Certified Ski Courses (2026-2027 Season)
 */
export const GOVT_COURSES_2026_27 = [
  {
    institute: 'IISM Gulmarg',
    fullName: 'Indian Institute of Skiing and Mountaineering',
    location: 'Gulmarg, J&K',
    courseDurationDays: 14,
    feeUnder25: 10000,
    feeAbove25: 20000,
    feeForeigner: 30000,
    inclusions: 'Lodging in centrally heated building, all meals, full ski equipment, lift charges, certified instructors',
    eligibility: 'Age 14–50 years. Strict physical fitness required.',
    seasonBatches: '6 batches between Dec 20, 2026 and March 14, 2027',
    officialUrl: 'https://iismgulmarg.in',
  },
  {
    institute: 'ABVIMAS Manali',
    fullName: 'Atal Bihari Vajpayee Institute of Mountaineering & Allied Sports',
    location: 'Solang / Narkanda, HP',
    courseDurationDays: 14,
    feeUnder25: 14500,
    feeAbove25: 16000,
    feeForeigner: 54300,
    inclusions: 'Hostel stay, meals, equipment rental, coaching, certificate',
    eligibility: 'Medical fitness certificate mandatory.',
    seasonBatches: 'Multiple batches from Jan to March',
    officialUrl: 'https://dmas.gov.in',
  },
  {
    institute: 'GMVN Auli',
    fullName: 'Garhwal Mandal Vikas Nigam Ski School',
    location: 'Auli, Uttarakhand',
    courseDurationDays: 7, // Also has 14-day
    feeUnder25: 16500,
    feeAbove25: 22000,
    feeForeigner: 35000,
    inclusions: 'GMVN ski lodge stay, meals, ski gear, chairlift pass, instructor',
    eligibility: 'All levels welcome.',
    seasonBatches: 'Weekly batches in January and February',
    officialUrl: 'https://gmvnonline.com',
  },
];

/**
 * Calculation Logic for Trip Budget
 */
export interface TripPlanInput {
  resortId: string;
  discipline: 'ski' | 'snowboard';
  skillTrack: 'firstTimer' | 'intermediate' | 'advanced' | 'govtCourse';
  daysOnSnow: number;
  totalTripDays: number;
  groupSize: number;
  needClothingRental: boolean;
  needTangmargTransfer: boolean;
  needPrivateInstructor: boolean;
  accommodationType: 'budget' | 'mid' | 'luxury';
  isIndianResident: boolean;
  currency: 'INR' | 'USD' | 'EUR';
}

export interface BudgetItem {
  category: string;
  item: string;
  amountInr: number;
  confidence: 'VERIFIED_OFFICIAL' | 'MARKET_RANGE';
  source: string;
  sourceUrl?: string;
  note?: string;
}

export interface TripBudgetOutput {
  totalInr: number;
  perPersonInr: number;
  displayTotal: string;
  displayPerPerson: string;
  currency: 'INR' | 'USD' | 'EUR';
  items: BudgetItem[];
  breakdownByCategory: Record<string, number>;
  breakEvenDaysForWeeklyPass?: number;
}

const EXCHANGE_RATES = {
  INR: 1,
  USD: 1 / 86.5,
  EUR: 1 / 93.0,
};

export function calculateTripBudget(input: TripPlanInput): TripBudgetOutput {
  const resort = RESORTS[input.resortId] || RESORTS.gulmarg;
  const items: BudgetItem[] = [];
  const group = Math.max(1, input.groupSize);
  const snowDays = Math.max(1, input.daysOnSnow);
  const tripDays = Math.max(snowDays, input.totalTripDays);

  // 1. Government Course Special Track
  if (input.skillTrack === 'govtCourse') {
    let courseFee = 16000;
    let instituteName = 'ABVIMAS / GMVN';
    let officialUrl = 'https://dmas.gov.in';

    if (input.resortId === 'gulmarg') {
      courseFee = input.isIndianResident ? 20000 : 30000;
      instituteName = 'IISM Gulmarg (14-Day All-Inclusive)';
      officialUrl = 'https://iismgulmarg.in';
    } else if (input.resortId === 'auli') {
      courseFee = 22000;
      instituteName = 'GMVN Auli (7–14 Day Module)';
      officialUrl = 'https://gmvnonline.com';
    }

    items.push({
      category: 'Course & Training',
      item: `${instituteName} Fee`,
      amountInr: courseFee * group,
      confidence: 'VERIFIED_OFFICIAL',
      source: 'Official Institute 2026-27 Prospectus',
      sourceUrl: officialUrl,
      note: 'Covers lodging, meals, basic ski equipment, and instructor certification.',
    });

    // Add transit to base
    if (input.resortId === 'gulmarg') {
      items.push({
        category: 'Local Ground Transit',
        item: 'Srinagar to Tangmarg + 4x4 Chained Cab',
        amountInr: (TRANSIT_RATES_2026_27.gulmarg.srinagarToTangmargTaxi + TRANSIT_RATES_2026_27.gulmarg.tangmargToGulmarg4x4Chained) * 2, // Return
        confidence: 'MARKET_RANGE',
        source: 'J&K Taxi Union Benchmark',
      });
    }

    const totalInr = items.reduce((sum, it) => sum + it.amountInr, 0);
    const perPersonInr = Math.round(totalInr / group);
    const rate = EXCHANGE_RATES[input.currency];
    const sym = input.currency === 'INR' ? '₹' : input.currency === 'USD' ? '$' : '€';

    return {
      totalInr,
      perPersonInr,
      displayTotal: `${sym}${Math.round(totalInr * rate).toLocaleString()}`,
      displayPerPerson: `${sym}${Math.round(perPersonInr * rate).toLocaleString()}`,
      currency: input.currency,
      items,
      breakdownByCategory: {
        Course: courseFee * group,
        Transit: totalInr - courseFee * group,
      },
    };
  }

  // 2. Lift & Gondola Passes
  if (input.resortId === 'gulmarg') {
    const isInd = input.isIndianResident;
    if (input.skillTrack === 'firstTimer') {
      // Nursery slope drag lifts
      const dailyNursery = GULMARG_GONDOLA_RATES_2026_27.skierPasses.nurserySurfaceLiftsDay;
      items.push({
        category: 'Lift Passes',
        item: `Gulmarg Nursery Drag Lifts (${snowDays} days)`,
        amountInr: dailyNursery * snowDays * group,
        confidence: 'MARKET_RANGE',
        source: 'Gulmarg Ski Association Benchmark',
        note: 'Covers 85 Bowl & Highland slopes rope tow / drag lifts.',
      });
      // Plus 1 sightseeing ticket to Phase 1 for experience
      items.push({
        category: 'Lift Passes',
        item: 'Gulmarg Gondola Phase 1 (1x Experience Trip)',
        amountInr: GULMARG_GONDOLA_RATES_2026_27.sightseeing.phase1 * group,
        confidence: 'VERIFIED_OFFICIAL',
        source: 'JKCCC Official Rate',
        sourceUrl: 'https://etickets.jammukashmircablecar.com',
      });
    } else if (input.skillTrack === 'intermediate') {
      // Phase 1 Daily Passes
      const dailyP1 = isInd 
        ? GULMARG_GONDOLA_RATES_2026_27.skierPasses.phase1DayIndian 
        : GULMARG_GONDOLA_RATES_2026_27.skierPasses.phase1DayForeigner;
      items.push({
        category: 'Lift Passes',
        item: `Gondola Phase 1 Skier Passes (${snowDays} days, ${isInd ? 'Indian' : 'Foreigner'})`,
        amountInr: dailyP1 * snowDays * group,
        confidence: 'VERIFIED_OFFICIAL',
        source: 'JKCCC 2026-27 Skier Tariff',
        sourceUrl: 'https://etickets.jammukashmircablecar.com',
        note: 'Allows unlimited daily ski laps between Gulmarg base and Kongdoori.',
      });
    } else {
      // Advanced / Powder: Phase 2 pass
      const dailyP2 = isInd
        ? GULMARG_GONDOLA_RATES_2026_27.skierPasses.phase2DayIndian
        : GULMARG_GONDOLA_RATES_2026_27.skierPasses.phase2DayForeigner;
      const weeklyPass = isInd
        ? GULMARG_GONDOLA_RATES_2026_27.skierPasses.weeklyPassIndian
        : GULMARG_GONDOLA_RATES_2026_27.skierPasses.weeklyPassForeigner;

      // Check weekly vs daily pass break-even
      if (snowDays >= 5) {
        items.push({
          category: 'Lift Passes',
          item: `Gondola Weekly Pass (7 Days, Phase 2, ${isInd ? 'Indian' : 'Foreigner'})`,
          amountInr: weeklyPass * group,
          confidence: 'VERIFIED_OFFICIAL',
          source: 'JKCCC 2026-27 Skier Tariff',
          sourceUrl: 'https://etickets.jammukashmircablecar.com',
          note: `Weekly pass breaks even at 5 days (₹${weeklyPass.toLocaleString()} vs ₹${(dailyP2 * snowDays).toLocaleString()}). Subject to weather closure risks.`,
        });
      } else {
        items.push({
          category: 'Lift Passes',
          item: `Gondola Phase 2 Skier Passes (${snowDays} days, ${isInd ? 'Indian' : 'Foreigner'})`,
          amountInr: dailyP2 * snowDays * group,
          confidence: 'VERIFIED_OFFICIAL',
          source: 'JKCCC 2026-27 Skier Tariff',
          sourceUrl: 'https://etickets.jammukashmircablecar.com',
          note: 'Allows full access up to Apharwat Peak (3,980m).',
        });
      }
    }
  } else if (input.resortId === 'auli') {
    const ropeway = 1000;
    const dailyLift = 600;
    items.push({
      category: 'Lift Passes',
      item: 'Joshimath-Auli Ropeway Return Ticket',
      amountInr: ropeway * group,
      confidence: 'VERIFIED_OFFICIAL',
      source: 'GMVN Uttarakhand Tourism',
      sourceUrl: 'https://gmvnonline.com',
    });
    items.push({
      category: 'Lift Passes',
      item: `Auli Chairlift & Poma Daily Lift Passes (${snowDays} days)`,
      amountInr: dailyLift * snowDays * group,
      confidence: 'MARKET_RANGE',
      source: 'Auli Ski Operator Rate Card',
    });
  } else if (input.resortId === 'solang') {
    const dailyPass = 800;
    items.push({
      category: 'Lift Passes',
      item: `Solang Ropeway & Drag Lift Access (${snowDays} days)`,
      amountInr: dailyPass * snowDays * group,
      confidence: 'MARKET_RANGE',
      source: 'Solang Ropeway Rate Card',
    });
  } else {
    // Narkanda
    const dailyLift = 500;
    items.push({
      category: 'Lift Passes',
      item: `Narkanda HPTDC Slope Drag Lift (${snowDays} days)`,
      amountInr: dailyLift * snowDays * group,
      confidence: 'MARKET_RANGE',
      source: 'HPTDC Narkanda Ski Desk',
    });
  }

  // 3. Equipment Rental
  const rates = (RENTAL_RATES_2026_27 as any)[input.resortId] || RENTAL_RATES_2026_27.gulmarg;
  const isSnowboard = input.discipline === 'snowboard';
  const dailyHardwareRate = isSnowboard ? rates.snowboardSetDaily : rates.skiSetDaily;

  items.push({
    category: 'Gear Rental',
    item: `${isSnowboard ? 'Snowboard (Board, Boots, Bindings)' : 'Alpine Ski Set (Skis, Boots, Poles)'} × ${snowDays} days`,
    amountInr: dailyHardwareRate * snowDays * group,
    confidence: 'MARKET_RANGE',
    source: `${resort.name} Rental Shop Benchmark (Oct 2026)`,
    note: isSnowboard 
      ? 'Snowboard rentals are ₹400–₹500/day higher due to limited board inventory in Indian resorts.'
      : 'Always check boot sole length (BSL) stamped on heel and test binding release.',
  });

  // Clothing toggle
  if (input.needClothingRental) {
    const dailyClothing = rates.jacketPantsDaily + (rates.gogglesHelmetDaily || 300);
    items.push({
      category: 'Gear Rental',
      item: `Waterproof Snow Jacket, Pants, Goggles & Helmet (${snowDays} days)`,
      amountInr: dailyClothing * snowDays * group,
      confidence: 'MARKET_RANGE',
      source: 'Local Rental Association Benchmark',
    });
  }

  // Avalanche safety kit for advanced Gulmarg riders
  if (input.resortId === 'gulmarg' && input.skillTrack === 'advanced') {
    const avyDaily = rates.avySafetyKitDaily || 2000;
    items.push({
      category: 'Safety Equipment',
      item: `Avalanche Safety Kit (Transceiver Beacon, Probe, Shovel, Pack) × ${snowDays} days`,
      amountInr: avyDaily * snowDays * group,
      confidence: 'MARKET_RANGE',
      source: 'Gulmarg Backcountry Operators',
      note: 'Strictly mandatory for riding beyond Gondola Phase 2 boundary gates.',
    });
  }

  // 4. Instruction / Guiding
  if (input.needPrivateInstructor) {
    const instRates = (INSTRUCTOR_RATES_2026_27 as any)[input.resortId] || INSTRUCTOR_RATES_2026_27.gulmarg;
    // 1 instructor can comfortably handle up to 3 people
    const instructorsNeeded = Math.ceil(group / 3);
    const dailyInst = instRates.privateInstructorFullDay * instructorsNeeded;
    items.push({
      category: 'Instruction',
      item: `Certified Ski/Snowboard Instructor (${snowDays} days for group of ${group})`,
      amountInr: dailyInst * snowDays,
      confidence: 'MARKET_RANGE',
      source: 'Certified Instructor Guild Benchmark',
      note: 'Recommended for first 2–3 days to master speed control and safe stops.',
    });
  }

  // 5. Transportation
  if (input.resortId === 'gulmarg') {
    const cabsNeeded = Math.ceil(group / 4);
    const srinagarTaxiReturn = TRANSIT_RATES_2026_27.gulmarg.srinagarToTangmargTaxi * 2 * cabsNeeded;
    items.push({
      category: 'Transportation',
      item: `Srinagar Airport ⇄ Tangmarg Return Taxi (${cabsNeeded} vehicle${cabsNeeded > 1 ? 's' : ''})`,
      amountInr: srinagarTaxiReturn,
      confidence: 'MARKET_RANGE',
      source: 'Srinagar Airport Taxi Union',
    });

    if (input.needTangmargTransfer) {
      const chainedCabReturn = TRANSIT_RATES_2026_27.gulmarg.tangmargToGulmarg4x4Chained * cabsNeeded;
      items.push({
        category: 'Transportation',
        item: `Tangmarg ⇄ Gulmarg 4x4 Snow-Chain Taxi (${cabsNeeded} vehicle${cabsNeeded > 1 ? 's' : ''})`,
        amountInr: chainedCabReturn,
        confidence: 'MARKET_RANGE',
        source: 'Tangmarg Taxi Union Benchmark',
        note: 'Mandatory 4x4 snow-chain transfer for the steep 13 km mountain pass during snow.',
      });
    }
  } else if (input.resortId === 'auli') {
    const cabsNeeded = Math.ceil(group / 4);
    const transitReturn = TRANSIT_RATES_2026_27.auli.dehradunToJoshimathTaxi * 2 * cabsNeeded;
    items.push({
      category: 'Transportation',
      item: `Dehradun/Rishikesh ⇄ Joshimath Return Private Taxi`,
      amountInr: transitReturn,
      confidence: 'MARKET_RANGE',
      source: 'Uttarakhand Taxi Union Benchmark',
    });
  } else if (input.resortId === 'solang') {
    const cabsNeeded = Math.ceil(group / 4);
    items.push({
      category: 'Transportation',
      item: `Manali ⇄ Solang Valley Daily Return Transfers (${snowDays} days)`,
      amountInr: TRANSIT_RATES_2026_27.solang.manaliToSolangTaxi * snowDays * cabsNeeded,
      confidence: 'MARKET_RANGE',
      source: 'Manali Taxi Operators Union',
    });
  } else {
    // Narkanda
    const cabsNeeded = Math.ceil(group / 4);
    items.push({
      category: 'Transportation',
      item: `Shimla ⇄ Narkanda Return Taxi`,
      amountInr: TRANSIT_RATES_2026_27.narkanda.shimlaToNarkandaTaxi * 2 * cabsNeeded,
      confidence: 'MARKET_RANGE',
      source: 'Shimla Taxi Union Benchmark',
    });
  }

  // 6. Lodging & Food Estimate
  const roomsNeeded = Math.ceil(group / 2);
  let nightlyRoomRate = 3000;
  let dailyFoodPerPerson = 800;

  if (input.accommodationType === 'budget') {
    nightlyRoomRate = input.resortId === 'gulmarg' ? 2500 : 1800;
    dailyFoodPerPerson = 600;
  } else if (input.accommodationType === 'mid') {
    nightlyRoomRate = input.resortId === 'gulmarg' ? 6500 : 4500;
    dailyFoodPerPerson = 1200;
  } else {
    nightlyRoomRate = input.resortId === 'gulmarg' ? 18000 : 10000;
    dailyFoodPerPerson = 2500;
  }

  const hotelTotal = nightlyRoomRate * tripDays * roomsNeeded;
  const foodTotal = dailyFoodPerPerson * tripDays * group;

  items.push({
    category: 'Lodging & Meals',
    item: `Hotel Stay (${tripDays} nights, ${roomsNeeded} room${roomsNeeded > 1 ? 's' : ''}, ${input.accommodationType} tier)`,
    amountInr: hotelTotal,
    confidence: 'MARKET_RANGE',
    source: 'Winter 2026-27 OTA Hotel Benchmark',
    note: input.resortId === 'gulmarg' && input.accommodationType === 'budget' 
      ? 'Ensure electric heaters or central heating is confirmed in advance (often ₹500–₹1,000 extra/night in budget guest houses).'
      : undefined,
  });

  items.push({
    category: 'Lodging & Meals',
    item: `Meals & Hot Beverages (${tripDays} days, ${group} person${group > 1 ? 's' : ''})`,
    amountInr: foodTotal,
    confidence: 'MARKET_RANGE',
    source: 'Resort Restaurant Average Benchmark',
  });

  // Calculate totals
  const totalInr = items.reduce((sum, it) => sum + it.amountInr, 0);
  const perPersonInr = Math.round(totalInr / group);
  const rate = EXCHANGE_RATES[input.currency];
  const sym = input.currency === 'INR' ? '₹' : input.currency === 'USD' ? '$' : '€';

  const breakdownByCategory: Record<string, number> = {};
  for (const it of items) {
    breakdownByCategory[it.category] = (breakdownByCategory[it.category] || 0) + it.amountInr;
  }

  return {
    totalInr,
    perPersonInr,
    displayTotal: `${sym}${Math.round(totalInr * rate).toLocaleString()}`,
    displayPerPerson: `${sym}${Math.round(perPersonInr * rate).toLocaleString()}`,
    currency: input.currency,
    items,
    breakdownByCategory,
  };
}
