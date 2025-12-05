import { AppointmentRecord, WorkShift } from './types';
import { addDays, getDay, parseISO, format, setHours, setMinutes, differenceInMinutes } from 'date-fns';

// Helper to convert legacy "HH.MM" number to Date object relative to a base date
function timeNumberToDate(dateBase: Date, timeVal: number): Date {
    const date = new Date(dateBase);
    if (!timeVal) return setMinutes(setHours(date, 0), 0);

    const parts = timeVal.toString().split('.');
    const hours = parseInt(parts[0] || '0', 10);
    const minutes = parseInt((parts[1] || '0').padEnd(2, '0'), 10);
    
    return setMinutes(setHours(date, hours), minutes);
}

/**
 * Calculates overtime in minutes for a list of appointments.
 * Logic ported from legacy `calculaHorasExtrasDCO`.
 * 
 * Legacy logic highlights:
 * - Calculates duration between Ent/IntIn (Morning) and IntOut/Exit (Afternoon).
 * - Sums them up to get total minutes worked (`lnApJdms`).
 * - Compares with shift definition (`gmOsJornDCO`) for that day of week.
 * - If Holiday (`ap_feri > 0`), ALL worked minutes are overtime.
 * - Else, Overtime = Worked - Shift.
 * - It seems to handle multiple entries for the same person/day by grouping or relying on order?
 *   Legacy loops `lmWkRsql` (all records) inside the loop?
 *   Wait, legacy `calculaHorasExtrasDCO` takes `loApApnt` (current) and `lmApApnt` (all).
 *   It loops `lmApApnt` matching date, company, matricula.
 *   It accumulates `lnApJdms` for ALL records matching that person/day.
 *   Then subtracts `lnJoMnts` (Shift).
 *   BUT it returns `lnHeMnts`. 
 *   The outer loop sums this return value.
 *   
 *   CRITICAL FLAW in Legacy or my understanding:
 *   If I have 2 records for Person A on Day X.
 *   Outer loop: Record 1. Inner loop: Sums Record 1 + Record 2. Calculates Overtime (Total - Shift). Returns OT.
 *   Outer loop: Record 2. Inner loop: Sums Record 1 + Record 2. Calculates Overtime (Total - Shift). Returns OT.
 *   Total = 2 * OT. Double counting?
 *   
 *   Let's re-read legacy:
 *   `if (jsonDate(loApApnt.ap_data) == ... && parseFloat(loApApnt.ap_hent) == parseFloat(lmApRcso[i].ap_hent))`
 *   It checks if the current outer record matches the specific inner record to return the value *only once*?
 *   "if (...) return lnHeMnts; else { lnApJdms = 0; llApJdms = true; }"
 *   This logic is weird. It seems it tries to attribute the overtime to the *first* matching record or specific record?
 *   
 *   Refactored Logic:
 *   We should Group By Person + Date.
 *   Calculate Total Worked Minutes for that Group.
 *   Get Shift Minutes for that Date (Day of Week).
 *   Overtime = max(0, TotalWorked - Shift).
 *   (Or if Holiday, Overtime = TotalWorked).
 *   Sum all Overtimes.
 */
export function calculateTotalOvertimeMinutes(
    appointments: AppointmentRecord[],
    shifts: WorkShift[]
): number {
    // Group by Key: "EMPRESA|MATRICULA|DATA_YMD"
    const grouped: Record<string, { 
        date: Date, 
        records: AppointmentRecord[], 
        isHoliday: boolean 
    }> = {};

    appointments.forEach(app => {
        // Legacy uses `jsonDate` which effectively ignores time component.
        // Assuming ap_data is ISO string.
        const date = parseISO(app.ap_data);
        const dateKey = format(date, 'yyyy-MM-dd');
        const key = `${app.fu_empr}|${app.id_matr}|${dateKey}`;

        if (!grouped[key]) {
            grouped[key] = {
                date,
                records: [],
                isHoliday: app.ap_feri > 0
            };
        }
        grouped[key].records.push(app);
        // If any record says holiday, treat as holiday? Legacy: `parseInt(loApApnt.ap_feri) > 0`
        if (app.ap_feri > 0) grouped[key].isHoliday = true;
    });

    let totalOvertimeMinutes = 0;

    Object.values(grouped).forEach(group => {
        let minutesWorked = 0;

        group.records.forEach(rec => {
            // Calculate duration for this record
            // Morning: hent -> hiin
            // Afternoon: htin -> hter
            // Legacy handles crossing midnight with `addDays(1)`.
            
            const baseDate = group.date;
            const ent = timeNumberToDate(baseDate, rec.ap_hent);
            let iin = timeNumberToDate(baseDate, rec.ap_hiin);
            let tin = timeNumberToDate(baseDate, rec.ap_htin);
            let ter = timeNumberToDate(baseDate, rec.ap_hter);

            // Adjust dates if crossing midnight or sequence is inverted (legacy logic)
            if (ent <= iin) {
                // Normal
            } else {
                iin = addDays(iin, 1);
                tin = addDays(tin, 1); // Assuming subsequent follow
                ter = addDays(ter, 1);
            }

            let morning = differenceInMinutes(iin, ent);

            // Check afternoon
            if (iin > tin) { // Interval In > Interval Out ?? Legacy checks `ldApHiin > ldApHtin`.
                 tin = addDays(tin, 1);
                 ter = addDays(ter, 1);
            }

            if (tin <= ter) {
                // Normal
            } else {
                ter = addDays(ter, 1);
            }

            let afternoon = differenceInMinutes(ter, tin);
            
            // Sanity checks (no negative durations if missing data)
            if (isNaN(morning) || morning < 0) morning = 0;
            if (isNaN(afternoon) || afternoon < 0) afternoon = 0;

            minutesWorked += (morning + afternoon);
        });

        // Get Shift Duration
        let shiftMinutes = 0;
        // JS getDay: 0=Sun, 1=Mon. Legacy: `lnIdDsem = ldApData.getDay();` ... `parseInt(gmOsJornDCO[i].id_dsem) == lnIdDsem + 1`
        // So Legacy DB uses 1=Sun, 2=Mon... or 1=Mon? 
        // Standard SQL Server DATEPART(dw) depends on settings, but often 1=Sunday.
        // JS getDay() returns 0 for Sunday.
        // If Legacy does `getDay() + 1`, then Legacy DB likely uses 1=Sunday, 2=Monday.
        const dayOfWeek = getDay(group.date) + 1; 
        
        const shift = shifts.find(s => s.id_dsem === dayOfWeek);
        if (shift) {
            shiftMinutes = shift.jo_mnts;
        }

        // Calculate OT
        if (group.isHoliday) {
            totalOvertimeMinutes += minutesWorked;
        } else {
            const ot = Math.max(0, minutesWorked - shiftMinutes);
            totalOvertimeMinutes += ot;
        }
    });

    return totalOvertimeMinutes;
}
