# Upgrade Button Testing Checklist

## ✅ Pre-Testing Setup
- [ ] Ensure `VITE_RAZORPAY_KEY_ID` is configured in environment variables
- [ ] Open browser console to monitor debug logs
- [ ] Test on both desktop and mobile viewports

## 🖱️ Click Event Verification
Test that clicking Upgrade buttons opens the pricing modal (no immediate payment):
- [ ] Hero section "Upgrade" button → Opens pricing modal
- [ ] Pricing section "Upgrade to Pro" → Opens pricing modal with Pro highlighted
- [ ] Pricing section "Upgrade to Creator" → Opens pricing modal with Creator highlighted
- [ ] Premium Lock "Unlock Premium" → Opens pricing modal
- [ ] All upgrade CTAs keep user on current page (no navigation)

## 🎯 Modal Behavior - Step 1: Plan Selection
- [ ] Clicking any Upgrade button opens the pricing modal
- [ ] Pricing modal displays with correct plan highlighted (if specified)
- [ ] URL updates to `/pricing` when modal opens
- [ ] Pricing section scrolls into view
- [ ] Modal shows three plan cards (Free/Pro/Creator)
- [ ] Free plan button is disabled with "Current Plan" text
- [ ] Pro and Creator buttons show "Select Pro" / "Select Creator"
- [ ] Modal can be closed with X button or clicking outside
- [ ] URL resets to `/` when modal closes
- [ ] Direct navigation to `/pricing` opens modal and scrolls to section

## 🎯 Modal Behavior - Step 2: Confirmation
- [ ] Clicking "Select Pro" shows confirmation screen (no Razorpay yet)
- [ ] Clicking "Select Creator" shows confirmation screen (no Razorpay yet)
- [ ] Confirmation screen shows selected plan name and price
- [ ] Confirmation screen lists all plan features
- [ ] Confirmation screen shows Razorpay notice
- [ ] "Back" button returns to plan comparison view
- [ ] "Proceed to Payment" button is clearly visible
- [ ] No payment is initiated until "Proceed to Payment" is clicked

## 💳 Payment Flow
### With VITE_RAZORPAY_KEY_ID configured:
- [ ] Clicking "Proceed to Payment" opens Razorpay checkout (not before)
- [ ] Razorpay modal displays correct plan name and price
- [ ] Razorpay modal shows ₹49 for Pro plan
- [ ] Razorpay modal shows ₹149 for Creator plan
- [ ] Razorpay checkout stays in-app (no full-page navigation)
- [ ] Browser URL does not change when Razorpay opens
- [ ] Cancelling Razorpay shows "Payment cancelled" toast
- [ ] Cancelling Razorpay keeps modal open (user can try again)
- [ ] Test payment success shows success toast
- [ ] Successful payment closes the pricing modal

### Without VITE_RAZORPAY_KEY_ID:
- [ ] Clicking "Proceed to Payment" shows English error toast
- [ ] Error message: "Payment configuration is missing..."
- [ ] Error message is clear and actionable
- [ ] Modal stays open after error (user can cancel)
- [ ] No navigation or redirect occurs

### Razorpay SDK Loading Errors:
- [ ] If SDK fails to load, shows English error toast
- [ ] Error message: "Payment system could not be loaded..."
- [ ] If SDK not ready, shows: "Payment system is not ready..."
- [ ] All error messages keep user in-app

## 📱 Mobile Testing
- [ ] All Upgrade buttons are tappable on mobile
- [ ] No UI elements block button clicks
- [ ] Pricing modal is scrollable on mobile
- [ ] Confirmation screen is readable on mobile
- [ ] Back and Proceed buttons are accessible on mobile
- [ ] Razorpay checkout opens correctly on mobile
- [ ] Modal close button is accessible on mobile

## 🌐 Environment Testing
- [ ] Caffeine preview: Upgrade buttons open modal
- [ ] Caffeine preview: Confirmation step works
- [ ] Caffeine preview: Razorpay opens (if configured)
- [ ] Local development: All flows work
- [ ] Production deployment: All flows work

## 🐛 Error Scenarios
- [ ] Razorpay SDK fails to load → Shows appropriate English error
- [ ] Network error during payment → Shows error toast
- [ ] User closes Razorpay modal → Shows cancellation message, stays in modal
- [ ] Multiple rapid clicks → No duplicate modals or errors
- [ ] Clicking Back during processing → Disabled, no errors
- [ ] Missing configuration → Clear English error message

## ✨ Visual & UX
- [ ] No visual regressions to dark premium theme
- [ ] Gradient backgrounds don't block clicks
- [ ] Button hover states work correctly
- [ ] Loading states show during processing
- [ ] All text is in English
- [ ] Pricing matches requirements (₹49 Pro, ₹149 Creator)
- [ ] Confirmation screen is clear and professional
- [ ] Back/Proceed buttons are visually distinct
- [ ] Modal transitions are smooth

## 🔒 Security & Navigation
- [ ] No full-page redirects occur at any point
- [ ] window.location is never changed by payment flow
- [ ] SPA routing remains intact throughout
- [ ] User can always cancel and return to app
- [ ] No external navigation until Razorpay checkout opens
- [ ] Razorpay checkout is the only external interaction

## 📝 Notes
- Debug logs (`console.log`) are for testing and can be removed later
- Ensure all buttons have `type="button"` to prevent form submission
- Verify `pointer-events-auto` and `z-index` on interactive elements
- Two-step flow: (1) Select plan → (2) Confirm → (3) Razorpay opens
- No payment initiation until explicit "Proceed to Payment" click
