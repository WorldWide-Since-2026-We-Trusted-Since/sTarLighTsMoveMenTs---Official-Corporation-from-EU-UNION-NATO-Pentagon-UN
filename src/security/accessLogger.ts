// Access logger for unique visitor parametrics with timestamp and IP tracking
// Browser-compatible implementation using localStorage

export interface AccessRecord {
  sessionId: string;
  timestamp: string;
  date: string;
  ip: string;
  userAgent: string;
  authenticated: boolean;
}

const STORAGE_KEY = 'hnoss_access_logs';

export function ensureLogDir(): void {
  // No-op for browser; using localStorage
}

export function generateSessionId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function logAccess(record: Omit<AccessRecord, 'sessionId' | 'timestamp' | 'date'> & { sessionId?: string }): AccessRecord {
  const full: AccessRecord = {
    sessionId: record.sessionId || generateSessionId(),
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleString('de-DE'),
    ip: record.ip,
    userAgent: record.userAgent,
    authenticated: record.authenticated
  };

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    const logs: AccessRecord[] = existing ? JSON.parse(existing) : [];
    logs.push(full);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // localStorage unavailable; ignore
  }
  return full;
}

export function getAccessLogs(): AccessRecord[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch {
    return [];
  }
}