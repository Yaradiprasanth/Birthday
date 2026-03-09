import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Gallery.css'

const imageModules = import.meta.glob('../assets/gallery/*.png', {
  eager: true,
  as: 'url',
}) as Record<string, string>

// Remove duplicates created by multiple copies of the same WhatsApp image.
const rawImages: string[] = Array.from(
  new Map(
    Object.entries(imageModules).map(([path, url]) => {
      const fileName = path.split('/').pop() ?? path
      const logicalKey = fileName.replace(/-\w+\.png$/i, '.png')
      return [logicalKey, url]
    }),
  ).values(),
)

// Custom ordering: drop the first 3 images from the set so the
// remaining favourites (including the last two) appear and end
// on the final rope.
const images: string[] = rawImages.length > 3 ? rawImages.slice(3) : rawImages

const groupImages = (items: string[], perRow: number) => {
  const groups: string[][] = []
  for (let i = 0; i < items.length; i += perRow) {
    groups.push(items.slice(i, i + perRow))
  }
  return groups
}

// 4–6 per rope; adjust if you want tighter spacing
const groupedImages = groupImages(images, 5)

const captions: string[] = [
  'Baby smiles',
  'Tiny twirls',
  'Princess look',
  'Cheeky smile',
  'Family moments',
  'Birthday sparkle',
]

type ConfettiPiece = {
  id: number
  left: number
  delay: number
  color: string
  batchId: number
  shape: 'square' | 'circle' | 'bar'
}

const BirthdayGallery: React.FC = () => {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const chimeRef = useRef<HTMLAudioElement | null>(null)
  const navigate = useNavigate()

  const triggerConfetti = () => {
    const batchId = Date.now()
    const colors = ['#ff9aa2', '#ffb7b2', '#ffdac1', '#e2f0cb', '#b5ead7', '#c7ceea']
    const shapes: ConfettiPiece['shape'][] = ['square', 'circle', 'bar']

    const pieces: ConfettiPiece[] = Array.from({ length: 80 }).map((_, index) => ({
      id: batchId + index,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: colors[index % colors.length],
      batchId,
      shape: shapes[index % shapes.length],
    }))

    setConfetti((prev) => [...prev, ...pieces])

    const chime = chimeRef.current
    if (chime) {
      chime.currentTime = 0
      chime.volume = 0.6
      chime.play().catch(() => {})
    }

    window.setTimeout(() => {
      setConfetti((prev) => prev.filter((piece) => piece.batchId !== batchId))
    }, 2200)
  }

  return (
    <div className="gallery-page">
      <audio ref={chimeRef} src="/confetti-chime.mp3" />

      <div className="gallery-balloons">
        <div className="balloon-bg balloon-bg-1" />
        <div className="balloon-bg balloon-bg-2" />
        <div className="balloon-bg balloon-bg-3" />
        <div className="balloon-bg balloon-bg-4" />
        <div className="balloon-bg balloon-bg-5" />
      </div>

      <div className="gallery-confetti-layer">
        {confetti.map((piece) => (
          <span
            key={piece.id}
            className={`confetti-piece confetti-${piece.shape}`}
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              backgroundColor: piece.color,
            }}
          />
        ))}
      </div>

      <div className="gallery-inner">
        <button
          type="button"
          className="gallery-back-button"
          onClick={() => navigate('/birthday')}
        >
          ← Back to Birthday card
        </button>

        <h1 className="gallery-title">Birthday Memories 🎂</h1>

        <p className="gallery-intro">
          Every picture on these ropes holds a tiny piece of your story. Click
          one to shower you with confetti!
        </p>

        <button
          type="button"
          className="gallery-share-button"
          onClick={() => {
            const url = window.location.href
            if (navigator.clipboard) {
              navigator.clipboard
                .writeText(url)
                .then(() => window.alert('Link copied! Share it with family.'))
                .catch(() =>
                  window.alert(`Copy this link to share:\n${url}`),
                )
            } else {
              window.alert(`Copy this link to share:\n${url}`)
            }
          }}
        >
          Share this page with family
        </button>

        <div className="gallery-ropes">
          {groupedImages.map((row, rowIndex) => (
            <div className="rope-row" key={rowIndex}>
              <div className="rope-label">
                {rowIndex === 0 && 'Baby days 👶'}
                {rowIndex === 1 && 'Little celebrations 🎉'}
                {rowIndex === 2 && 'Now you are 4 🎂'}
              </div>
              {row.map((src, index) => {
                const rotationClasses = [
                  'tilt-left',
                  'tilt-right',
                  'tilt-slight',
                  'tilt-left-strong',
                  'tilt-right-strong',
                ]
                const rotationClass =
                  rotationClasses[(rowIndex * row.length + index) % rotationClasses.length]
                const globalIndex = rowIndex * row.length + index

                return (
                  <div
                    className={`photo-card ${rotationClass}`}
                    key={`${rowIndex}-${index}`}
                    onClick={() => {
                      triggerConfetti()
                      setActiveImage(src)
                    }}
                    style={{
                      animationDelay: `${0.08 * globalIndex}s`,
                    }}
                  >
                    <div className="photo-clip" />
                    <div className="photo-polaroid">
                      <img
                        src={src}
                        alt="Birthday memory"
                        className="photo-image"
                      />
                      <div className="photo-caption">
                        {captions[globalIndex % captions.length]}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="gallery-note-card">
          Dear Rithika, every year you grow, but you will always be our little
          miracle. – Amma &amp; Nana
        </div>
      </div>

      {activeImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setActiveImage(null)}
            >
              ×
            </button>
            <img
              src={activeImage}
              alt="Birthday memory large"
              className="lightbox-image"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default BirthdayGallery

