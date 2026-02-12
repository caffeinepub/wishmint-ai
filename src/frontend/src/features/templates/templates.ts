import type { TemplateId } from '../generator/types';

export interface Template {
  id: TemplateId;
  name: string;
  icon: string;
  backgroundImage: string; // Path to static background image
  previewBg: string; // Fallback gradient for preview
  previewIcon: string;
  canvasBg1: string; // Fallback gradient color 1
  canvasBg2: string; // Fallback gradient color 2
  canvasText: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    icon: '▢',
    backgroundImage: '/assets/generated/card-bg-minimal-gold-lines.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-gray-100 to-gray-200',
    previewIcon: 'text-gray-800',
    canvasBg1: '#f5f5f5',
    canvasBg2: '#e0e0e0',
    canvasText: '#1a1a1a',
  },
  {
    id: 'cute',
    name: 'Cute',
    icon: '🌸',
    backgroundImage: '/assets/generated/card-bg-cute-doodles.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-pink-200 to-purple-200',
    previewIcon: 'text-pink-600',
    canvasBg1: '#ffc0cb',
    canvasBg2: '#dda0dd',
    canvasText: '#ffffff',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    icon: '✨',
    backgroundImage: '/assets/generated/card-bg-luxury-marble.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-yellow-600 to-yellow-800',
    previewIcon: 'text-yellow-200',
    canvasBg1: '#d4af37',
    canvasBg2: '#8b6914',
    canvasText: '#ffffff',
  },
  {
    id: 'anime',
    name: 'Anime',
    icon: '⚡',
    backgroundImage: '/assets/generated/card-bg-anime-starburst.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-blue-400 to-purple-500',
    previewIcon: 'text-white',
    canvasBg1: '#4a90e2',
    canvasBg2: '#9b59b6',
    canvasText: '#ffffff',
  },
  {
    id: 'neon',
    name: 'Neon',
    icon: '💫',
    backgroundImage: '/assets/generated/card-bg-neon-balloons.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-purple-600 to-green-500',
    previewIcon: 'text-white',
    canvasBg1: '#8b5cf6',
    canvasBg2: '#10b981',
    canvasText: '#ffffff',
  },
  {
    id: 'classic',
    name: 'Classic',
    icon: '🎩',
    backgroundImage: '/assets/generated/card-bg-classic-bokeh.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-blue-900 to-blue-700',
    previewIcon: 'text-blue-200',
    canvasBg1: '#1e3a8a',
    canvasBg2: '#1e40af',
    canvasText: '#ffffff',
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic',
    icon: '🌙',
    backgroundImage: '/assets/generated/card-bg-pastel-sparkles.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-indigo-300 to-pink-300',
    previewIcon: 'text-white',
    canvasBg1: '#a78bfa',
    canvasBg2: '#f9a8d4',
    canvasText: '#ffffff',
  },
  {
    id: 'funny',
    name: 'Funny',
    icon: '😂',
    backgroundImage: '/assets/generated/card-bg-confetti-dark.dim_1080x1080.png',
    previewBg: 'bg-gradient-to-br from-orange-400 to-red-500',
    previewIcon: 'text-white',
    canvasBg1: '#fb923c',
    canvasBg2: '#ef4444',
    canvasText: '#ffffff',
  },
];
