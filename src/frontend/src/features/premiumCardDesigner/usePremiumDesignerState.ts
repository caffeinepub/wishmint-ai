import { useState } from 'react';
import type { PremiumDesignerState, PremiumThemeId, BackgroundStyle, FontStyle, TextAlignment, BorderStyle, PhotoPlacement } from './types';

export function usePremiumDesignerState() {
  const [state, setState] = useState<PremiumDesignerState>({
    selectedTheme: 'cute-pastel',
    backgroundStyle: 'gradient',
    fontStyle: 'rounded',
    fontColor: '#4A4A4A',
    textAlignment: 'center',
    emojiDecorationsEnabled: true,
    borderStyle: 'decorative',
    animationsEnabled: true,
    uploadedPhoto: null,
    photoPlacement: 'top',
  });

  const setTheme = (theme: PremiumThemeId) => {
    setState(prev => ({ ...prev, selectedTheme: theme }));
  };

  const setBackgroundStyle = (style: BackgroundStyle) => {
    setState(prev => ({ ...prev, backgroundStyle: style }));
  };

  const setFontStyle = (style: FontStyle) => {
    setState(prev => ({ ...prev, fontStyle: style }));
  };

  const setFontColor = (color: string) => {
    setState(prev => ({ ...prev, fontColor: color }));
  };

  const setTextAlignment = (alignment: TextAlignment) => {
    setState(prev => ({ ...prev, textAlignment: alignment }));
  };

  const setEmojiDecorationsEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, emojiDecorationsEnabled: enabled }));
  };

  const setBorderStyle = (style: BorderStyle) => {
    setState(prev => ({ ...prev, borderStyle: style }));
  };

  const setAnimationsEnabled = (enabled: boolean) => {
    setState(prev => ({ ...prev, animationsEnabled: enabled }));
  };

  const setUploadedPhoto = (photo: string | null) => {
    setState(prev => ({ ...prev, uploadedPhoto: photo }));
  };

  const setPhotoPlacement = (placement: PhotoPlacement) => {
    setState(prev => ({ ...prev, photoPlacement: placement }));
  };

  return {
    state,
    setTheme,
    setBackgroundStyle,
    setFontStyle,
    setFontColor,
    setTextAlignment,
    setEmojiDecorationsEnabled,
    setBorderStyle,
    setAnimationsEnabled,
    setUploadedPhoto,
    setPhotoPlacement,
  };
}
