import { useState } from 'react'
import Icon from './Icon.jsx'
import { Button } from './ui.jsx'
import { t } from '../lib/i18n.js'
import { useUI } from '../store/useUI.js'

export default function WarmupProtocolBanner({
  protocol,
  stepsDone = [],
  isDone = false,
  onToggleStep,
  onComplete,
  onReset
}) {
  const [collapsed, setCollapsed] = useState(isDone)

  if (!protocol) return null

  const steps = protocol.steps || []
  const doneCount = steps.filter(s => stepsDone.includes(s.id)).length
  const allStepsChecked = steps.length > 0 && doneCount === steps.length

  const handleStartTimer = (sec) => {
    useUI.getState().startRest(sec)
  }

  return (
    <div className="card warmup-protocol-card" style={{
      marginBottom: 16,
      borderColor: isDone || allStepsChecked ? 'var(--green, #22c55e)' : 'var(--acc, #6366f1)',
      backgroundColor: 'var(--card, #1c1c1e)',
      overflow: 'hidden'
    }}>
      {/* Header bar */}
      <div
        className="row between"
        style={{
          alignItems: 'center',
          cursor: 'pointer',
          padding: '4px 0',
          gap: 8
        }}
        onClick={() => setCollapsed(prev => !prev)}
      >
        <div className="row" style={{ alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: isDone || allStepsChecked ? 'rgba(34, 197, 94, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            color: isDone || allStepsChecked ? 'var(--green, #22c55e)' : 'var(--acc, #6366f1)'
          }}>
            <Icon name={isDone || allStepsChecked ? 'check' : 'heartPulse'} style={{ fontSize: 16 }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span>{t(protocol.name)}</span>
              <span className="tag" style={{ fontSize: 11, padding: '1px 6px', borderColor: 'var(--acc)', color: 'var(--acc)' }}>
                {t('Mobility · No Volume')}
              </span>
            </div>
            <div className="small dim">
              {isDone || allStepsChecked
                ? t('Completed ({0}/{1} steps) · Ready to lift', doneCount, steps.length)
                : t('{0}/{1} steps done · {2}', doneCount, steps.length, protocol.duration)}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="iconbtn"
          aria-label={collapsed ? t('Expand warm-up') : t('Collapse warm-up')}
          style={{ width: 32, height: 32 }}
        >
          <Icon name={collapsed ? 'chevronDown' : 'chevronUp'} />
        </button>
      </div>

      {/* Expanded Content */}
      {!collapsed && (
        <div style={{ marginTop: 12, borderTop: '1px solid var(--border, #2c2c2e)', paddingTop: 12 }}>
          {protocol.description && (
            <div className="small dim" style={{ marginBottom: 12, lineHeight: 1.4 }}>
              {t(protocol.description)}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {steps.map((step, idx) => {
              const checked = stepsDone.includes(step.id)
              return (
                <div
                  key={step.id}
                  style={{
                    backgroundColor: checked ? 'rgba(34, 197, 94, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    border: '1px solid',
                    borderColor: checked ? 'rgba(34, 197, 94, 0.3)' : 'var(--border, #2c2c2e)'
                  }}
                >
                  <div className="row between" style={{ alignItems: 'flex-start', gap: 8 }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      flex: 1,
                      cursor: 'pointer'
                    }}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onToggleStep(step.id)}
                        style={{
                          marginTop: 2,
                          width: 18,
                          height: 18,
                          accentColor: 'var(--acc)'
                        }}
                      />
                      <div>
                        <div style={{
                          fontWeight: 500,
                          fontSize: 14,
                          textDecoration: checked ? 'line-through' : 'none',
                          color: checked ? 'var(--dim)' : 'inherit'
                        }}>
                          {idx + 1}. {t(step.name)}
                        </div>
                        <div style={{
                          fontSize: 12,
                          color: 'var(--acc)',
                          fontWeight: 600,
                          marginTop: 1
                        }}>
                          {step.target}
                        </div>
                      </div>
                    </label>

                    {step.videoUrl && (
                      <a
                        href={step.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                        style={{
                          fontSize: 11,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                          color: 'var(--dim)',
                          textDecoration: 'none',
                          padding: '3px 6px',
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        <Icon name="link" style={{ fontSize: 10 }} />
                        <span>{t('Form')}</span>
                      </a>
                    )}
                  </div>

                  {step.cue && (
                    <div className="small dim" style={{ marginTop: 4, marginLeft: 28, fontSize: 12 }}>
                      {step.cue}
                    </div>
                  )}

                  {step.type === 'timer' && step.sec && (
                    <div style={{ marginTop: 6, marginLeft: 28 }}>
                      <Button
                        size="sm"
                        variant="tinted"
                        icon="timer"
                        onClick={() => handleStartTimer(step.sec)}
                      >
                        {t('Start {0}s stretch timer', step.sec)}
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="row" style={{ marginTop: 14, justifyContent: 'flex-end', gap: 8 }}>
            {isDone || allStepsChecked ? (
              <Button size="sm" variant="subtle" onClick={onReset}>
                {t('Reset warm-up')}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="tinted"
                icon="check"
                onClick={() => {
                  onComplete()
                  setCollapsed(true)
                }}
              >
                {t('Mark warm-up complete')}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
