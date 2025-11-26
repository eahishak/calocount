// ===================================
// INTEGRATION MODULE
// Connects all advanced features together
// ===================================

(function() {
  'use strict';

  // ===================================
  // ADD ANALYTICS VIEW TO HTML
  // ===================================
  function injectAnalyticsView() {
    const profileSection = document.getElementById('profile-view');
    if (!profileSection) return;

    const analyticsHTML = `
      <section id="analytics-view" class="view">
        <header class="view-header">
          <div>
            <h1 class="view-title">Analytics & Insights</h1>
            <p class="view-subtitle">AI-powered nutrition analysis and predictions</p>
          </div>
          <button class="btn-secondary" onclick="refreshAnalytics()">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
            </svg>
            Refresh
          </button>
        </header>

        <div class="insights-section">
          <h2 class="section-title">AI-Powered Insights</h2>
          <div id="insights-container" class="insights-grid"></div>
        </div>

        <div class="charts-section">
          <div class="chart-card">
            <div class="chart-header">
              <h3 class="chart-title">Calorie Trend (Last 14 Days)</h3>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-dot" style="background: #6366f1;"></span> Actual
                </span>
                <span class="legend-item">
                  <span class="legend-dot" style="background: #f59e0b;"></span> Target
                </span>
              </div>
            </div>
            <canvas id="calorie-trend-chart" width="800" height="300"></canvas>
          </div>

          <div class="chart-grid">
            <div class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title">Macro Distribution</h3>
                <p class="chart-subtitle">Last 7 days average</p>
              </div>
              <canvas id="macro-donut-chart" width="300" height="300"></canvas>
            </div>

            <div class="chart-card">
              <div class="chart-header">
                <h3 class="chart-title">Weekly Progress</h3>
                <p class="chart-subtitle">Average daily calories</p>
              </div>
              <canvas id="weekly-progress-chart" width="400" height="300"></canvas>
            </div>
          </div>
        </div>

        <div class="predictions-section">
          <h2 class="section-title">7-Day Predictions</h2>
          <div id="predictions-container" class="predictions-grid"></div>
        </div>

        <div class="achievements-section">
          <h2 class="section-title">Achievements</h2>
          <div class="achievements-grid">
            <div class="achievement-card locked">
              <div class="achievement-icon">🔥</div>
              <h4>7-Day Streak</h4>
              <p>Track meals for 7 days straight</p>
              <div class="achievement-progress">
                <div class="achievement-progress-bar" style="width: 60%;"></div>
              </div>
              <p class="achievement-status">4/7 days</p>
            </div>

            <div class="achievement-card unlocked">
              <div class="achievement-icon">🎯</div>
              <h4>Goal Crusher</h4>
              <p>Hit your calorie target</p>
              <div class="achievement-badge">✓</div>
            </div>

            <div class="achievement-card locked">
              <div class="achievement-icon">💪</div>
              <h4>Protein Pro</h4>
              <p>Meet protein goals for 30 days</p>
              <div class="achievement-progress">
                <div class="achievement-progress-bar" style="width: 23%;"></div>
              </div>
              <p class="achievement-status">7/30 days</p>
            </div>

            <div class="achievement-card locked">
              <div class="achievement-icon">📸</div>
              <h4>Snap Master</h4>
              <p>Log 50 meals with photos</p>
              <div class="achievement-progress">
                <div class="achievement-progress-bar" style="width: 44%;"></div>
              </div>
              <p class="achievement-status">22/50 meals</p>
            </div>
          </div>
        </div>
      </section>
    `;

    profileSection.insertAdjacentHTML('afterend', analyticsHTML);
  }

  // ===================================
  // ADD ANALYTICS NAV BUTTON
  // ===================================
  function addAnalyticsNavigation() {
    const nav = document.querySelector('.sidebar-nav');
    const profileBtn = document.querySelector('[data-view="profile"]');
    
    if (nav && profileBtn) {
      const analyticsBtn = document.createElement('button');
      analyticsBtn.className = 'nav-item';
      analyticsBtn.dataset.view = 'analytics';
      analyticsBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        <span>Analytics</span>
      `;
      
      nav.insertBefore(analyticsBtn, profileBtn);
    }
  }

  // ===================================
  // REFRESH ANALYTICS
  // ===================================
  window.refreshAnalytics = function() {
    if (window.analyticsInstance) {
      window.analyticsInstance.calculateTrends();
      window.analyticsInstance.generateInsights();
      window.analyticsInstance.predictFutureTrends();
      renderAnalyticsView();
      
      // Trigger confetti on refresh
      if (window.advancedAnimations) {
        window.advancedAnimations.createConfetti();
      }
      
      window.showToast('Analytics refreshed with latest data!');
    }
  };

  // ===================================
  // RENDER ANALYTICS VIEW
  // ===================================
  window.renderAnalyticsView = function() {
    if (!window.analyticsInstance) {
      console.warn('Analytics not initialized yet');
      return;
    }

    // Render insights
    const insightsContainer = document.getElementById('insights-container');
    if (insightsContainer) {
      insightsContainer.innerHTML = window.analyticsInstance.insights.map(insight => `
        <div class="insight-card insight-${insight.type}" style="animation: fadeInScale 0.5s ease forwards;">
          <div class="insight-icon">${insight.icon}</div>
          <div class="insight-content">
            <h4 class="insight-title">${insight.title}</h4>
            <p class="insight-message">${insight.message}</p>
            <div class="insight-score">
              <div class="insight-score-bar" style="width: ${insight.score}%"></div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Render predictions
    const predictionsContainer = document.getElementById('predictions-container');
    if (predictionsContainer && window.analyticsInstance.predictions.length > 0) {
      predictionsContainer.innerHTML = window.analyticsInstance.predictions.map((pred, i) => `
        <div class="prediction-card" style="animation: fadeInScale 0.5s ease ${i * 0.1}s forwards; opacity: 0;">
          <div class="prediction-date">${new Date(pred.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          <div class="prediction-value">${pred.calories} <span>kcal</span></div>
          <div class="prediction-confidence">
            <div class="confidence-bar">
              <div class="confidence-fill" style="width: ${pred.confidence}%"></div>
            </div>
            <span>${pred.confidence}% confident</span>
          </div>
        </div>
      `).join('');
    } else if (predictionsContainer) {
      predictionsContainer.innerHTML = `
        <div class="empty-state">
          <p>Not enough data for predictions. Keep tracking meals!</p>
        </div>
      `;
    }

    // Render charts after DOM update
    setTimeout(() => {
      if (window.analyticsInstance) {
        window.analyticsInstance.renderCalorieTrendChart('calorie-trend-chart');
        window.analyticsInstance.renderMacroDonutChart('macro-donut-chart');
        window.analyticsInstance.renderWeeklyProgressChart('weekly-progress-chart');
      }
    }, 150);
  };

  // ===================================
  // ENHANCE SWITCH VIEW
  // ===================================
  function enhanceSwitchView() {
    const originalSwitchView = window.switchView;
    
    window.switchView = function(viewName) {
      // Call original function
      if (originalSwitchView) {
        originalSwitchView(viewName);
      }
      
      // Additional logic for analytics view
      if (viewName === 'analytics') {
        setTimeout(() => {
          window.renderAnalyticsView();
        }, 350); // Wait for transition
      }
    };
  }

  // ===================================
  // ENHANCE SAVE MEAL WITH EFFECTS
  // ===================================
  function enhanceSaveMeal() {
    const originalSaveMeal = window.saveMeal;
    
    window.saveMeal = function() {
      if (originalSaveMeal) {
        originalSaveMeal();
        
        // Trigger success effects
        setTimeout(() => {
          const button = document.querySelector('#save-meal-btn');
          if (button && window.advancedAnimations) {
            const rect = button.getBoundingClientRect();
            window.advancedAnimations.createParticleBurst(
              rect.left + rect.width / 2,
              rect.top + rect.height / 2,
              '#10b981',
              30
            );
            window.advancedAnimations.successPulse();
          }
        }, 100);
      }
    };
  }

  // ===================================
  // INITIALIZE ALL INTEGRATIONS
  // ===================================
  function initialize() {
    console.log('🚀 Initializing advanced integrations...');
    
    // Inject HTML - DISABLED: Analytics view already in HTML
    // injectAnalyticsView();
    // addAnalyticsNavigation();
    
    // Setup enhancements
    enhanceSwitchView();
    enhanceSaveMeal();
    
    // Initialize analytics after delay
    setTimeout(() => {
      if (typeof AdvancedAnalytics !== 'undefined') {
        window.analyticsInstance = new AdvancedAnalytics();
        console.log('✅ Analytics initialized');
      }
    }, 1000);
    
    console.log('✨ All advanced features integrated!');
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

})();