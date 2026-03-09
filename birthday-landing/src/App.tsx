import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './App.css'
import rithikaImg from './assets/rithika.png'
import BirthdayGallery from './components/BirthdayGallery'

const CardIntro: React.FC = () => {
  const navigate = useNavigate()
  const [isOpening, setIsOpening] = React.useState(false)
  const [isCandleOut, setIsCandleOut] = React.useState(false)

  const handleOpen = () => {
    if (isOpening) return
    setIsCandleOut(true)
    setIsOpening(true)
    window.setTimeout(() => {
      navigate('/birthday')
    }, 1400)
  }

  return (
    <div className="card-intro-root" onClick={handleOpen}>
      <div className={`card-intro-card ${isOpening ? 'card-intro-open' : ''}`}>
        <div className="card-intro-front">
          <div className="card-intro-label">You are invited ✨</div>
          <div className="card-intro-front-text">
            <span className="card-intro-kicker">Welcome to</span>
            <span className="card-intro-name">Rithika&apos;s 4th Birthday</span>
          </div>
        </div>
        <div className="card-intro-inner">
          <div className="card-intro-cake-wrap">
            <div className="card-intro-cake">
              <div className="cake-layer cake-layer-bottom" />
              <div className="cake-layer cake-layer-top" />
              <div className="cake-icing" />
              <div className="cake-candle">
                {!isCandleOut && <div className="candle-flame" />}
                {isCandleOut && <div className="candle-smoke" />}
              </div>
            </div>
          </div>
          <p>We warmly welcome you to celebrate our little princess.</p>
          <p className="card-intro-small">Tap anywhere to open the invitation 🎂</p>
        </div>
      </div>
    </div>
  )
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const [isPlaying, setIsPlaying] = React.useState(false)
  const audioRef = React.useRef<HTMLAudioElement | null>(null)

  const toggleMusic = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.volume = 0.4
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // autoplay blocked until user interacts; ignore
        })
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="landing-root">
      {/* background audio - expects public/birthday-song.mp3 */}
      <audio ref={audioRef} src="/birthday-song.mp3" loop />

      <button
        type="button"
        className={`music-toggle ${isPlaying ? 'music-toggle-on' : ''}`}
        onClick={toggleMusic}
      >
        {isPlaying ? '⏸ Music' : '▶ Music'}
      </button>

      {/* background decor */}
      <div className="landing-cloud landing-cloud-1" />
      <div className="landing-cloud landing-cloud-2" />
      <div className="landing-cloud landing-cloud-3" />
      <div className="landing-stars" />
      <div className="landing-balloon-bg landing-balloon-bg-1" />
      <div className="landing-balloon-bg landing-balloon-bg-2" />
      <div className="landing-balloon-bg landing-balloon-bg-3" />

      <div className="landing-container">
        {/* left side text */}
        <div className="landing-left">
          <div className="landing-badge">✨ 4th Birthday Special ✨</div>

          <div className="landing-heading">
            <span className="landing-heading-line landing-heading-soft">
              Happy
            </span>
            <span className="landing-heading-line landing-heading-strong">
              Birthday
            </span>
            <span className="landing-name-chip">Princess Rithika</span>
          </div>

          <p className="landing-subtitle">
            Celebrating 4 magical years of smiles, twirls and giggles.
          </p>

          <div className="landing-date-pill">★ March 10 ★</div>

          <button
            type="button"
            className="landing-cta"
            onClick={() => navigate('/gallery')}
          >
            <span>Open Birthday Memories</span>
            <span className="landing-cta-icon">🎈</span>
          </button>

          <div className="landing-footer-note">
            Click the button to see your rope gallery and tap a photo for
            confetti.
          </div>
        </div>

        {/* right side avatar card */}
        <div className="landing-right">
          <div className="landing-card">
            <div className="landing-card-ribbon">Dear Rithika</div>

            <div className="landing-avatar-ring">
              <img
                src={rithikaImg}
                alt="Rithika avatar"
                className="landing-avatar-img"
              />
              <div className="landing-avatar-glow" />
              <div className="landing-age-chip">4 Years Old 🎉</div>
            </div>

            <div className="landing-card-bottom">
              <span className="landing-chip">Sparkle • Laugh • Grow</span>
              <span className="landing-chip secondary">
                You are our sunshine ☀️
              </span>
            </div>

            <div className="landing-floating-sticker sticker-heart">💖</div>
            <div className="landing-floating-sticker sticker-star">⭐</div>
          </div>
        </div>
      </div>
      <div className="landing-timeline">
        <div
          className="timeline-item"
          data-detail="Your first cuddles and tiny yawns."
        >
          <span className="timeline-dot">👶</span>
          <span className="timeline-label">Baby</span>
        </div>
        <div
          className="timeline-item"
          data-detail="Little steps, little words, big personality."
        >
          <span className="timeline-dot">🚶‍♀️</span>
          <span className="timeline-label">Toddler</span>
        </div>
        <div
          className="timeline-item"
          data-detail="Backpacks, braids and new stories every day."
        >
          <span className="timeline-dot">🎒</span>
          <span className="timeline-label">School Girl</span>
        </div>
        <div
          className="timeline-item"
          data-detail="Today we celebrate the magic of 4!"
        >
          <span className="timeline-dot">🎂</span>
          <span className="timeline-label">Today</span>
        </div>
      </div>

      <div className="landing-personal">
        Born on March 10, 2022 • Favorite color: Pink • Loves: dancing,
        chocolates, cartoons
      </div>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CardIntro />} />
      <Route path="/birthday" element={<LandingPage />} />
      <Route path="/gallery" element={<BirthdayGallery />} />
    </Routes>
  )
}

export default App
