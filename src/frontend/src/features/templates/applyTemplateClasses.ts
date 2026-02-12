import type { TemplateId } from '../generator/types';

export function applyTemplateClasses(templateId: TemplateId): string {
  const baseClasses = 'p-8 rounded-2xl min-h-[300px] flex items-center justify-center bg-cover bg-center relative';

  const templateClasses: Record<TemplateId, string> = {
    minimal: 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900',
    cute: 'bg-gradient-to-br from-pink-200 to-purple-200 text-purple-900',
    luxury: 'bg-gradient-to-br from-yellow-600 to-yellow-800 text-white',
    anime: 'bg-gradient-to-br from-blue-400 to-purple-500 text-white',
    neon: 'bg-gradient-to-br from-purple-600 to-green-500 text-white',
    classic: 'bg-gradient-to-br from-blue-900 to-blue-700 text-white',
    aesthetic: 'bg-gradient-to-br from-indigo-300 to-pink-300 text-white',
    funny: 'bg-gradient-to-br from-orange-400 to-red-500 text-white',
  };

  return `${baseClasses} ${templateClasses[templateId]}`;
}
