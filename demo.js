// ===================================
// DEMO SCENARIOS & USAGE EXAMPLES
// Copy these into browser console to test features
// ===================================

// ===================================
// 1. POPULATE WITH DEMO DATA
// ===================================

function loadDemoData() {
  console.log('🎬 Loading demo data...');
  
  // Clear existing data
  state.meals = [];
  
  // Add meals for the past 14 days
  const mealTemplates = [
    { name: 'Breakfast Oatmeal', calories: 320, protein: 12, carbs: 45, fats: 8 },
    { name: 'Chicken Salad', calories: 450, protein: 38, carbs: 32, fats: 18 },
    { name: 'Salmon with Rice', calories: 580, protein: 42, carbs: 58, fats: 16 },
    { name: 'Greek Yogurt Bowl', calories: 280, protein: 24, carbs: 28, fats: 8 },
    { name: 'Turkey Sandwich', calories: 420, protein: 32, carbs: 46, fats: 12 },
    { name: 'Protein Smoothie', calories: 340, protein: 28, carbs: 38, fats: 8 },
    { name: 'Grilled Steak', calories: 520, protein: 48, carbs: 12, fats: 28 },
    { name: 'Veggie Stir Fry', calories: 380, protein: 18, carbs: 48, fats: 14 }
  ];
  
  // Generate meals for past 14 days
  for (let daysAgo = 13; daysAgo >= 0; daysAgo--) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // 2-4 meals per day
    const mealsPerDay = 2 + Math.floor(Math.random() * 3);
    
    for (let meal = 0; meal < mealsPerDay; meal++) {
      const template = mealTemplates[Math.floor(Math.random() * mealTemplates.length)];
      const variance = 0.8 + Math.random() * 0.4; // ±20% variance
      
      state.meals.push({
        id: Date.now() + Math.random(),
        name: template.name,
        calories: Math.round(template.calories * variance),
        protein: Math.round(template.protein * variance),
        carbs: Math.round(template.carbs * variance),
        fats: Math.round(template.fats * variance),
        portion: 1,
        timestamp: date.toISOString(),
        date: date.toLocaleDateString(),
        notes: 'Demo meal'
      });
    }
  }
  
  // Update UI
  saveToLocalStorage();
  updateDashboard();
  renderRecentMeals();
  renderHistory();
  
  console.log('✅ Demo data loaded!', state.meals.length, 'meals added');
  showToast(`${state.meals.length} demo meals loaded!`);
}

// ===================================
// 2. TRIGGER ADVANCED ANIMATIONS
// ===================================

function demoParticleEffects() {
  console.log('✨ Demonstrating particle effects...');
  
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
  
  // Create bursts at random positions
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      window.advancedAnimations.createParticleBurst(x, y, color, 25);
    }, i * 500);
  }
  
  console.log('💥 Particle effects triggered!');
}

function demoConfetti() {
  console.log('🎉 Creating confetti celebration...');
  window.advancedAnimations.createConfetti();
  showToast('🎊 Celebration time!');
}

function demoSuccessAnimation() {
  console.log('✅ Success animation demo...');
  window.advancedAnimations.successPulse();
  
  const button = document.querySelector('.btn-primary');
  if (button) {
    const rect = button.getBoundingClientRect();
    window.advancedAnimations.createParticleBurst(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      '#10b981',
      30
    );
  }
}

// ===================================
// 3. ANALYTICS DEMONSTRATIONS
// ===================================

function demoAnalytics() {
  console.log('📊 Demonstrating analytics...');
  
  // Switch to analytics view
  switchView('analytics');
  
  setTimeout(() => {
    if (window.analyticsInstance) {
      window.analyticsInstance.calculateTrends();
      window.analyticsInstance.generateInsights();
      window.analyticsInstance.predictFutureTrends();
      renderAnalyticsView();
      showToast('Analytics updated!');
    }
  }, 500);
}

function printInsights() {
  if (window.analyticsInstance) {
    console.log('🧠 AI-Generated Insights:');
    console.table(window.analyticsInstance.insights);
  }
}

function printPredictions() {
  if (window.analyticsInstance) {
    console.log('🔮 7-Day Predictions:');
    console.table(window.analyticsInstance.predictions);
  }
}

// ===================================
// 4. INTERACTIVE DEMOS
// ===================================

function cycleViews() {
  console.log('🔄 Cycling through all views...');
  const views = ['dashboard', 'camera', 'history', 'plans', 'analytics', 'profile'];
  let index = 0;
  
  const interval = setInterval(() => {
    switchView(views[index]);
    index++;
    if (index >= views.length) {
      clearInterval(interval);
      console.log('✅ View cycle complete!');
      switchView('dashboard');
    }
  }, 2000);
}

function demoAllAnimations() {
  console.log('🎬 Running full animation showcase...');
  
  // Particles
  setTimeout(() => {
    demoParticleEffects();
  }, 500);
  
  // Confetti
  setTimeout(() => {
    demoConfetti();
  }, 3000);
  
  // Success pulse
  setTimeout(() => {
    demoSuccessAnimation();
  }, 5000);
  
  // View transitions
  setTimeout(() => {
    cycleViews();
  }, 7000);
}

// ===================================
// 5. STRESS TESTING
// ===================================

function stressTestParticles() {
  console.log('⚡ Stress testing particle system...');
  
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      window.advancedAnimations.createParticleBurst(
        window.innerWidth / 2,
        window.innerHeight / 2,
        '#6366f1',
        100
      );
    }, i * 100);
  }
  
  console.log('💥 Particle stress test complete!');
}

function stressTestCharts() {
  console.log('📊 Stress testing chart rendering...');
  
  switchView('analytics');
  
  setTimeout(() => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        if (window.analyticsInstance) {
          window.analyticsInstance.renderCalorieTrendChart('calorie-trend-chart');
          window.analyticsInstance.renderMacroDonutChart('macro-donut-chart');
          window.analyticsInstance.renderWeeklyProgressChart('weekly-progress-chart');
        }
      }, i * 200);
    }
  }, 500);
  
  console.log('✅ Chart stress test complete!');
}

// ===================================
// 6. ACHIEVEMENT UNLOCKING DEMO
// ===================================

function unlockAchievement(name) {
  console.log(`🏆 Unlocking achievement: ${name}`);
  
  // Find achievement card
  const cards = document.querySelectorAll('.achievement-card');
  cards.forEach(card => {
    if (card.textContent.includes(name)) {
      card.classList.remove('locked');
      card.classList.add('unlocked');
      
      // Trigger celebration
      const rect = card.getBoundingClientRect();
      window.advancedAnimations.createParticleBurst(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        '#10b981',
        40
      );
    }
  });
  
  showToast(`🎉 Achievement Unlocked: ${name}!`);
}

function unlockAllAchievements() {
  console.log('🏆 Unlocking all achievements...');
  
  const achievements = ['7-Day Streak', 'Protein Pro', 'Snap Master'];
  achievements.forEach((name, i) => {
    setTimeout(() => {
      unlockAchievement(name);
    }, i * 1000);
  });
}

// ===================================
// 7. THEME SWITCHING DEMO
// ===================================

function demoThemeSwitch() {
  console.log('🌓 Demonstrating theme switching...');
  
  let isDark = document.body.classList.contains('dark-theme');
  
  const interval = setInterval(() => {
    document.getElementById('theme-switch').click();
    isDark = !isDark;
  }, 2000);
  
  setTimeout(() => {
    clearInterval(interval);
    console.log('✅ Theme demo complete!');
  }, 10000);
}

// ===================================
// 8. COMPREHENSIVE DEMO
// ===================================

function runComprehensiveDemo() {
  console.log('🎬 Starting comprehensive demo...');
  console.log('This will take about 30 seconds...');
  
  const schedule = [
    { time: 0, action: () => {
      console.log('📝 Step 1: Loading demo data...');
      loadDemoData();
    }},
    { time: 2000, action: () => {
      console.log('✨ Step 2: Particle effects...');
      demoParticleEffects();
    }},
    { time: 5000, action: () => {
      console.log('📊 Step 3: Analytics...');
      demoAnalytics();
    }},
    { time: 8000, action: () => {
      console.log('🎉 Step 4: Confetti...');
      demoConfetti();
    }},
    { time: 11000, action: () => {
      console.log('🔄 Step 5: View cycling...');
      cycleViews();
    }},
    { time: 24000, action: () => {
      console.log('🏆 Step 6: Unlocking achievements...');
      unlockAllAchievements();
    }},
    { time: 29000, action: () => {
      console.log('✅ Demo complete!');
      console.log('💡 Try these commands:');
      console.log('  - demoParticleEffects()');
      console.log('  - demoConfetti()');
      console.log('  - demoAnalytics()');
      console.log('  - cycleViews()');
      console.log('  - loadDemoData()');
      switchView('dashboard');
    }}
  ];
  
  schedule.forEach(item => {
    setTimeout(item.action, item.time);
  });
}

// ===================================
// 9. PERFORMANCE TESTING
// ===================================

function measurePerformance() {
  console.log('⚡ Measuring performance...');
  
  performance.mark('start');
  
  // Test view switching
  const views = ['dashboard', 'camera', 'history', 'plans', 'analytics'];
  views.forEach(view => switchView(view));
  
  performance.mark('views-complete');
  performance.measure('view-switching', 'start', 'views-complete');
  
  // Test chart rendering
  if (window.analyticsInstance) {
    performance.mark('charts-start');
    window.analyticsInstance.renderCalorieTrendChart('calorie-trend-chart');
    window.analyticsInstance.renderMacroDonutChart('macro-donut-chart');
    window.analyticsInstance.renderWeeklyProgressChart('weekly-progress-chart');
    performance.mark('charts-complete');
    performance.measure('chart-rendering', 'charts-start', 'charts-complete');
  }
  
  // Print results
  const measures = performance.getEntriesByType('measure');
  console.table(measures.map(m => ({
    name: m.name,
    duration: `${m.duration.toFixed(2)}ms`
  })));
}

// ===================================
// 10. HELPER FUNCTIONS
// ===================================

function clearAllData() {
  if (confirm('Clear all data? This cannot be undone.')) {
    state.meals = [];
    saveToLocalStorage();
    updateDashboard();
    renderRecentMeals();
    renderHistory();
    console.log('🗑️ All data cleared!');
    showToast('All data cleared');
  }
}

function exportData() {
  const data = {
    meals: state.meals,
    plans: state.plans,
    user: state.user,
    exportDate: new Date().toISOString()
  };
  
  const json = JSON.stringify(data, null, 2);
  console.log('📦 Exported data:');
  console.log(json);
  
  // Create download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `calocount-export-${Date.now()}.json`;
  a.click();
  
  showToast('Data exported!');
}

function showStats() {
  console.log('📊 App Statistics:');
  console.log('==================');
  console.log(`Total Meals: ${state.meals.length}`);
  console.log(`Total Plans: ${state.plans.length}`);
  console.log(`Active Plan: ${state.currentPlan?.name || 'None'}`);
  
  if (state.meals.length > 0) {
    const totalCalories = state.meals.reduce((sum, m) => sum + m.calories, 0);
    const avgCalories = totalCalories / state.meals.length;
    console.log(`Average Calories per Meal: ${avgCalories.toFixed(0)}`);
  }
  
  if (window.analyticsInstance) {
    console.log(`AI Insights: ${window.analyticsInstance.insights.length}`);
    console.log(`Predictions: ${window.analyticsInstance.predictions.length}`);
  }
  
  console.log('==================');
}

// ===================================
// EXPORT TO WINDOW
// ===================================

window.demo = {
  loadData: loadDemoData,
  particles: demoParticleEffects,
  confetti: demoConfetti,
  success: demoSuccessAnimation,
  analytics: demoAnalytics,
  cycleViews: cycleViews,
  allAnimations: demoAllAnimations,
  comprehensive: runComprehensiveDemo,
  unlockAchievement: unlockAchievement,
  unlockAll: unlockAllAchievements,
  themeSwitch: demoThemeSwitch,
  performance: measurePerformance,
  stats: showStats,
  export: exportData,
  clear: clearAllData,
  insights: printInsights,
  predictions: printPredictions,
  stressParticles: stressTestParticles,
  stressCharts: stressTestCharts
};

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================

console.log('%c🎯 CaloCount Pro - Demo Console', 'font-size: 20px; font-weight: bold; color: #6366f1;');
console.log('%cTry these commands:', 'font-size: 14px; color: #8b5cf6;');
console.log('');
console.log('🎬 Full Demo:');
console.log('  demo.comprehensive()        - Run full 30-second demo');
console.log('');
console.log('✨ Animations:');
console.log('  demo.particles()            - Particle burst effects');
console.log('  demo.confetti()             - Confetti celebration');
console.log('  demo.success()              - Success animation');
console.log('  demo.allAnimations()        - All animation types');
console.log('');
console.log('📊 Analytics:');
console.log('  demo.analytics()            - Show analytics dashboard');
console.log('  demo.insights()             - Print AI insights');
console.log('  demo.predictions()          - Print predictions');
console.log('');
console.log('🎮 Interactive:');
console.log('  demo.cycleViews()           - Cycle through all views');
console.log('  demo.themeSwitch()          - Demonstrate theme switching');
console.log('  demo.unlockAll()            - Unlock all achievements');
console.log('');
console.log('📦 Data:');
console.log('  demo.loadData()             - Load 14 days of demo data');
console.log('  demo.stats()                - Show app statistics');
console.log('  demo.export()               - Export data as JSON');
console.log('  demo.clear()                - Clear all data');
console.log('');
console.log('⚡ Performance:');
console.log('  demo.performance()          - Measure performance');
console.log('  demo.stressParticles()      - Stress test particles');
console.log('  demo.stressCharts()         - Stress test charts');
console.log('');
console.log('%c💡 Start with: demo.comprehensive()', 'font-size: 16px; font-weight: bold; color: #10b981;');

// Auto-load demo data if no meals exist
if (state.meals.length === 0) {
  console.log('%c📝 No data found. Loading demo data...', 'color: #f59e0b;');
  setTimeout(() => {
    loadDemoData();
  }, 2000);
}