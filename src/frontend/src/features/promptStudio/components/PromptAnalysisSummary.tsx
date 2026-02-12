/**
 * Displays detected prompt analysis results
 */

import { Badge } from '@/components/ui/badge';
import type { PromptAnalysis } from '../types';

interface PromptAnalysisSummaryProps {
  analysis: PromptAnalysis;
}

export function PromptAnalysisSummary({ analysis }: PromptAnalysisSummaryProps) {
  return (
    <div className="space-y-3 p-4 rounded-lg glass-card border-border/40">
      <h3 className="text-sm font-semibold">Detected Style</h3>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="capitalize">
          {analysis.eventType.replace('-', ' ')}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {analysis.tone}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {analysis.visualTheme}
        </Badge>
        <Badge variant="secondary" className="capitalize">
          {analysis.layoutStyle.replace('-', ' ')}
        </Badge>
      </div>
    </div>
  );
}
