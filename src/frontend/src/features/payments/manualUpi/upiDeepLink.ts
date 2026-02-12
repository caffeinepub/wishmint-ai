import { PlanType } from '../../../backend';
import { UPI_ID, PAYEE_NAME } from './constants';

export function generateUpiDeepLink(plan: PlanType, amount: number): string {
  const planName = plan === PlanType.pro ? 'Pro' : 'Creator';
  const encodedPayeeName = encodeURIComponent(PAYEE_NAME);
  const encodedTransactionNote = encodeURIComponent(`WishMint AI ${planName}`);
  
  return `upi://pay?pa=${UPI_ID}&pn=${encodedPayeeName}&am=${amount}&cu=INR&tn=${encodedTransactionNote}`;
}
