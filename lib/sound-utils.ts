// Audio chime synthesizer for live kitchen order alerts using Web Audio API
export function playOrderChime() {
  if (typeof window === 'undefined') return
  try {
    const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, startTime)
      gain.gain.setValueAtTime(0.15, startTime)
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(startTime)
      osc.stop(startTime + duration)
    }

    const now = ctx.currentTime
    playTone(523.25, now, 0.2)       // C5
    playTone(659.25, now + 0.15, 0.25) // E5
    playTone(783.99, now + 0.3, 0.4)  // G5
  } catch (err) {
    console.warn('Audio feedback notification skipped:', err)
  }
}
