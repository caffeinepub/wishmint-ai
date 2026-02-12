export interface QuotaRecord {
  count: number;
  date: string; // YYYY-MM-DD
}

const QUOTA_STORAGE_KEY = 'wishmint_quota';

function getCurrentDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0]; // YYYY-MM-DD
}

export function getQuotaRecord(): QuotaRecord {
  const stored = localStorage.getItem(QUOTA_STORAGE_KEY);
  if (!stored) {
    return { count: 0, date: getCurrentDateString() };
  }

  try {
    const record: QuotaRecord = JSON.parse(stored);
    const currentDate = getCurrentDateString();
    
    // Reset if it's a new day
    if (record.date !== currentDate) {
      return { count: 0, date: currentDate };
    }
    
    return record;
  } catch {
    return { count: 0, date: getCurrentDateString() };
  }
}

export function incrementQuota(): QuotaRecord {
  const record = getQuotaRecord();
  const newRecord: QuotaRecord = {
    count: record.count + 1,
    date: record.date,
  };
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(newRecord));
  return newRecord;
}

export function getRemainingQuota(limit: number): number {
  const record = getQuotaRecord();
  return Math.max(0, limit - record.count);
}
