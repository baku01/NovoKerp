import { describe, it, expect } from 'vitest';
import {
  fetchActivityReport,
  fetchActivityResources,
  fetchActivityComments,
  updateRemainingDaysActivity,
  inactivateTask,
} from './activityService';

const EMPRESA = 'EMPR1';
const DATE = new Date('2025-01-08');

describe('activityService', () => {
  it('fetches activity report/resources/comments', async () => {
    const rep = await fetchActivityReport(EMPRESA, 1, 10, DATE);
    expect(rep.length).toBeGreaterThan(0);
    const res = await fetchActivityResources(EMPRESA, 1, 10, DATE);
    expect(res.length).toBeGreaterThan(0);
    const cm = await fetchActivityComments(EMPRESA, 1, 10, DATE);
    expect(cm.length).toBeGreaterThan(0);
  });

  it('updates remaining days and inactivates task', async () => {
    await expect(updateRemainingDaysActivity(EMPRESA, 10, 1, 5, 2)).resolves.toBeDefined();
    await expect(inactivateTask(EMPRESA, 10, 1)).resolves.toBeDefined();
  });
});
