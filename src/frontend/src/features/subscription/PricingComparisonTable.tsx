import { Check, X } from 'lucide-react';
import { PLAN_DEFINITIONS } from './plans';

export function PricingComparisonTable() {
  const features = [
    { name: 'Daily Messages', free: '3', pro: 'Unlimited', creator: 'Unlimited' },
    { name: 'Watermark', free: 'Yes', pro: 'No', creator: 'No' },
    { name: 'HD Export', free: false, pro: true, creator: true },
    { name: 'Story Export (9:16)', free: false, pro: true, creator: true },
    { name: 'Premium Templates', free: false, pro: true, creator: true },
    { name: 'Hindi + Romantic Tone', free: false, pro: true, creator: true },
    { name: 'Surprise Links', free: false, pro: true, creator: true },
    { name: 'Marketplace Selling', free: false, pro: false, creator: true },
    { name: 'Analytics Dashboard', free: false, pro: false, creator: true },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-semibold">Feature</th>
            <th className="text-center p-4 font-semibold">Free</th>
            <th className="text-center p-4 font-semibold text-neon-purple">Pro</th>
            <th className="text-center p-4 font-semibold text-neon-green">Creator</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, idx) => (
            <tr key={idx} className="border-b border-border/50">
              <td className="p-4 text-sm">{feature.name}</td>
              <td className="p-4 text-center text-sm">
                {typeof feature.free === 'boolean' ? (
                  feature.free ? <Check className="w-4 h-4 mx-auto text-muted-foreground" /> : <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                ) : (
                  feature.free
                )}
              </td>
              <td className="p-4 text-center text-sm">
                {typeof feature.pro === 'boolean' ? (
                  feature.pro ? <Check className="w-4 h-4 mx-auto text-neon-purple" /> : <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                ) : (
                  feature.pro
                )}
              </td>
              <td className="p-4 text-center text-sm">
                {typeof feature.creator === 'boolean' ? (
                  feature.creator ? <Check className="w-4 h-4 mx-auto text-neon-green" /> : <X className="w-4 h-4 mx-auto text-muted-foreground/50" />
                ) : (
                  feature.creator
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
