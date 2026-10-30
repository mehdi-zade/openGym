import { describe, it, expect } from 'vitest'
import {
  WARMUP_PROTOCOLS,
  WARMUP_OPTIONS,
  getWarmupProtocol,
  protocolForRoutine
} from './warmup-protocols.js'

describe('warmup-protocols', () => {
  it('defines the Upper Body Joint Centration protocol with 3 mandatory steps', () => {
    const upper = WARMUP_PROTOCOLS.upper
    expect(upper).toBeDefined()
    expect(upper.name).toBe('Upper Body Joint Centration')
    expect(upper.duration).toBe('4 min')
    expect(upper.steps).toHaveLength(3)

    // Step 1: Banded No-Moneys
    expect(upper.steps[0].id).toBe('no_moneys')
    expect(upper.steps[0].sets).toBe(2)
    expect(upper.steps[0].reps).toBe(15)
    expect(upper.steps[0].cue).toContain('lower traps')

    // Step 2: Thumbs-Up Band Face Pulls
    expect(upper.steps[1].id).toBe('face_pulls')
    expect(upper.steps[1].sets).toBe(1)
    expect(upper.steps[1].reps).toBe(12)
    expect(upper.steps[1].cue).toContain('3-second hold')

    // Step 3: Corner Pec Minor Stretch
    expect(upper.steps[2].id).toBe('pec_stretch')
    expect(upper.steps[2].sec).toBe(60)
    expect(upper.steps[2].type).toBe('timer')
  })

  it('defines the Lower Body Posture & Hips protocol with 2 mandatory steps', () => {
    const lower = WARMUP_PROTOCOLS.lower
    expect(lower).toBeDefined()
    expect(lower.name).toBe('Lower Body Posture & Hips')
    expect(lower.duration).toBe('4 min')
    expect(lower.steps).toHaveLength(2)

    // Step 1: Half-Kneeling Hip Flexor Stretch
    expect(lower.steps[0].id).toBe('hip_flexor')
    expect(lower.steps[0].sec).toBe(60)
    expect(lower.steps[0].type).toBe('timer')

    // Step 2: Glute Bridge
    expect(lower.steps[1].id).toBe('glute_bridge')
    expect(lower.steps[1].sets).toBe(2)
    expect(lower.steps[1].reps).toBe(10)
    expect(lower.steps[1].cue).toContain('3 seconds')
  })

  it('resolves protocol for routine or id correctly', () => {
    expect(getWarmupProtocol('upper')).toBe(WARMUP_PROTOCOLS.upper)
    expect(getWarmupProtocol('lower')).toBe(WARMUP_PROTOCOLS.lower)
    expect(getWarmupProtocol('nonexistent')).toBeNull()
    expect(getWarmupProtocol(null)).toBeNull()

    expect(protocolForRoutine({ warmupProtocol: 'upper' })).toBe(WARMUP_PROTOCOLS.upper)
    expect(protocolForRoutine({ warmupProtocol: 'lower' })).toBe(WARMUP_PROTOCOLS.lower)
    expect(protocolForRoutine({ warmupProtocol: null })).toBeNull()
    expect(protocolForRoutine(null)).toBeNull()
  })

  it('exports valid UI dropdown options', () => {
    expect(WARMUP_OPTIONS).toHaveLength(3)
    expect(WARMUP_OPTIONS[0].value).toBe('')
    expect(WARMUP_OPTIONS[1].value).toBe('upper')
    expect(WARMUP_OPTIONS[2].value).toBe('lower')
  })
})
