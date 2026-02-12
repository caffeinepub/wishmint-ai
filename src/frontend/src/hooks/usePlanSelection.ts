import { useState, useEffect } from 'react';

export type Plan = 'free' | 'pro' | null;

/**
 * Hook to manage plan selection state, persisted to localStorage scoped by principal.
 * Automatically clears selection when user is not authenticated.
 */
export function usePlanSelection(principal: string | null) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null);

  // Load plan from localStorage when principal changes
  useEffect(() => {
    if (!principal) {
      setSelectedPlan(null);
      return;
    }

    const storageKey = `wishmint_plan_${principal}`;
    const stored = localStorage.getItem(storageKey);
    if (stored === 'free' || stored === 'pro') {
      setSelectedPlan(stored);
    } else {
      setSelectedPlan(null);
    }
  }, [principal]);

  // Save plan to localStorage
  const selectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    if (principal && plan) {
      const storageKey = `wishmint_plan_${principal}`;
      localStorage.setItem(storageKey, plan);
    }
  };

  return { selectedPlan, selectPlan };
}
