import gsap from 'gsap'

/**
 * Check if user prefers reduced motion
 */
export const prefersReducedMotion = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Fade in element with slight upward motion
 */
export const fadeIn = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.from(element, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: 'power2.out',
    ...options,
  })
}

/**
 * Fade out element with slight downward motion
 */
export const fadeOut = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.to(element, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: 'power2.in',
    ...options,
  })
}

/**
 * Slide in from right (for detail views)
 */
export const slideIn = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out',
    ...options,
  })
}

/**
 * Slide out to right (when going back)
 */
export const slideOut = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.to(element, {
    x: 100,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    ...options,
  })
}

/**
 * Button press feedback - scale down
 */
export const scalePress = (element: HTMLElement | null) => {
  if (!element || prefersReducedMotion()) return

  return gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power1.inOut',
    yoyo: true,
    repeat: 1,
  })
}

/**
 * Card hover lift effect
 */
export const cardHover = (element: HTMLElement | null, isHovering: boolean) => {
  if (!element || prefersReducedMotion()) return

  if (isHovering) {
    return gsap.to(element, {
      y: -4,
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
      duration: 0.2,
      ease: 'power1.out',
    })
  } else {
    return gsap.to(element, {
      y: 0,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      duration: 0.2,
      ease: 'power1.in',
    })
  }
}

/**
 * Status badge pulse animation
 */
export const statusPulse = (element: HTMLElement | null) => {
  if (!element || prefersReducedMotion()) return

  return gsap.fromTo(
    element,
    { scale: 1 },
    {
      scale: 1.1,
      duration: 0.3,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1,
    }
  )
}

/**
 * Shake animation for validation errors
 */
export const shakeError = (element: HTMLElement | null) => {
  if (!element || prefersReducedMotion()) return

  return gsap.fromTo(
    element,
    { x: 0 },
    {
      x: -10,
      duration: 0.1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 3,
    }
  )
}

/**
 * Smooth scroll to element
 */
export const scrollToElement = (element: HTMLElement | null, offset = 0) => {
  if (!element) return

  const y = element.getBoundingClientRect().top + window.pageYOffset + offset

  if (prefersReducedMotion()) {
    window.scrollTo(0, y)
    return
  }

  return gsap.to(window, {
    scrollTo: { y, autoKill: false },
    duration: 0.5,
    ease: 'power2.inOut',
  })
}

/**
 * Stagger animation for list items
 */
export const staggerIn = (elements: HTMLElement[] | NodeListOf<Element>, options: gsap.TweenVars = {}) => {
  if (!elements || elements.length === 0 || prefersReducedMotion()) return

  return gsap.from(elements, {
    opacity: 0,
    y: 20,
    duration: 0.3,
    ease: 'power2.out',
    stagger: 0.05,
    ...options,
  })
}

/**
 * Loading spinner rotation
 */
export const spinLoader = (element: HTMLElement | null) => {
  if (!element) return

  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: 'linear',
    repeat: -1,
  })
}

/**
 * Progress bar animation
 */
export const animateProgress = (element: HTMLElement | null, progress: number) => {
  if (!element) return

  if (prefersReducedMotion()) {
    element.style.width = `${progress}%`
    return
  }

  return gsap.to(element, {
    width: `${progress}%`,
    duration: 0.5,
    ease: 'power2.out',
  })
}

/**
 * Shimmer effect for skeleton loaders
 */
export const shimmer = (element: HTMLElement | null) => {
  if (!element || prefersReducedMotion()) return

  return gsap.fromTo(
    element,
    { backgroundPosition: '-200% 0' },
    {
      backgroundPosition: '200% 0',
      duration: 1.5,
      ease: 'linear',
      repeat: -1,
    }
  )
}

/**
 * Modal/Overlay fade in
 */
export const overlayFadeIn = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.from(element, {
    opacity: 0,
    duration: 0.2,
    ease: 'power1.out',
    ...options,
  })
}

/**
 * Modal/Overlay fade out
 */
export const overlayFadeOut = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.to(element, {
    opacity: 0,
    duration: 0.2,
    ease: 'power1.in',
    ...options,
  })
}

/**
 * Scale in animation (for modals/popovers)
 */
export const scaleIn = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.from(element, {
    scale: 0.95,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.out',
    ...options,
  })
}

/**
 * Scale out animation (for modals/popovers)
 */
export const scaleOut = (element: HTMLElement | null, options: gsap.TweenVars = {}) => {
  if (!element || prefersReducedMotion()) return

  return gsap.to(element, {
    scale: 0.95,
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in',
    ...options,
  })
}
