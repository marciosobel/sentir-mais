import {
  Angry,
  Annoyed,
  Brain,
  Cloud,
  Coffee,
  Flame,
  Heart,
  Leaf,
  ShieldAlert,
  Smile,
  Sparkles,
  Sun,
  Zap,
  type LucideIcon,
} from '@lucide/vue'

export type EmotionMeta = {
  icon: LucideIcon
  color: string
}

const emotionPalette: Record<string, EmotionMeta> = {
  alegria: { icon: Sun, color: '#f59e0b' },
  feliz: { icon: Smile, color: '#f59e0b' },
  contente: { icon: Smile, color: '#f59e0b' },
  euforia: { icon: Sparkles, color: '#f59e0b' },
  empolgado: { icon: Sparkles, color: '#f59e0b' },
  amor: { icon: Heart, color: '#ec4899' },
  carinho: { icon: Heart, color: '#ec4899' },
  gratidao: { icon: Heart, color: '#ec4899' },
  calma: { icon: Leaf, color: '#22c55e' },
  tranquilo: { icon: Leaf, color: '#22c55e' },
  paz: { icon: Leaf, color: '#22c55e' },
  serenidade: { icon: Leaf, color: '#22c55e' },
  tristeza: { icon: Cloud, color: '#60a5fa' },
  triste: { icon: Cloud, color: '#60a5fa' },
  desanimado: { icon: Cloud, color: '#60a5fa' },
  medo: { icon: ShieldAlert, color: '#8b5cf6' },
  ansiedade: { icon: ShieldAlert, color: '#8b5cf6' },
  preocupado: { icon: ShieldAlert, color: '#8b5cf6' },
  raiva: { icon: Angry, color: '#ef4444' },
  irritado: { icon: Angry, color: '#ef4444' },
  frustracao: { icon: Angry, color: '#ef4444' },
  estresse: { icon: Brain, color: '#64748b' },
  sobrecarregado: { icon: Brain, color: '#64748b' },
  cansado: { icon: Coffee, color: '#a78bfa' },
  exausto: { icon: Coffee, color: '#a78bfa' },
  energia: { icon: Zap, color: '#f97316' },
  motivado: { icon: Zap, color: '#f97316' },
}

const fallbackEmotion: EmotionMeta = {
  icon: Sparkles,
  color: '#0ea5e9',
}

export function normalizeEmotionLabel(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function emotionKey(label: string) {
  return normalizeEmotionLabel(label).replace(/[^a-z0-9]+/g, '-') || 'emotion'
}

export function getEmotionMeta(label: string): EmotionMeta {
  return emotionPalette[normalizeEmotionLabel(label)] ?? fallbackEmotion
}
