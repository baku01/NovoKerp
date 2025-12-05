import { MeasurementResource, ProposalShift } from './types';
import { addDays, getDay, isSameDay } from 'date-fns';

// Helper to convert float hours (e.g. 8.30) to minutes
function floatTimeHMToMinutes(floatTime: number): number {
    if (!floatTime) return 0;
    const str = floatTime.toFixed(2);
    const [h, m] = str.split('.').map(Number);
    return (h * 60) + (m || 0);
}

// Helper to format minutes to HH:MM
export function minutesToHM(minutes: number): string {
    if (minutes <= 0) return "00:00";
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

// Calculate total minutes worked in a day given entry/exit times
// Handles overnight shifts
export function calculateWorkedMinutes(
    hent: number, hiin: number, htin: number, hter: number
): number {
    let start1 = floatTimeHMToMinutes(hent);
    let end1 = floatTimeHMToMinutes(hiin);
    let start2 = floatTimeHMToMinutes(htin);
    let end2 = floatTimeHMToMinutes(hter);

    let minutes = 0;

    // First period
    if (start1 > 0 && end1 > 0) {
        if (end1 < start1) end1 += 24 * 60; // Overnight
        minutes += (end1 - start1);
    }

    // Second period
    if (start2 > 0 && end2 > 0) {
        if (end2 < start2) end2 += 24 * 60; // Overnight
        minutes += (end2 - start2);
    }

    return minutes;
}

// Calculate Night Minutes (22:00 - 05:00)
// This is a simplified version of `calculaMinutosNoturnosCAB`
// 22:00 = 1320 min, 05:00 = 300 min (next day 24+5 = 29h = 1740 min)
export function calculateNightMinutes(
    hent: number, hiin: number, htin: number, hter: number
): number {
    const nightStart = 22 * 60; // 1320
    const nightEndNextDay = (24 + 5) * 60; // 1740 (05:00 next day)

    // We treat 00:00-05:00 as night of prev day if shift started prev day?
    // Or simpler: project intervals onto a timeline and intersect with night windows.
    // Legacy code seems complex. Let's try a robust interval intersection.

    const intervals = [];

    let s1 = floatTimeHMToMinutes(hent);
    let e1 = floatTimeHMToMinutes(hiin);
    if (s1 > 0 && e1 > 0) {
        if (e1 < s1) e1 += 24 * 60;
        intervals.push([s1, e1]);
    }

    let s2 = floatTimeHMToMinutes(htin);
    let e2 = floatTimeHMToMinutes(hter);
    if (s2 > 0 && e2 > 0) {
        if (e2 < s2) e2 += 24 * 60;
        intervals.push([s2, e2]);
    }

    let nightMinutes = 0;

    // Windows:
    // Day 0 Night: 22:00 (1320) -> 29:00 (1740) [05:00 next day]
    // Also consider pre-dawn? 00:00 -> 05:00 (0 -> 300)
    // If shift starts at 01:00 and ends 04:00, it is night.

    const checkIntersection = (start: number, end: number, winStart: number, winEnd: number) => {
        const s = Math.max(start, winStart);
        const e = Math.min(end, winEnd);
        return Math.max(0, e - s);
    };

    intervals.forEach(([start, end]) => {
        // Window 1: 00:00 - 05:00 (0 - 300)
        nightMinutes += checkIntersection(start, end, 0, 300);
        // Window 2: 22:00 - 29:00 (1320 - 1740)
        nightMinutes += checkIntersection(start, end, 1320, 1740);
        // Window 3: 46:00 (next day 22:00) ? Rare for typical shifts, usually < 24h duration.
        // Assuming max duration is within 24h + overlap.
    });

    return nightMinutes;
}

export function calculateHours(
    resource: MeasurementResource,
    shifts: ProposalShift[],
    mode: 'NORMAL' | 'EXTRA_60' | 'NIGHT_20' | 'SUNDAY_100' | 'NIGHT_FULL'
): string {
    const totalMinutes = calculateWorkedMinutes(resource.ap_hent, resource.ap_hiin, resource.ap_htin, resource.ap_hter);
    if (totalMinutes === 0) return "";

    const date = new Date(resource.ap_data); // Ensure string is parsed or passed as date
    const dayOfWeek = getDay(date) + 1; // 1 (Sun) - 7 (Sat) in Legacy? JS getDay is 0 (Sun) - 6 (Sat).
    // Legacy `lnIdDsem = ldApData.getDay(); ... lnIdDsem + 1` implies Sunday=1.
    // JS getDay(): 0=Sun, 1=Mon...
    // Legacy DSEM: 1=Sun?
    const legacyDayOfWeek = getDay(date) + 1;

    // Find shift definition
    const shift = shifts.find(s => s.id_ords === resource.id_ords && s.id_dsem === legacyDayOfWeek);
    const standardMinutes = shift ? shift.jo_mnts : 0;

    const isHoliday = resource.ap_feri > 0;
    const isSunday = legacyDayOfWeek === 1;

    // Logic based on mode
    if (mode === 'SUNDAY_100') {
        if (isHoliday || isSunday) {
            return minutesToHM(totalMinutes);
        }
        return "";
    }

    if (isHoliday || isSunday) return ""; // Handled above

    if (mode === 'NORMAL') {
        // Normal hours are up to the standard shift duration
        const normal = Math.min(totalMinutes, standardMinutes);
        return minutesToHM(normal);
    }

    if (mode === 'EXTRA_60') {
        // Extra hours are anything above standard shift
        if (totalMinutes > standardMinutes) {
            return minutesToHM(totalMinutes - standardMinutes);
        }
        return "";
    }

    if (mode === 'NIGHT_20' || mode === 'NIGHT_FULL') {
        const nightMins = calculateNightMinutes(resource.ap_hent, resource.ap_hiin, resource.ap_htin, resource.ap_hter);
        return minutesToHM(nightMins);
    }

    return "";
}
