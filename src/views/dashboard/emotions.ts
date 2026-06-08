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

type EmotionDefinition = {
  displayLabel: string
  meta: EmotionMeta
  aliases: string[]
}

const emotionDefinitions: Record<string, EmotionDefinition> = {
  happy: {
    displayLabel: 'Feliz',
    meta: { icon: Smile, color: '#f59e0b' },
    aliases: ['happy', 'alegria', 'feliz', 'contente', 'euforia', 'empolgado'],
  },
  loving: {
    displayLabel: 'Gratidão',
    meta: { icon: Heart, color: '#ec4899' },
    aliases: ['amor', 'carinho', 'gratidao'],
  },
  relaxed: {
    displayLabel: 'Calmo',
    meta: { icon: Leaf, color: '#22c55e' },
    aliases: ['relaxed', 'calma', 'calmo', 'tranquilo', 'paz', 'serenidade'],
  },
  sad: {
    displayLabel: 'Triste',
    meta: { icon: Cloud, color: '#60a5fa' },
    aliases: ['sad', 'tristeza', 'triste', 'desanimado'],
  },
  anxious: {
    displayLabel: 'Ansioso',
    meta: { icon: ShieldAlert, color: '#8b5cf6' },
    aliases: ['anxious', 'medo', 'ansiedade', 'preocupado'],
  },
  angry: {
    displayLabel: 'Irritado',
    meta: { icon: Angry, color: '#ef4444' },
    aliases: ['angry', 'raiva', 'irritado', 'frustracao'],
  },
  stressed: {
    displayLabel: 'Estressado',
    meta: { icon: Brain, color: '#64748b' },
    aliases: ['stressed', 'estresse', 'sobrecarregado'],
  },
  tense: {
    displayLabel: 'Tenso',
    meta: { icon: Flame, color: '#f97316' },
    aliases: ['tense', 'tenso', 'cansado', 'exausto'],
  },
  doubtful: {
    displayLabel: 'Em dúvida',
    meta: { icon: Annoyed, color: '#a78bfa' },
    aliases: ['doubtful', 'duvida', 'duvidoso', 'incerto'],
  },
  motivated: {
    displayLabel: 'Motivado',
    meta: { icon: Zap, color: '#fb7185' },
    aliases: ['energia', 'motivado'],
  },
}

const fallbackEmotion: EmotionMeta = {
  icon: Sparkles,
  color: '#0ea5e9',
}

const fallbackEmotionLabel = 'Sentimento'

const emotionAliasMap = Object.entries(emotionDefinitions).reduce<Record<string, string>>(
  (accumulator, [key, definition]) => {
    for (const alias of definition.aliases) {
      accumulator[normalizeEmotionLabel(alias)] = key
    }

    return accumulator
  },
  {},
)

export function normalizeEmotionLabel(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function emotionKey(label: string) {
  const normalized = normalizeEmotionLabel(label)
  return emotionAliasMap[normalized] ?? (normalized.replace(/[^a-z0-9]+/g, '-') || 'emotion')
}

export function getEmotionMeta(label: string): EmotionMeta {
  return emotionDefinitions[emotionKey(label)]?.meta ?? fallbackEmotion
}

export function getEmotionLabel(label: string): string {
  return emotionDefinitions[emotionKey(label)]?.displayLabel ?? (label || fallbackEmotionLabel)
}
