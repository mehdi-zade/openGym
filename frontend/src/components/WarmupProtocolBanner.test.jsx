// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import WarmupProtocolBanner from './WarmupProtocolBanner.jsx'
import { WARMUP_PROTOCOLS } from '../lib/warmup-protocols.js'
import { useUI } from '../store/useUI.js'

let host = null
let root = null

function render(node) {
  act(() => root.render(node))
  return host
}

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})

afterEach(() => {
  act(() => root.render(null))
  host.remove()
  host = null
  root = null
})

describe('WarmupProtocolBanner', () => {
  it('renders Upper Body protocol with all 3 mobility steps', () => {
    const onToggleStep = vi.fn()
    const onComplete = vi.fn()
    const onReset = vi.fn()

    const el = render(
      <WarmupProtocolBanner
        protocol={WARMUP_PROTOCOLS.upper}
        stepsDone={[]}
        isDone={false}
        onToggleStep={onToggleStep}
        onComplete={onComplete}
        onReset={onReset}
      />
    )

    expect(el.textContent).toContain('Upper Body Joint Centration')
    expect(el.textContent).toContain('Mobility · No Volume')
    expect(el.textContent).toContain('Banded "No-Moneys"')
    expect(el.textContent).toContain('Thumbs-Up Band Face Pulls')
    expect(el.textContent).toContain('Corner 45° Pec Minor Stretch')
  })

  it('toggles steps when checked and triggers rest timer for stretches', () => {
    const onToggleStep = vi.fn()
    const onComplete = vi.fn()
    const onReset = vi.fn()
    const startRestSpy = vi.spyOn(useUI.getState(), 'startRest').mockImplementation(() => {})

    const el = render(
      <WarmupProtocolBanner
        protocol={WARMUP_PROTOCOLS.upper}
        stepsDone={['no_moneys']}
        isDone={false}
        onToggleStep={onToggleStep}
        onComplete={onComplete}
        onReset={onReset}
      />
    )

    // Checkbox toggle
    const checkboxes = el.querySelectorAll('input[type="checkbox"]')
    expect(checkboxes[0].checked).toBe(true)
    expect(checkboxes[1].checked).toBe(false)

    act(() => {
      checkboxes[1].click()
    })
    expect(onToggleStep).toHaveBeenCalledWith('face_pulls')

    // Start 60s stretch timer
    const timerBtn = [...el.querySelectorAll('button')].find(b => b.textContent.includes('Start 60s stretch timer'))
    expect(timerBtn).toBeTruthy()
    act(() => {
      timerBtn.click()
    })
    expect(startRestSpy).toHaveBeenCalledWith(60)

    startRestSpy.mockRestore()
  })

  it('calls onComplete when clicking mark warm-up complete', () => {
    const onToggleStep = vi.fn()
    const onComplete = vi.fn()
    const onReset = vi.fn()

    const el = render(
      <WarmupProtocolBanner
        protocol={WARMUP_PROTOCOLS.lower}
        stepsDone={['hip_flexor']}
        isDone={false}
        onToggleStep={onToggleStep}
        onComplete={onComplete}
        onReset={onReset}
      />
    )

    const completeBtn = [...el.querySelectorAll('button')].find(b => b.textContent.includes('Mark warm-up complete'))
    expect(completeBtn).toBeTruthy()
    act(() => {
      completeBtn.click()
    })
    expect(onComplete).toHaveBeenCalled()
  })

  it('shows Reset warm-up when all steps are completed', () => {
    const onToggleStep = vi.fn()
    const onComplete = vi.fn()
    const onReset = vi.fn()

    const el = render(
      <WarmupProtocolBanner
        protocol={WARMUP_PROTOCOLS.lower}
        stepsDone={['hip_flexor', 'glute_bridge']}
        isDone={false}
        onToggleStep={onToggleStep}
        onComplete={onComplete}
        onReset={onReset}
      />
    )

    const resetBtn = [...el.querySelectorAll('button')].find(b => b.textContent.includes('Reset warm-up'))
    expect(resetBtn).toBeTruthy()
    act(() => {
      resetBtn.click()
    })
    expect(onReset).toHaveBeenCalled()
  })
})
