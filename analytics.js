// ===================================
// ADVANCED ANALYTICS MODULE
// Features: Charts, Trends, AI Insights, Predictions
// ===================================

class AdvancedAnalytics {
  constructor() {
    this.chartInstances = {};
    this.insights = [];
    this.predictions = [];
    this.trendData = {
      daily: [],
      weekly: [],
      monthly: []
    };
    this.initializeAnalytics();
  }

  initializeAnalytics() {
    this.calculateTrends();
    this.generateInsights();
    this.predictFutureTrends();
    this.setupAnalyticsView();
  }

  // Calculate trend data from meal history
  calculateTrends() {
    const meals = state.meals || [];
    const now = new Date();
    
    // Daily trends (last 30 days)
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      
      const dayMeals = meals.filter(m => m.date === dateStr);
      const totals = this.calculateDayTotals(dayMeals);
      
      this.trendData.daily.push({
        date: dateStr,
        timestamp: date.getTime(),
        ...totals
      });
    }

    // Weekly trends (last 12 weeks)
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);
      
      const weekMeals = meals.filter(m => {
        const mealDate = new Date(m.timestamp);
        return mealDate >= weekStart && mealDate < weekEnd;
      });
      
      const totals = this.calculateWeekTotals(weekMeals);
      
      this.trendData.weekly.push({
        week: `Week ${12 - i}`,
        timestamp: weekStart.getTime(),
        ...totals
      });
    }
  }

  calculateDayTotals(meals) {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fats: acc.fats + (meal.fats || 0),
      mealCount: acc.mealCount + 1
    }), { calories: 0, protein: 0, carbs: 0, fats: 0, mealCount: 0 });
  }

  calculateWeekTotals(meals) {
    const totals = this.calculateDayTotals(meals);
    return {
      avgCalories: totals.calories / 7,
      avgProtein: totals.protein / 7,
      avgCarbs: totals.carbs / 7,
      avgFats: totals.fats / 7,
      totalMeals: totals.mealCount
    };
  }

  // Generate AI-powered insights
  generateInsights() {
    this.insights = [];
    
    // Calorie consistency insight
    const dailyCalories = this.trendData.daily.map(d => d.calories);
    const avgCalories = dailyCalories.reduce((a, b) => a + b, 0) / dailyCalories.length;
    const variance = this.calculateVariance(dailyCalories, avgCalories);
    
    if (variance < 200) {
      this.insights.push({
        type: 'success',
        icon: '🎯',
        title: 'Excellent Consistency',
        message: 'Your daily calorie intake is very consistent. This helps maintain steady progress.',
        score: 95
      });
    } else if (variance < 400) {
      this.insights.push({
        type: 'warning',
        icon: '⚡',
        title: 'Moderate Variance',
        message: 'Your calorie intake varies moderately. Try to maintain more consistent eating patterns.',
        score: 70
      });
    } else {
      this.insights.push({
        type: 'alert',
        icon: '📊',
        title: 'High Variance Detected',
        message: 'Your daily calories fluctuate significantly. Consider meal planning for better consistency.',
        score: 45
      });
    }

    // Protein intake insight
    const recentDays = this.trendData.daily.slice(-7);
    const avgProtein = recentDays.reduce((a, b) => a + b.protein, 0) / 7;
    const plan = state.currentPlan || state.plans[0];
    
    if (avgProtein >= plan.protein * 0.9) {
      this.insights.push({
        type: 'success',
        icon: '💪',
        title: 'Protein Goals Met',
        message: `Averaging ${Math.round(avgProtein)}g protein daily. Great for muscle maintenance!`,
        score: 90
      });
    } else if (avgProtein >= plan.protein * 0.7) {
      this.insights.push({
        type: 'info',
        icon: '🥩',
        title: 'Protein Slightly Low',
        message: `Averaging ${Math.round(avgProtein)}g daily. Target is ${plan.protein}g. Add more lean proteins.`,
        score: 65
      });
    }

    // Meal timing insight
    const mealTimes = state.meals.slice(-21).map(m => new Date(m.timestamp).getHours());
    const lateMeals = mealTimes.filter(h => h >= 21).length;
    
    if (lateMeals > 7) {
      this.insights.push({
        type: 'warning',
        icon: '🌙',
        title: 'Late Night Eating',
        message: `${lateMeals} meals after 9 PM in the last 3 weeks. Earlier eating may improve sleep quality.`,
        score: 50
      });
    }

    // Macro balance insight
    const macroBalance = this.analyzeMacroBalance(recentDays);
    if (macroBalance.balanced) {
      this.insights.push({
        type: 'success',
        icon: '⚖️',
        title: 'Balanced Macros',
        message: 'Your protein, carbs, and fats are well-balanced for optimal nutrition.',
        score: 88
      });
    }

    // Hydration reminder (advanced feature)
    this.insights.push({
      type: 'info',
      icon: '💧',
      title: 'Stay Hydrated',
      message: 'Remember to drink 8-10 glasses of water daily for optimal metabolism.',
      score: 75
    });
  }

  analyzeMacroBalance(days) {
    const totals = days.reduce((acc, day) => ({
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats
    }), { protein: 0, carbs: 0, fats: 0 });

    const proteinCals = totals.protein * 4;
    const carbsCals = totals.carbs * 4;
    const fatsCals = totals.fats * 9;
    const totalCals = proteinCals + carbsCals + fatsCals;

    const proteinPercent = (proteinCals / totalCals) * 100;
    const carbsPercent = (carbsCals / totalCals) * 100;
    const fatsPercent = (fatsCals / totalCals) * 100;

    // Check if within healthy ranges
    const balanced = proteinPercent >= 15 && proteinPercent <= 35 &&
                    carbsPercent >= 45 && carbsPercent <= 65 &&
                    fatsPercent >= 20 && fatsPercent <= 35;

    return { balanced, proteinPercent, carbsPercent, fatsPercent };
  }

  calculateVariance(values, mean) {
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / values.length);
  }

  // Predict future trends using linear regression
  predictFutureTrends() {
    const recentData = this.trendData.daily.slice(-14);
    if (recentData.length < 7) return;

    const xValues = recentData.map((_, i) => i);
    const yValues = recentData.map(d => d.calories);

    const regression = this.linearRegression(xValues, yValues);
    
    // Predict next 7 days
    for (let i = 1; i <= 7; i++) {
      const predictedCalories = regression.slope * (recentData.length + i) + regression.intercept;
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      this.predictions.push({
        date: futureDate.toLocaleDateString(),
        calories: Math.max(0, Math.round(predictedCalories)),
        confidence: Math.max(60, 95 - (i * 5)) // Confidence decreases over time
      });
    }
  }

  linearRegression(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
  }

  // Setup analytics view in UI
  setupAnalyticsView() {
    // This will be called when analytics view is shown
    console.log('Analytics module initialized with', this.insights.length, 'insights');
  }

  // Render calorie trend chart (using canvas)
  renderCalorieTrendChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.trendData.daily.slice(-14);
    
    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find min/max for scaling
    const values = data.map(d => d.calories);
    const maxValue = Math.max(...values, state.currentPlan?.calories || 2000);
    const minValue = Math.min(...values, 0);

    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--border-color') || '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw target line
    if (state.currentPlan) {
      const targetY = padding + chartHeight - ((state.currentPlan.calories - minValue) / (maxValue - minValue)) * chartHeight;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, targetY);
      ctx.lineTo(width - padding, targetY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw area fill
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    
    data.forEach((point, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((point.calories - minValue) / (maxValue - minValue)) * chartHeight;
      
      if (i === 0) {
        ctx.lineTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fill();

    // Draw line
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((point, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((point.calories - minValue) / (maxValue - minValue)) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();

    // Draw points
    data.forEach((point, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = padding + chartHeight - ((point.calories - minValue) / (maxValue - minValue)) * chartHeight;
      
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw labels
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#6b7280';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    
    data.forEach((point, i) => {
      if (i % 2 === 0 || data.length <= 7) {
        const x = padding + (chartWidth / (data.length - 1)) * i;
        const date = new Date(point.date);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        ctx.fillText(label, x, height - padding + 20);
      }
    });
  }

  // Render macro distribution donut chart
  renderMacroDonutChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Calculate recent macro totals
    const recentDays = this.trendData.daily.slice(-7);
    const totals = recentDays.reduce((acc, day) => ({
      protein: acc.protein + day.protein,
      carbs: acc.carbs + day.carbs,
      fats: acc.fats + day.fats
    }), { protein: 0, carbs: 0, fats: 0 });

    const total = totals.protein + totals.carbs + totals.fats;
    if (total === 0) return;

    const data = [
      { label: 'Protein', value: totals.protein, color: '#3b82f6' },
      { label: 'Carbs', value: totals.carbs, color: '#10b981' },
      { label: 'Fats', value: totals.fats, color: '#f59e0b' }
    ];

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const innerRadius = radius * 0.6;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    let currentAngle = -Math.PI / 2;

    data.forEach((segment) => {
      const sliceAngle = (segment.value / total) * Math.PI * 2;
      
      // Draw segment
      ctx.fillStyle = segment.color;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.arc(centerX, centerY, innerRadius, currentAngle + sliceAngle, currentAngle, true);
      ctx.closePath();
      ctx.fill();

      // Draw label
      const midAngle = currentAngle + sliceAngle / 2;
      const labelRadius = radius + 30;
      const labelX = centerX + Math.cos(midAngle) * labelRadius;
      const labelY = centerY + Math.sin(midAngle) * labelRadius;
      
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary') || '#111827';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round((segment.value / total) * 100)}%`, labelX, labelY);
      
      ctx.font = '11px Inter, sans-serif';
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#6b7280';
      ctx.fillText(segment.label, labelX, labelY + 15);

      currentAngle += sliceAngle;
    });

    // Draw center circle
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-primary') || '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw center text
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary') || '#111827';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Macros', centerX, centerY - 8);
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#6b7280';
    ctx.fillText('Last 7 Days', centerX, centerY + 8);
  }

  // Render weekly progress chart
  renderWeeklyProgressChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = this.trendData.weekly.slice(-8);
    
    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length * 0.7;
    const barSpacing = chartWidth / data.length;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value
    const maxValue = Math.max(...data.map(d => d.avgCalories), state.currentPlan?.calories || 2000);

    // Draw bars
    data.forEach((week, i) => {
      const barHeight = (week.avgCalories / maxValue) * chartHeight;
      const x = padding + barSpacing * i + (barSpacing - barWidth) / 2;
      const y = padding + chartHeight - barHeight;

      // Create gradient for bar
      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#8b5cf6');
      gradient.addColorStop(1, '#6366f1');

      // Draw bar
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [8, 8, 0, 0]);
      ctx.fill();

      // Draw value
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary') || '#6b7280';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(Math.round(week.avgCalories), x + barWidth / 2, y - 8);

      // Draw label
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText(`W${i + 1}`, x + barWidth / 2, height - padding + 20);
    });

    // Add roundRect method if not available
    if (!ctx.roundRect) {
      ctx.roundRect = function(x, y, width, height, radii) {
        this.beginPath();
        this.moveTo(x + radii[0], y);
        this.lineTo(x + width - radii[1], y);
        this.quadraticCurveTo(x + width, y, x + width, y + radii[1]);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.lineTo(x, y + radii[0]);
        this.quadraticCurveTo(x, y, x + radii[0], y);
      };
    }
  }
}

// Export for global access
window.AdvancedAnalytics = AdvancedAnalytics;
window.analyticsInstance = null;

console.log('📊 Advanced Analytics Module Loaded');