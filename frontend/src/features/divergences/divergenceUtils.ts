import { addDays, differenceInMinutes, parseISO, setHours, setMinutes } from 'date-fns';

// Helper to convert legacy "HH.MM" number to Date object relative to a base date
function timeNumberToDate(dateBase: Date, timeVal: number): Date {
    const date = new Date(dateBase);
    if (!timeVal) return setMinutes(setHours(date, 0), 0);

    const parts = timeVal.toFixed(2).split('.');
    const hours = parseInt(parts[0] || '0', 10);
    const minutes = parseInt((parts[1] || '0').padEnd(2, '0'), 10);
    
    return setMinutes(setHours(date, hours), minutes);
}

interface DivergenceRecord {
    ap_data: string;
    ap_hent: number;
    ap_hiin: number;
    ap_htin: number;
    ap_hter: number;
}

export function calculateMinutesFromRecord(record: DivergenceRecord): number {
    // Record has ap_hent, ap_hiin, ap_htin, ap_hter (decimals)
    // ap_data (string)
    const baseDate = parseISO(record.ap_data);
    
    const ent = timeNumberToDate(baseDate, record.ap_hent);
    let iin = timeNumberToDate(baseDate, record.ap_hiin);
    let tin = timeNumberToDate(baseDate, record.ap_htin);
    let ter = timeNumberToDate(baseDate, record.ap_hter);

    // Logic from legacy `calculaMinutosCAD`
    if (ent <= iin) {
        // Normal
    } else {
        iin = addDays(iin, 1);
        if (tin > baseDate) tin = addDays(tin, 1); // Actually check against base or prev?
        // Legacy simply does `addDays(1)` if prev is greater.
        // Let's assume standard flow: ent < iin < tin < ter
        // If any is smaller than prev, add day.
        tin = addDays(tin, 1);
        ter = addDays(ter, 1);
    }

    // Morning
    const morning = Math.max(0, differenceInMinutes(iin, ent));

    // Afternoon
    if (iin > tin) {
        tin = addDays(tin, 1);
        ter = addDays(ter, 1);
    }
    
    if (tin <= ter) {
        // Normal
    } else {
        ter = addDays(ter, 1);
    }

    const afternoon = Math.max(0, differenceInMinutes(ter, tin));

    return morning + afternoon;
}
