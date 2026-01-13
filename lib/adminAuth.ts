// Simple admin authentication (in production, use proper auth like NextAuth.js)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'prometheus2024';
const ADMIN_SESSION_KEY = 'admin-session';

export interface AdminSession {
  authenticated: boolean;
  adminId: string;
  timestamp: number;
}

export function authenticate(password: string): { success: boolean; adminId?: string } {
  if (password === ADMIN_PASSWORD) {
    const adminId = `admin-${Date.now()}`;
    return { success: true, adminId };
  }
  return { success: false };
}

export function setAdminSession(adminId: string): void {
  if (typeof window !== 'undefined') {
    const session: AdminSession = {
      authenticated: true,
      adminId,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  }
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  
  const sessionStr = sessionStorage.getItem(ADMIN_SESSION_KEY);
  if (!sessionStr) return null;

  try {
    const session: AdminSession = JSON.parse(sessionStr);
    // Check session age (24 hours)
    const sessionAge = Date.now() - session.timestamp;
    if (sessionAge > 24 * 60 * 60 * 1000) {
      clearAdminSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }
}

export function isAdminAuthenticated(): boolean {
  const session = getAdminSession();
  return session?.authenticated === true;
}
