// ===================================
// MOBILE ENHANCEMENTS & PROFILE PICTURE
// Advanced mobile features + profile upload
// ===================================

(function() {
  'use strict';

  // ===================================
  // MOBILE DETECTION
  // ===================================
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const isTablet = window.matchMedia('(min-width: 481px) and (max-width: 1024px)').matches;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ===================================
  // PROFILE PICTURE UPLOAD
  // ===================================
  function setupProfilePictureUpload() {
    const editBtn = document.getElementById('edit-avatar-btn');
    const fileInput = document.getElementById('avatar-upload');
    const avatarImg = document.getElementById('profile-avatar-img');
    const avatarPlaceholder = document.getElementById('profile-avatar-placeholder');

    if (!editBtn || !fileInput) {
      // Create elements if they don't exist
      createProfileUploadElements();
      return;
    }

    // Trigger file input on button click
    editBtn.addEventListener('click', () => {
      fileInput.click();
    });

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.match('image.*')) {
        showToast('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB');
        return;
      }

      // Read and display image
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target.result;
        
        // Update avatar display
        if (avatarImg) {
          avatarImg.src = imageData;
          avatarImg.classList.remove('hidden');
        }
        if (avatarPlaceholder) {
          avatarPlaceholder.style.display = 'none';
        }

        // Save to state and storage
        if (typeof state !== 'undefined') {
          state.user.avatar = imageData;
          if (typeof saveToLocalStorage === 'function') {
            saveToLocalStorage();
          }
        }

        // Show success with animation
        showToast('Profile picture updated!');
        
        // Trigger particle effect
        if (window.advancedAnimations && editBtn) {
          const rect = editBtn.getBoundingClientRect();
          window.advancedAnimations.createParticleBurst(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
            '#10b981',
            20
          );
        }
      };

      reader.readAsDataURL(file);
    });

    // Load saved avatar on page load
    loadSavedAvatar();
  }

  function createProfileUploadElements() {
    const profileAvatar = document.querySelector('.profile-avatar');
    if (!profileAvatar) return;

    // Wrap avatar in wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'profile-avatar-wrapper';
    profileAvatar.parentNode.insertBefore(wrapper, profileAvatar);
    wrapper.appendChild(profileAvatar);

    // Add image element
    const img = document.createElement('img');
    img.id = 'profile-avatar-img';
    img.className = 'profile-avatar-image hidden';
    img.alt = 'Profile';
    profileAvatar.insertBefore(img, profileAvatar.firstChild);

    // Add placeholder ID to SVG
    const svg = profileAvatar.querySelector('svg');
    if (svg) {
      svg.id = 'profile-avatar-placeholder';
    }

    // Create edit button
    const editBtn = document.createElement('button');
    editBtn.id = 'edit-avatar-btn';
    editBtn.className = 'profile-avatar-edit';
    editBtn.type = 'button';
    editBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    `;
    wrapper.appendChild(editBtn);

    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'avatar-upload';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    wrapper.appendChild(fileInput);

    // Now setup the functionality
    setTimeout(() => setupProfilePictureUpload(), 100);
  }

  function loadSavedAvatar() {
    if (typeof state === 'undefined' || !state.user || !state.user.avatar) return;

    const avatarImg = document.getElementById('profile-avatar-img');
    const avatarPlaceholder = document.getElementById('profile-avatar-placeholder');

    if (avatarImg && state.user.avatar) {
      avatarImg.src = state.user.avatar;
      avatarImg.classList.remove('hidden');
      if (avatarPlaceholder) {
        avatarPlaceholder.style.display = 'none';
      }
    }
  }

  // ===================================
  // MOBILE NAVIGATION
  // ===================================
  function setupMobileNavigation() {
    if (!isMobile) return;

    // Create mobile header
    createMobileHeader();
    
    // Create bottom navigation
    createBottomNav();
    
    // Create overlay
    createMobileOverlay();
    
    // Setup gestures
    setupSwipeGestures();
    
    // Setup pull-to-refresh
    setupPullToRefresh();
  }

  function createMobileHeader() {
    const existing = document.querySelector('.mobile-header');
    if (existing) return;

    const header = document.createElement('div');
    header.className = 'mobile-header';
    header.innerHTML = `
      <button class="mobile-menu-btn" id="mobile-menu-btn">
        <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
        </svg>
      </button>
      <h2 class="mobile-header-title">CaloCount</h2>
      <div style="width: 40px;"></div>
    `;

    document.body.insertBefore(header, document.body.firstChild);

    // Setup menu button
    const menuBtn = document.getElementById('mobile-menu-btn');
    menuBtn.addEventListener('click', toggleMobileMenu);
  }

  function createBottomNav() {
    const existing = document.querySelector('.mobile-bottom-nav');
    if (existing) return;

    const nav = document.createElement('div');
    nav.className = 'mobile-bottom-nav';
    nav.innerHTML = `
      <button class="mobile-nav-item active" data-view="dashboard">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
        <span>Home</span>
      </button>

      <button class="mobile-nav-item" data-view="camera">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
        <span>Scan</span>
      </button>

      <button class="mobile-nav-item" data-view="analytics">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <span>Stats</span>
      </button>

      <button class="mobile-nav-item" data-view="profile">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
        </svg>
        <span>Profile</span>
      </button>
    `;

    document.body.appendChild(nav);

    // Setup navigation
    const navItems = nav.querySelectorAll('.mobile-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const view = item.dataset.view;
        
        // Update active state
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Switch view
        if (typeof switchView === 'function') {
          switchView(view);
        }

        // Update header title
        updateMobileHeaderTitle(view);

        // Haptic feedback (if available)
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
      });
    });
  }

  function createMobileOverlay() {
    const existing = document.querySelector('.mobile-overlay');
    if (existing) return;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay';
    overlay.id = 'mobile-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      toggleMobileMenu();
    });
  }

  function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('mobile-overlay');

    if (sidebar && overlay) {
      sidebar.classList.toggle('mobile-open');
      overlay.classList.toggle('active');
      document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
    }
  }

  function updateMobileHeaderTitle(view) {
    const title = document.querySelector('.mobile-header-title');
    if (!title) return;

    const titles = {
      dashboard: 'Dashboard',
      camera: 'Scan Meal',
      history: 'History',
      plans: 'Plans',
      analytics: 'Analytics',
      profile: 'Profile'
    };

    title.textContent = titles[view] || 'CaloCount';
  }

  // ===================================
  // SWIPE GESTURES
  // ===================================
  function setupSwipeGestures() {
    if (!isTouch) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    mainContent.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    mainContent.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const minSwipeDistance = 50;

      // Horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && touchStartX < 50) {
          // Swipe right from edge - open menu
          toggleMobileMenu();
        }
      }

      // Vertical swipe down for refresh
      if (deltaY > 100 && touchStartY < 100) {
        refreshCurrentView();
      }
    }
  }

  // ===================================
  // PULL-TO-REFRESH
  // ===================================
  function setupPullToRefresh() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    let startY = 0;
    let currentY = 0;
    let pulling = false;

    mainContent.addEventListener('touchstart', (e) => {
      if (mainContent.scrollTop === 0) {
        startY = e.touches[0].pageY;
        pulling = true;
      }
    }, { passive: true });

    mainContent.addEventListener('touchmove', (e) => {
      if (!pulling) return;

      currentY = e.touches[0].pageY;
      const distance = currentY - startY;

      if (distance > 0 && distance < 150) {
        mainContent.style.transform = `translateY(${distance / 3}px)`;
      }
    }, { passive: true });

    mainContent.addEventListener('touchend', () => {
      if (!pulling) return;

      const distance = currentY - startY;

      if (distance > 80) {
        refreshCurrentView();
      }

      mainContent.style.transform = '';
      pulling = false;
      startY = 0;
      currentY = 0;
    }, { passive: true });
  }

  function refreshCurrentView() {
    const currentView = typeof state !== 'undefined' ? state.currentView : 'dashboard';

    // Show loading
    if (typeof showLoading === 'function') {
      showLoading('Refreshing...');
    }

    // Refresh based on view
    setTimeout(() => {
      if (currentView === 'dashboard') {
        if (typeof updateDashboard === 'function') {
          updateDashboard();
          if (typeof renderRecentMeals === 'function') renderRecentMeals();
        }
      } else if (currentView === 'analytics') {
        if (typeof refreshAnalytics === 'function') {
          refreshAnalytics();
        }
      } else if (currentView === 'history') {
        if (typeof renderHistory === 'function') {
          renderHistory();
        }
      }

      if (typeof hideLoading === 'function') {
        hideLoading();
      }

      if (typeof showToast === 'function') {
        showToast('Refreshed!');
      }

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(15);
      }
    }, 500);
  }

  // ===================================
  // FLOATING ACTION BUTTON
  // ===================================
  function createFloatingActionButton() {
    if (!isMobile) return;

    const existing = document.querySelector('.fab');
    if (existing) return;

    const fab = document.createElement('button');
    fab.className = 'fab';
    fab.innerHTML = `
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
      </svg>
    `;

    document.body.appendChild(fab);

    fab.addEventListener('click', () => {
      if (typeof switchView === 'function') {
        switchView('camera');
      }

      // Update bottom nav
      const navItems = document.querySelectorAll('.mobile-nav-item');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === 'camera') {
          item.classList.add('active');
        }
      });

      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(20);
      }
    });
  }

  // ===================================
  // VIEWPORT HEIGHT FIX (Mobile)
  // ===================================
  function fixMobileViewportHeight() {
    if (!isMobile) return;

    const updateHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateHeight, 100);
    });
  }

  // ===================================
  // PERFORMANCE OPTIMIZATIONS
  // ===================================
  function optimizeForMobile() {
    if (!isMobile) return;

    // Disable hover effects on mobile
    document.body.classList.add('mobile-device');

    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Optimize images
    document.querySelectorAll('img').forEach(img => {
      img.loading = 'lazy';
    });
  }

  // ===================================
  // INITIALIZE ALL MOBILE FEATURES
  // ===================================
  function initializeMobileEnhancements() {
    console.log('📱 Initializing mobile enhancements...');

    // Profile picture upload (all devices)
    setupProfilePictureUpload();

    // Mobile-specific features
    if (isMobile) {
      setupMobileNavigation();
      createFloatingActionButton();
      fixMobileViewportHeight();
      optimizeForMobile();
      console.log('✅ Mobile features activated');
    }

    // Tablet-specific features
    if (isTablet) {
      console.log('✅ Tablet optimizations activated');
    }

    console.log('✨ All mobile enhancements ready!');
  }

  // ===================================
  // AUTO-INITIALIZE
  // ===================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMobileEnhancements);
  } else {
    initializeMobileEnhancements();
  }

  // Reinitialize on view changes
  const originalSwitchView = window.switchView;
  if (originalSwitchView) {
    window.switchView = function(...args) {
      originalSwitchView.apply(this, args);
      
      // Update mobile nav if exists
      if (isMobile) {
        const view = args[0];
        updateMobileHeaderTitle(view);
        
        const navItems = document.querySelectorAll('.mobile-nav-item');
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.view === view);
        });
      }
    };
  }

  // Export functions
  window.mobileEnhancements = {
    toggleMenu: toggleMobileMenu,
    refreshView: refreshCurrentView,
    setupProfilePicture: setupProfilePictureUpload
  };

})();

console.log('📱 Mobile Enhancements Module Loaded');