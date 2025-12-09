import { format } from 'date-fns';
import type {
  BmsReportRow,
  BmsResourceRecord,
  BmsSummary,
  BuildBmsRowsParams,
} from './types';
import type { ServiceOrder } from '../../stock-position/types';

const MINUTES_PER_DAY = 24 * 60;
const NIGHT_WINDOWS: Array<[number, number]> = [
  [22 * 60, 24 * 60],
  [0, 5 * 60],
];
const DEFAULT_JOURNEY = 8 * 60;

interface IntervalResult {
  minutes: number;
  nightMinutes: number;
  earliestStart: number;
}

interface DayBucket {
  date: Date;
  isSunday: boolean;
  meta: {
    resourceType: string;
    resourceName: string;
    resourceFunction: string;
    resourceCompany: string;
    employeeId: number;
    equipmentId?: number | null;
  };
  orders: Map<number, BucketOrderInfo>;
}

interface BucketOrderInfo {
  minutes: number;
  nightMinutes: number;
  isHoliday: boolean;
  earliestStart: number;
  orderName: string;
}

interface AllocationResult {
  normal: number;
  overtime: number;
  holiday: number;
  night: number;
  info: BucketOrderInfo;
}

export function buildBmsRows(params: BuildBmsRowsParams) {
  const { records, selectedOrderIds, hourRates, journeys, orders } = params;
  const selectedSet = new Set(selectedOrderIds);
  const ordersMap = new Map<number, ServiceOrder>();
  orders.forEach((order) => ordersMap.set(order.id_ords, order));

  const journeyMap = new Map<string, number>();
  journeys.forEach((j) => {
    const key = `${j.id_ords}|${j.id_dsem}`;
    journeyMap.set(key, j.jo_mnts || 0);
  });

  const rateMap = new Map<string, number>();
  hourRates.forEach((rate) => {
    const key = `${rate.id_ords}|${rate.fu_deno.trim().toUpperCase()}`;
    rateMap.set(key, rate.fu_vlhr || 0);
  });

  const buckets = new Map<string, DayBucket>();

  for (const record of records) {
    const orderId = Number(record.id_ords);
    if (!orderId) continue;
    const dateObj = parseRecordDate(record.ap_data);
    if (!dateObj || Number.isNaN(dateObj.getTime())) continue;

    const intervals = buildIntervals(record);
    if (intervals.minutes <= 0) continue;

    const dateKey = format(dateObj, 'yyyy-MM-dd');
    const bucketKey = [
      record.cb_tmdo?.trim().toUpperCase() || '',
      record.fu_empr?.trim().toUpperCase() || '',
      record.id_matr || 0,
      record.id_eqto || '',
      dateKey,
    ].join('|');

    const bucket =
      buckets.get(bucketKey) ??
      {
        date: dateObj,
        isSunday: dateObj.getDay() === 0,
        meta: {
          resourceType: record.cb_tmdo?.trim().toUpperCase() || '',
          resourceName: record.fu_nome?.trim().toUpperCase() || '',
          resourceFunction: record.fu_func?.trim().toUpperCase() || '',
          resourceCompany: record.fu_empr?.trim().toUpperCase() || '',
          employeeId: Number(record.id_matr) || 0,
          equipmentId: record.id_eqto ?? null,
        },
        orders: new Map<number, BucketOrderInfo>(),
      };

    const orderInfo =
      bucket.orders.get(orderId) ??
      {
        minutes: 0,
        nightMinutes: 0,
        isHoliday: false,
        earliestStart: intervals.earliestStart,
        orderName:
          record.os_nume?.trim().toUpperCase() ||
          ordersMap.get(orderId)?.os_nume?.trim().toUpperCase() ||
          `OS ${orderId}`,
      };

    orderInfo.minutes += intervals.minutes;
    orderInfo.nightMinutes += intervals.nightMinutes;
    orderInfo.earliestStart = Math.min(orderInfo.earliestStart, intervals.earliestStart);
    orderInfo.isHoliday = orderInfo.isHoliday || (record.ap_feri ?? 0) > 0;

    bucket.orders.set(orderId, orderInfo);
    buckets.set(bucketKey, bucket);
  }

  const rows: BmsReportRow[] = [];
  const summary: BmsSummary = {
    totalRows: 0,
    totalHours: 0,
    totalValue: 0,
    missingRates: 0,
  };

  buckets.forEach((bucket) => {
    const allocations = allocateBucket(bucket, journeyMap);
    allocations.forEach(({ info, normal, overtime, holiday, night }, orderId) => {
      if (!selectedSet.has(orderId)) {
        return;
      }

      const baseRate = resolveHourlyRate(orderId, bucket, rateMap);
      const pricing = resolveOrderPricing(orderId, ordersMap);
      const monetary = calculateMonetaryTotals(
        {
          normal,
          overtime,
          holiday,
          night,
        },
        baseRate,
        pricing
      );

      const row: BmsReportRow = {
        id: buildRowId(bucket, orderId),
        orderId,
        orderName: info.orderName,
        date: format(bucket.date, 'dd/MM/yyyy'),
        resourceType: bucket.meta.resourceType,
        resourceName: bucket.meta.resourceName,
        resourceFunction: bucket.meta.resourceFunction,
        unitValue: baseRate,
        normalMinutes: normal,
        overtimeMinutes: overtime,
        holidayMinutes: holiday,
        nightMinutes: night,
        totalValue: monetary.total,
        hasRate: baseRate > 0,
      };

      rows.push(row);

      summary.totalRows += 1;
      summary.totalHours += (normal + overtime + holiday) / 60;
      summary.totalValue += monetary.total;
      if (baseRate <= 0) {
        summary.missingRates += 1;
      }
    });
  });

  rows.sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    if (dateDiff !== 0) return dateDiff;
    const orderDiff = a.orderName.localeCompare(b.orderName);
    if (orderDiff !== 0) return orderDiff;
    return a.resourceName.localeCompare(b.resourceName);
  });

  return { rows, summary };
}

function allocateBucket(bucket: DayBucket, journeyMap: Map<string, number>) {
  const allocations = new Map<number, AllocationResult>();
  const entries = Array.from(bucket.orders.entries()).sort(
    (a, b) => a[1].earliestStart - b[1].earliestStart
  );

  let cumulativeMinutes = 0;

  entries.forEach(([orderId, info]) => {
    const dayOfWeek = bucket.date.getDay() + 1; // Legacy stores 1-7
    const journeyKey = `${orderId}|${dayOfWeek}`;
    const journeyMinutes = journeyMap.get(journeyKey) ?? DEFAULT_JOURNEY;

    let normal = 0;
    let overtime = 0;
    let holiday = 0;

    if (info.isHoliday || bucket.isSunday) {
      holiday = info.minutes;
    } else {
      const remainingNormal = Math.max(journeyMinutes - cumulativeMinutes, 0);
      normal = Math.min(info.minutes, remainingNormal);
      overtime = info.minutes - normal;
    }

    cumulativeMinutes += info.minutes;

    allocations.set(orderId, {
      info,
      normal,
      overtime,
      holiday,
      night: info.nightMinutes,
    });
  });

  return allocations;
}

function resolveHourlyRate(orderId: number, bucket: DayBucket, rateMap: Map<string, number>) {
  const descriptors = [
    bucket.meta.resourceName?.trim().toUpperCase(),
    bucket.meta.resourceFunction?.trim().toUpperCase(),
  ].filter((value): value is string => Boolean(value && value.length));

  for (const descriptor of descriptors) {
    const key = `${orderId}|${descriptor}`;
    const rate = rateMap.get(key);
    if (rate && rate > 0) {
      return rate;
    }
  }

  return 0;
}

function resolveOrderPricing(orderId: number, ordersMap: Map<number, ServiceOrder>) {
  const order = ordersMap.get(orderId);
  return {
    sundayValue: order?.os_hdrs ?? 0,
    sundayPercent: order?.os_hdom ?? 100,
    overtimeValue: order?.os_hers ?? 0,
    overtimePercent: order?.os_hext ?? 60,
    nightValue: order?.os_hnrs ?? 0,
    nightPercent: order?.os_hnot ?? 40,
  };
}

function calculateMonetaryTotals(
  minutes: { normal: number; overtime: number; holiday: number; night: number },
  baseRate: number,
  pricing: {
    sundayValue: number;
    sundayPercent: number;
    overtimeValue: number;
    overtimePercent: number;
    nightValue: number;
    nightPercent: number;
  }
) {
  const hours = (value: number) => value / 60;

  const normalTotal = hours(minutes.normal) * baseRate;
  const overtimeMultiplier =
    pricing.overtimeValue > 0
      ? baseRate + pricing.overtimeValue
      : baseRate * (1 + (pricing.overtimePercent || 0) / 100);

  const overtimeTotal = hours(minutes.overtime) * (baseRate > 0 ? overtimeMultiplier : 0);

  const holidayMultiplier =
    pricing.sundayValue > 0
      ? baseRate + pricing.sundayValue
      : baseRate * (1 + (pricing.sundayPercent || 0) / 100);

  const holidayTotal = hours(minutes.holiday) * (baseRate > 0 ? holidayMultiplier : 0);

  const nightMultiplier =
    pricing.nightValue > 0
      ? pricing.nightValue
      : baseRate * ((pricing.nightPercent || 0) / 100);

  const nightTotal = hours(minutes.night) * (baseRate > 0 ? nightMultiplier : 0);

  return {
    normal: normalTotal,
    overtime: overtimeTotal,
    holiday: holidayTotal,
    night: nightTotal,
    total: normalTotal + overtimeTotal + holidayTotal + nightTotal,
  };
}

function buildIntervals(record: BmsResourceRecord): IntervalResult {
  const startMorning = parseDecimalTime(record.ap_hent);
  const endMorning = parseDecimalTime(record.ap_hiin);
  const startAfternoon = parseDecimalTime(record.ap_htin);
  const endAfternoon = parseDecimalTime(record.ap_hter);

  const morningSegments = buildSegment(startMorning, endMorning);
  const afternoonSegments = buildSegment(startAfternoon, endAfternoon);

  const segments = [...morningSegments, ...afternoonSegments];

  const minutes = segments.reduce((total, [start, end]) => total + (end - start), 0);
  const nightMinutes = segments.reduce((total, [start, end]) => total + overlapNight(start, end), 0);
  const earliestStart =
    segments.length > 0 ? Math.min(...segments.map(([start]) => start)) : MINUTES_PER_DAY;

  return {
    minutes,
    nightMinutes,
    earliestStart,
  };
}

function buildSegment(start: number | null, end: number | null): Array<[number, number]> {
  if (start === null || end === null) return [];
  if (end === start) return [];
  if (end > start) {
    return [[start, end]];
  }
  return [
    [start, MINUTES_PER_DAY],
    [0, end],
  ];
}

function overlapNight(start: number, end: number) {
  let total = 0;
  NIGHT_WINDOWS.forEach(([winStart, winEnd]) => {
    const overlapStart = Math.max(start, winStart);
    const overlapEnd = Math.min(end, winEnd);
    if (overlapEnd > overlapStart) {
      total += overlapEnd - overlapStart;
    }
  });
  return total;
}

function parseDecimalTime(value?: number | string | null): number | null {
  if (value === undefined || value === null) return null;
  const str = value.toString().trim();
  if (!str.length) return null;
  const parts = str.split('.');
  const hours = Number.parseInt(parts[0], 10);
  if (Number.isNaN(hours)) return null;
  const minutes = Number.parseInt((parts[1] ?? '0').padEnd(2, '0'), 10);
  if (Number.isNaN(minutes)) return null;
  const normalizedMinutes = Math.min(Math.max(minutes, 0), 59);
  return hours * 60 + normalizedMinutes;
}

function parseRecordDate(value?: string) {
  if (!value) return null;
  const msMatch = /Date\((\d+)\)/i.exec(value);
  if (msMatch) {
    return new Date(Number(msMatch[1]));
  }
  return new Date(value);
}

function buildRowId(bucket: DayBucket, orderId: number) {
  return `${orderId}-${bucket.meta.resourceName}-${format(bucket.date, 'yyyyMMdd')}`;
}
