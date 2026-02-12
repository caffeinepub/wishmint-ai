import { PlanType } from '../../backend';

export interface PlanEntitlements {
  dailyMessageLimit: number | null; // null = unlimited
  watermarkDownloads: boolean;
  hdExport: boolean;
  storyExport: boolean;
  premiumTemplates: boolean;
  hindiRomanticAccess: boolean;
  surpriseLinks: boolean;
  creatorMarketplace: boolean;
  analyticsDashboard: boolean;
}

export interface PlanMetadata {
  id: PlanType;
  name: string;
  price: string;
  priceAmount: number; // in rupees
  description: string;
  features: string[];
  entitlements: PlanEntitlements;
  popular?: boolean;
}

export const PLAN_DEFINITIONS: Record<PlanType, PlanMetadata> = {
  [PlanType.free]: {
    id: PlanType.free,
    name: 'Free Plan',
    price: 'Free',
    priceAmount: 0,
    description: 'Get started with basic features',
    features: [
      '3 messages per day',
      'Watermark on downloads',
      'Limited templates',
      'No HD export',
    ],
    entitlements: {
      dailyMessageLimit: 3,
      watermarkDownloads: true,
      hdExport: false,
      storyExport: false,
      premiumTemplates: false,
      hindiRomanticAccess: false,
      surpriseLinks: false,
      creatorMarketplace: false,
      analyticsDashboard: false,
    },
  },
  [PlanType.pro]: {
    id: PlanType.pro,
    name: 'Pro Plan',
    price: '₹49/month',
    priceAmount: 49,
    description: 'Perfect for personal use',
    features: [
      'Unlimited messages',
      'Remove watermark',
      'HD image download (1080x1080 + 9:16)',
      'Premium templates',
      'Hindi + Romantic AI tone',
      'Surprise link feature',
    ],
    entitlements: {
      dailyMessageLimit: null,
      watermarkDownloads: false,
      hdExport: true,
      storyExport: true,
      premiumTemplates: true,
      hindiRomanticAccess: true,
      surpriseLinks: true,
      creatorMarketplace: false,
      analyticsDashboard: false,
    },
    popular: true,
  },
  [PlanType.creator]: {
    id: PlanType.creator,
    name: 'Creator Plan',
    price: '₹149/month',
    priceAmount: 149,
    description: 'For creators and professionals',
    features: [
      'Everything in Pro',
      'Sell templates in marketplace',
      'Reel video export (MP4)',
      'Voice message generation',
      'Custom branding',
      'Analytics dashboard',
    ],
    entitlements: {
      dailyMessageLimit: null,
      watermarkDownloads: false,
      hdExport: true,
      storyExport: true,
      premiumTemplates: true,
      hindiRomanticAccess: true,
      surpriseLinks: true,
      creatorMarketplace: true,
      analyticsDashboard: true,
    },
  },
};

export function getPlanMetadata(planType: PlanType): PlanMetadata {
  return PLAN_DEFINITIONS[planType];
}

export function getEntitlements(planType: PlanType): PlanEntitlements {
  return PLAN_DEFINITIONS[planType].entitlements;
}
