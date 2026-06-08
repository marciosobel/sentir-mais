import { describe, expect, it } from 'vitest'

import { emotionKey, getEmotionLabel, getEmotionMeta } from './emotions'

describe('dashboard emotions', () => {
  it('maps classifier english labels to distinct canonical keys', () => {
    expect(emotionKey('sad')).toBe('sad')
    expect(emotionKey('happy')).toBe('happy')
    expect(emotionKey('relaxed')).toBe('relaxed')
  })

  it('returns stable display labels for classifier english labels', () => {
    expect(getEmotionLabel('sad')).toBe('Triste')
    expect(getEmotionLabel('happy')).toBe('Feliz')
    expect(getEmotionLabel('relaxed')).toBe('Calmo')
  })

  it('returns distinct colors for different classifier labels', () => {
    expect(getEmotionMeta('sad').color).not.toBe(getEmotionMeta('happy').color)
    expect(getEmotionMeta('happy').color).not.toBe(getEmotionMeta('relaxed').color)
  })
})
