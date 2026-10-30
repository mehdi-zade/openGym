// Structured Pre-Workout Mobility / Warm-Up Protocols (Athlean-X Joint Armor)
//
// These protocols provide joint centration, activation, and mobility before training
// without polluting working hypertrophy volume, 1RM calculations, or progression records.

export const WARMUP_PROTOCOLS = {
  upper: {
    id: 'upper',
    name: 'Upper Body Joint Centration',
    duration: '4 min',
    targetDays: 'Sessions 1, 2, 4, 5',
    subtitle: 'Rotator cuff activation & pec stretch',
    description: 'Mandatory joint armor for right shoulder subacromial space before upper body pressing/pulling.',
    steps: [
      {
        id: 'no_moneys',
        name: 'Banded "No-Moneys" / External Rotation (0° Abduction)',
        target: '2 sets × 15 reps',
        cue: 'Elbows pinned to ribs, rotate hands out, squeeze lower traps.',
        videoUrl: 'https://www.youtube.com/watch?v=ng4G8F5jPyI&t=65s',
        sets: 2,
        reps: 15,
        type: 'reps'
      },
      {
        id: 'face_pulls',
        name: 'Thumbs-Up Band Face Pulls',
        target: '1 set × 12 reps (3s pause)',
        cue: 'Pull rope/band to eye level, rotating thumbs back into double-bicep pose with a 3-second hold.',
        videoUrl: 'https://www.youtube.com/watch?v=g-7ZWPCWv0U&t=275s',
        sets: 1,
        reps: 12,
        type: 'reps'
      },
      {
        id: 'pec_stretch',
        name: 'Corner 45° Pec Minor Stretch',
        target: '60 seconds total',
        cue: 'Forearms at 45° on corner wall, step forward, open up chest to reverse driving/desk slump.',
        videoUrl: 'https://www.youtube.com/watch?v=XxSgdX7lX6E&t=195s',
        sec: 60,
        type: 'timer'
      }
    ]
  },
  lower: {
    id: 'lower',
    name: 'Lower Body Posture & Hips',
    duration: '4 min',
    targetDays: 'Sessions 3, 6',
    subtitle: 'Hip flexor mobility & glute activation',
    description: 'Mandatory joint armor after driving and stair climbing before squats, hinges, and leg work.',
    steps: [
      {
        id: 'hip_flexor',
        name: 'True Half-Kneeling Hip Flexor Stretch',
        target: '60 seconds per leg',
        cue: 'Posterior pelvic tilt, squeeze rear glute, reach arm overhead and across. Elongates tight psoas from driving.',
        videoUrl: 'https://www.youtube.com/watch?v=g-7ZWPCWv0U&t=470s',
        sec: 60,
        type: 'timer'
      },
      {
        id: 'glute_bridge',
        name: 'Glute Bridge with Posterior Pelvic Tilt',
        target: '2 sets × 10 reps (3s hold)',
        cue: 'Flatten lower back against floor before lifting hips; hold peak glute squeeze for 3 seconds.',
        videoUrl: 'https://www.youtube.com/watch?v=g-7ZWPCWv0U&t=410s',
        sets: 2,
        reps: 10,
        type: 'reps'
      }
    ]
  }
}

export const WARMUP_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'upper', label: 'Upper Body Joint Centration (4 min)' },
  { value: 'lower', label: 'Lower Body Posture & Hips (4 min)' }
]

export function getWarmupProtocol(id) {
  if (!id) return null
  return WARMUP_PROTOCOLS[id] || null
}

export function protocolForRoutine(routine) {
  if (!routine) return null
  return getWarmupProtocol(routine.warmupProtocol)
}
