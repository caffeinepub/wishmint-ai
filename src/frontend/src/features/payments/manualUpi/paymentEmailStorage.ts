const STORAGE_KEY = 'wishmint_payment_email';

export function getStoredPaymentEmail(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredPaymentEmail(email: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, email);
  } catch {
    // Ignore storage errors
  }
}
