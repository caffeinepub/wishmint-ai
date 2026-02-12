/**
 * Prompt Mode input UI with example prompts
 */

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../types';

interface PromptModeInputProps {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function PromptModeInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
}: PromptModeInputProps) {
  const isValid = value.trim().length >= 10;

  const handleExampleClick = (example: string) => {
    onChange(example);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Describe your card or invitation idea..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="bg-background/50 border-border/40 resize-none text-base"
          disabled={isGenerating}
        />
        <p className="text-xs text-muted-foreground">
          Describe the type of card, tone, theme, and any specific details you want (min 10 characters)
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Example prompts:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLE_PROMPTS.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleExampleClick(example)}
              disabled={isGenerating}
              className="text-left text-sm px-3 py-2 rounded-lg border border-border/40 bg-background/30 hover:bg-background/50 hover:border-brand-purple/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        onClick={onGenerate}
        disabled={!isValid || isGenerating}
        className="w-full premium-button"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating…
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Card
          </>
        )}
      </Button>
    </div>
  );
}
