import { describe, it, expect } from 'vitest';
import { calculateTripBudget, RESORTS, GULMARG_GONDOLA_RATES_2026_27 } from './indiaSkiData';

describe('India Ski Trip Calculator Engine', () => {
  it('calculates 5-day Gulmarg intermediate trip correctly', () => {
    const result = calculateTripBudget({
      resortId: 'gulmarg',
      discipline: 'ski',
      skillTrack: 'intermediate',
      daysOnSnow: 5,
      totalTripDays: 6,
      groupSize: 2,
      needClothingRental: true,
      needTangmargTransfer: true,
      needPrivateInstructor: false,
      accommodationType: 'mid',
      isIndianResident: true,
      currency: 'INR',
    });

    expect(result.totalInr).toBeGreaterThan(0);
    expect(result.perPersonInr).toBe(Math.round(result.totalInr / 2));
    expect(result.displayTotal).toContain('₹');
    // Check that lift passes include Phase 1 skier passes
    const liftPassItem = result.items.find(i => i.category === 'Lift Passes');
    expect(liftPassItem).toBeDefined();
    expect(liftPassItem?.confidence).toBe('VERIFIED_OFFICIAL');
  });

  it('adjusts rates when snowboarding is selected', () => {
    const skiResult = calculateTripBudget({
      resortId: 'gulmarg',
      discipline: 'ski',
      skillTrack: 'intermediate',
      daysOnSnow: 3,
      totalTripDays: 3,
      groupSize: 1,
      needClothingRental: false,
      needTangmargTransfer: false,
      needPrivateInstructor: false,
      accommodationType: 'budget',
      isIndianResident: true,
      currency: 'INR',
    });

    const snowboardResult = calculateTripBudget({
      resortId: 'gulmarg',
      discipline: 'snowboard',
      skillTrack: 'intermediate',
      daysOnSnow: 3,
      totalTripDays: 3,
      groupSize: 1,
      needClothingRental: false,
      needTangmargTransfer: false,
      needPrivateInstructor: false,
      accommodationType: 'budget',
      isIndianResident: true,
      currency: 'INR',
    });

    // Snowboard rental is 1200/day vs Ski rental 700/day (difference of 500 * 3 = 1500)
    expect(snowboardResult.totalInr).toBeGreaterThan(skiResult.totalInr);
    expect(snowboardResult.totalInr - skiResult.totalInr).toBe(1500);
  });

  it('handles government course track accurately', () => {
    const govtResult = calculateTripBudget({
      resortId: 'gulmarg',
      discipline: 'ski',
      skillTrack: 'govtCourse',
      daysOnSnow: 14,
      totalTripDays: 14,
      groupSize: 1,
      needClothingRental: false,
      needTangmargTransfer: false,
      needPrivateInstructor: false,
      accommodationType: 'budget',
      isIndianResident: true,
      currency: 'INR',
    });

    const courseItem = govtResult.items.find(i => i.category === 'Course & Training');
    expect(courseItem).toBeDefined();
    expect(courseItem?.amountInr).toBe(20000); // 2026-27 IISM fee for Indian resident above 25
  });

  it('converts to foreign currencies properly', () => {
    const usdResult = calculateTripBudget({
      resortId: 'gulmarg',
      discipline: 'ski',
      skillTrack: 'intermediate',
      daysOnSnow: 3,
      totalTripDays: 4,
      groupSize: 1,
      needClothingRental: false,
      needTangmargTransfer: false,
      needPrivateInstructor: false,
      accommodationType: 'mid',
      isIndianResident: false,
      currency: 'USD',
    });

    expect(usdResult.displayTotal).toContain('$');
    expect(usdResult.displayPerPerson).toContain('$');
  });
});
