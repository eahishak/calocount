// ===================================
// ADVANCED ANIMATIONS & INTERACTIONS
// Features: Particle Effects, Micro-interactions, Gestures, Page Transitions
// ===================================

class AdvancedAnimations {
  constructor() {
    this.particles = [];
    this.activeGestures = new Map();
    this.animationFrame = null;
    this.init();
  }

  init() {
    this.setupPageTransitions();
    this.setupMicroInteractions();
    this.setupParticleSystem();
    this.setupGestureControls();
    this.setupScrollAnimations();
    this.setupSuccessAnimations();
  }

  // ===================================
  // PAGE TRANSITIONS
  // ===================================
  setupPageTransitions() {
    const originalSwitchView = window.switchView;
    
    window.switchView = (viewName) => {
      const activeView = document.querySelector('.view.active');
      const targetView = document.getElementById(`${viewName}-view`);
      
      if (!targetView || activeView === targetView) return;

      // Exit animation for current view
      if (activeView) {
        activeView.style.animation = 'fadeOutScale 0.3s cubic-bezier(0.4, 0, 1, 1) forwards';
        
        setTimeout(() => {
          activeView.classList.remove('active');
          activeView.style.animation = '';
          
          // Enter animation for new view
          targetView.classList.add('active');
          targetView.style.animation = 'fadeInScale 0.4s cubic-bezier(0, 0, 0.2, 1) forwards';
          
          setTimeout(() => {
            targetView.style.animation = '';
          }, 400);
        }, 300);
      } else {
        targetView.classList.add('active');
      }

      // Update navigation
      document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
          item.classList.add('active');
          this.rippleEffect(item);
        }
      });
      
      state.currentView = viewName;
      
      // Trigger specific animations for each view
      setTimeout(() => this.animateViewElements(viewName), 350);
    };
  }

  animateViewElements(viewName) {
    const view = document.getElementById(`${viewName}-view`);
    if (!view) return;

    const elements = view.querySelectorAll('.stat-card, .meal-card, .plan-card, .history-item');
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 50);
    });
  }

  // ===================================
  // MICRO-INTERACTIONS
  // ===================================
  setupMicroInteractions() {
    // Button hover effects
    document.addEventListener('mouseover', (e) => {
      if (e.target.matches('.btn-primary, .btn-secondary, .btn-control')) {
        this.buttonHoverEffect(e.target);
      }
    });

    // Card hover effects
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.stat-card, .meal-card, .plan-card')) {
        const card = e.target.closest('.stat-card, .meal-card, .plan-card');
        this.cardHoverEffect(card, e);
      }
    });

    // Input focus effects
    document.addEventListener('focus', (e) => {
      if (e.target.matches('.form-input, .form-textarea')) {
        this.inputFocusEffect(e.target);
      }
    }, true);

    // Click ripple effect
    document.addEventListener('click', (e) => {
      if (e.target.matches('button:not(.btn-icon)')) {
        this.rippleEffect(e.target, e);
      }
    });

    // Progress bar animations
    this.animateProgressBars();
  }

  buttonHoverEffect(button) {
    const rect = button.getBoundingClientRect();
    const glow = document.createElement('div');
    glow.className = 'button-glow';
    glow.style.cssText = `
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899, #8b5cf6, #6366f1);
      background-size: 400% 400%;
      border-radius: inherit;
      opacity: 0;
      z-index: -1;
      filter: blur(8px);
      animation: glowPulse 3s ease infinite;
    `;
    
    if (button.style.position !== 'absolute' && button.style.position !== 'relative') {
      button.style.position = 'relative';
    }
    
    button.appendChild(glow);
    
    requestAnimationFrame(() => {
      glow.style.opacity = '0.6';
    });

    button.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
      setTimeout(() => glow.remove(), 300);
    }, { once: true });
  }

  cardHoverEffect(card, event) {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = 'transform 0.1s ease';
    
    // Add shine effect
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    shine.style.cssText = `
      position: absolute;
      top: ${y}px;
      left: ${x}px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    if (card.style.position !== 'absolute' && card.style.position !== 'relative') {
      card.style.position = 'relative';
    }
    card.style.overflow = 'hidden';
    
    card.appendChild(shine);
    requestAnimationFrame(() => shine.style.opacity = '0.5');
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      shine.style.opacity = '0';
      setTimeout(() => shine.remove(), 300);
    }, { once: true });
  }

  inputFocusEffect(input) {
    const parent = input.parentElement;
    const ripple = document.createElement('div');
    ripple.className = 'input-focus-ripple';
    ripple.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      transform: translateX(-50%);
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      pointer-events: none;
    `;
    
    if (parent.style.position !== 'absolute' && parent.style.position !== 'relative') {
      parent.style.position = 'relative';
    }
    
    parent.appendChild(ripple);
    requestAnimationFrame(() => ripple.style.width = '100%');
    
    input.addEventListener('blur', () => {
      ripple.style.width = '0';
      setTimeout(() => ripple.remove(), 300);
    }, { once: true });
  }

  rippleEffect(element, event = null) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    
    let x, y;
    if (event) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      x = rect.width / 2;
      y = rect.height / 2;
    }
    
    const size = Math.max(rect.width, rect.height) * 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      top: ${y}px;
      left: ${x}px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: rippleAnimation 0.6s ease-out;
      pointer-events: none;
    `;
    
    if (element.style.position !== 'absolute' && element.style.position !== 'relative') {
      element.style.position = 'relative';
    }
    element.style.overflow = 'hidden';
    
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  animateProgressBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target;
          const targetWidth = progressBar.style.width || '0%';
          progressBar.style.width = '0%';
          
          requestAnimationFrame(() => {
            setTimeout(() => {
              progressBar.style.transition = 'width 1s cubic-bezier(0.16, 1, 0.3, 1)';
              progressBar.style.width = targetWidth;
            }, 100);
          });
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.progress-fill').forEach(bar => {
      observer.observe(bar);
    });
  }

  // ===================================
  // PARTICLE SYSTEM
  // ===================================
  setupParticleSystem() {
    this.particleCanvas = document.createElement('canvas');
    this.particleCanvas.id = 'particle-canvas';
    this.particleCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.particleCanvas);
    
    this.particleCtx = this.particleCanvas.getContext('2d');
    this.resizeParticleCanvas();
    
    window.addEventListener('resize', () => this.resizeParticleCanvas());
  }

  resizeParticleCanvas() {
    this.particleCanvas.width = window.innerWidth;
    this.particleCanvas.height = window.innerHeight;
  }

  createParticleBurst(x, y, color = '#6366f1', count = 20) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 3;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 1,
        decay: 0.015 + Math.random() * 0.01,
        size: 3 + Math.random() * 4,
        color
      });
    }
    
    if (!this.animationFrame) {
      this.animateParticles();
    }
  }

  animateParticles() {
    this.particleCtx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);
    
    this.particles = this.particles.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.1; // Gravity
      particle.life -= particle.decay;
      
      if (particle.life > 0) {
        this.particleCtx.globalAlpha = particle.life;
        this.particleCtx.fillStyle = particle.color;
        this.particleCtx.beginPath();
        this.particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.particleCtx.fill();
        return true;
      }
      return false;
    });
    
    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animateParticles());
    } else {
      this.animationFrame = null;
    }
  }

  // ===================================
  // SUCCESS ANIMATIONS
  // ===================================
  setupSuccessAnimations() {
    const originalSaveMeal = window.saveMeal || (() => {});
    const originalCreatePlan = window.createPlan || (() => {});
    
    // Override save meal with success animation
    const animateSuccess = (element, callback) => {
      return function(...args) {
        const result = callback.apply(this, args);
        
        // Trigger particle burst at button location
        setTimeout(() => {
          const button = document.querySelector('#save-meal-btn');
          if (button) {
            const rect = button.getBoundingClientRect();
            window.advancedAnimations.createParticleBurst(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              '#10b981',
              30
            );
          }
          
          // Success pulse animation
          window.advancedAnimations.successPulse();
        }, 100);
        
        return result;
      };
    };
  }

  successPulse() {
    const pulse = document.createElement('div');
    pulse.className = 'success-pulse';
    pulse.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      margin: -50px 0 0 -50px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      animation: successPulseAnim 0.8s ease-out;
      pointer-events: none;
      z-index: 9998;
    `;
    
    document.body.appendChild(pulse);
    setTimeout(() => pulse.remove(), 800);
  }

  // ===================================
  // GESTURE CONTROLS
  // ===================================
  setupGestureControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + 1-5 for quick navigation
      if (e.altKey) {
        const views = ['dashboard', 'camera', 'history', 'plans', 'profile'];
        const num = parseInt(e.key);
        if (num >= 1 && num <= 5) {
          e.preventDefault();
          window.switchView(views[num - 1]);
        }
      }
    });
  }

  handleGesture(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX > 0) {
        // Swipe right - could go to previous view
        console.log('Swipe right detected');
      } else {
        // Swipe left - could go to next view
        console.log('Swipe left detected');
      }
    }
  }

  // ===================================
  // SCROLL ANIMATIONS
  // ===================================
  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateOnScroll = () => {
      document.querySelectorAll('.stat-card, .meal-card, .plan-card').forEach(el => {
        if (!el.dataset.observed) {
          el.dataset.observed = 'true';
          el.style.opacity = '0';
          el.style.transform = 'translateY(30px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          observer.observe(el);
        }
      });
    };

    // Run initially and on DOM changes
    animateOnScroll();
    
    const domObserver = new MutationObserver(animateOnScroll);
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ===================================
  // LOADING SPINNER ENHANCEMENT
  // ===================================
  enhanceLoadingSpinner() {
    const style = document.createElement('style');
    style.textContent = `
      .loading-spinner {
        position: relative;
      }
      
      .loading-spinner::after {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border: 4px solid transparent;
        border-top-color: rgba(139, 92, 246, 0.6);
        border-radius: 50%;
        animation: spin 1.5s linear infinite;
        animation-direction: reverse;
      }
    `;
    document.head.appendChild(style);
  }

  // ===================================
  // CONFETTI EFFECT
  // ===================================
  createConfetti() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const animDuration = 2 + Math.random() * 2;
        
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${left}%;
          width: 10px;
          height: 10px;
          background: ${color};
          opacity: 1;
          transform: rotate(${Math.random() * 360}deg);
          animation: confettiFall ${animDuration}s ease-in forwards;
          pointer-events: none;
          z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), animDuration * 1000);
      }, i * 30);
    }
  }
}

// ===================================
// CSS ANIMATIONS (injected dynamically)
// ===================================
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes fadeOutScale {
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(1.05);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes rippleAnimation {
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0;
    }
  }

  @keyframes glowPulse {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  @keyframes successPulseAnim {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    50% {
      transform: scale(3);
      opacity: 0.5;
    }
    100% {
      transform: scale(5);
      opacity: 0;
    }
  }

  @keyframes confettiFall {
    to {
      top: 100vh;
      transform: rotate(720deg);
      opacity: 0;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Smooth scrolling */
  * {
    scroll-behavior: smooth;
  }

  /* Enhanced transitions for all interactive elements */
  button, .nav-item, .stat-card, .meal-card, .plan-card {
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Hover lift effect */
  .stat-card:hover,
  .meal-card:hover,
  .plan-card:hover {
    transform: translateY(-4px) !important;
  }

  /* Focus visible for accessibility */
  *:focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }
`;
document.head.appendChild(animationStyles);

// Initialize and export
window.advancedAnimations = new AdvancedAnimations();

console.log('✨ Advanced Animations Module Loaded');