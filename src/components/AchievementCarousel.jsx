import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    image: '/images/suit2.jpeg',
    caption: 'TODAYS HIGH VOLUME ACHIEVER MR.SAMPLE1',
  },
  {
    image: '/images/suit3.jpeg',
    caption: 'TODAYS HIGH TEAM VOLUME ACHIEVER MR.SAMPLE3',
  },
  {
    image: '/images/suit3.jpeg',
    caption: 'HIGHESR TRUST SCORE ACEIEVER MR.SAMPLE4',
  },
  {
    image: '/images/suit4.jpeg',
    caption: 'TODAYS HIGH VOLUME ACHIEVER MR.SAMPLE1',
  },
  {
    image: '/images/suit5.jpeg',
    caption: 'TODAYS HIGH TEAM VOLUME ACHIEVER MR.SAMPLE3',
  },
  {
    image: '/images/suit6.jpeg',
    caption: 'HIGHESR TRUST SCORE ACEIEVER MR.SAMPLE4',
  },
]

export default function AchievementCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState('next')

  useEffect(() => {
    const timer = window.setInterval(() => {
      setDirection('next')
      setActiveIndex((index) => (index + 1) % SLIDES.length)
    }, 4200)

    return () => window.clearInterval(timer)
  }, [])

  const goTo = (nextIndex) => {
    const normalizedIndex = (nextIndex + SLIDES.length) % SLIDES.length
    setDirection(normalizedIndex > activeIndex ? 'next' : 'prev')
    setActiveIndex(normalizedIndex)
  }

  const activeSlide = SLIDES[activeIndex]

  return (
    <section className="achievement-strip" aria-label="Top achievers spotlight">
      <div className="achievement-label">
        <span className="live-dot" />
        <span>Spotlight</span>
      </div>

      <div className="carousel-shell">
        <button
          className="carousel-arrow"
          type="button"
          aria-label="Previous achiever"
          onClick={() => goTo(activeIndex - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="carousel-viewport">
          <div className={`achievement-slide slide-${direction}`} key={`${activeIndex}-${direction}`}>
            <img src={activeSlide.image} alt="" />
            <p>{activeSlide.caption}</p>
          </div>
        </div>

        <button
          className="carousel-arrow"
          type="button"
          aria-label="Next achiever"
          onClick={() => goTo(activeIndex + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="carousel-dots" aria-label="Choose achiever">
        {SLIDES.map((slide, index) => (
          <button
            className={index === activeIndex ? 'carousel-dot active' : 'carousel-dot'}
            key={`${slide.image}-${index}`}
            type="button"
            aria-label={`Show achiever ${index + 1}`}
            aria-current={index === activeIndex}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </section>
  )
}
