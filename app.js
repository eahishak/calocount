// ===================================
// STATE MANAGEMENT
// ===================================
const state = {
  currentView: 'dashboard',
  meals: [],
  plans: [
    {
      id: 'default',
      name: 'Balanced Diet',
      calories: 2000,
      protein: 150,
      carbs: 200,
      fats: 65,
      active: true
    }
  ],
  currentPlan: null,
  user: {
    name: 'Alex Johnson',
    email: 'alex@example.com',
    age: null,
    weight: null,
    goal: 'maintain'
  },
  theme: 'light',
  cameraStream: null,
  currentFacingMode: 'environment', // 'user' for front camera, 'environment' for back
  currentImage: null
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Load saved data
  loadFromLocalStorage();
  
  // Set up event listeners
  setupNavigation();
  setupThemeToggle();
  setupCameraControls();
  setupMealForm();
  setupPlanForm();
  setupProfileForm();
  setupHistoryFilter();
  
  // Initial render
  updateDashboard();
  renderRecentMeals();
  renderHistory();
  renderPlans();
  
  // Set active plan
  if (state.plans.length > 0 && !state.currentPlan) {
    state.currentPlan = state.plans.find(p => p.active) || state.plans[0];
  }
  
  console.log('CaloCount Pro initialized successfully!');
}

// ===================================
// NAVIGATION
// ===================================
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      switchView(view);
      
      // Update active state
      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
}

function switchView(viewName) {
  // Hide all views
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Show selected view
  const targetView = document.getElementById(`${viewName}-view`);
  if (targetView) {
    targetView.classList.add('active');
    state.currentView = viewName;
    
    // Stop camera if leaving camera view
    if (viewName !== 'camera' && state.cameraStream) {
      stopCamera();
    }
  }
}

// ===================================
// THEME TOGGLE
// ===================================
function setupThemeToggle() {
  const themeSwitch = document.getElementById('theme-switch');
  
  // Set initial theme
  if (state.theme === 'dark') {
    document.body.classList.add('dark-theme');
    themeSwitch.checked = true;
  }
  
  themeSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      document.body.classList.add('dark-theme');
      state.theme = 'dark';
    } else {
      document.body.classList.remove('dark-theme');
      state.theme = 'light';
    }
    saveToLocalStorage();
  });
}

// ===================================
// CAMERA FUNCTIONALITY
// ===================================
function setupCameraControls() {
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  const cameraBtn = document.getElementById('camera-btn');
  const captureBtn = document.getElementById('capture-btn');
  const switchCameraBtn = document.getElementById('switch-camera-btn');
  const closeCameraBtn = document.getElementById('close-camera-btn');
  const retakeBtn = document.getElementById('retake-btn');
  const analyzeBtn = document.getElementById('analyze-btn');
  
  // Upload photo
  uploadBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        showPreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Open camera
  cameraBtn.addEventListener('click', async () => {
    await startCamera();
  });
  
  // Capture photo
  captureBtn.addEventListener('click', () => {
    capturePhoto();
  });
  
  // Switch camera (front/back)
  switchCameraBtn.addEventListener('click', async () => {
    state.currentFacingMode = state.currentFacingMode === 'user' ? 'environment' : 'user';
    await startCamera();
  });
  
  // Close camera
  closeCameraBtn.addEventListener('click', () => {
    stopCamera();
  });
  
  // Retake photo
  retakeBtn.addEventListener('click', () => {
    hidePreview();
    startCamera();
  });
  
  // Analyze photo
  analyzeBtn.addEventListener('click', async () => {
    await analyzeMeal();
  });
}

async function startCamera() {
  try {
    // Stop existing stream
    if (state.cameraStream) {
      stopCamera();
    }
    
    const constraints = {
      video: {
        facingMode: state.currentFacingMode,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      },
      audio: false
    };
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    state.cameraStream = stream;
    
    const videoStream = document.getElementById('video-stream');
    videoStream.srcObject = stream;
    
    // Show video container
    document.getElementById('video-container').classList.remove('hidden');
    document.getElementById('preview-container').classList.add('hidden');
    
  } catch (error) {
    console.error('Camera error:', error);
    showToast('Camera access denied or unavailable. Please use the upload option.');
  }
}

function stopCamera() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(track => track.stop());
    state.cameraStream = null;
  }
  document.getElementById('video-container').classList.add('hidden');
}

function capturePhoto() {
  const video = document.getElementById('video-stream');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  
  // Set canvas size to video size
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  // Draw video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
  // Get image data
  const imageData = canvas.toDataURL('image/jpeg', 0.9);
  
  // Stop camera and show preview
  stopCamera();
  showPreview(imageData);
}

function showPreview(imageData) {
  state.currentImage = imageData;
  const previewImage = document.getElementById('preview-image');
  previewImage.src = imageData;
  
  document.getElementById('preview-container').classList.remove('hidden');
  document.getElementById('video-container').classList.add('hidden');
}

function hidePreview() {
  document.getElementById('preview-container').classList.add('hidden');
  state.currentImage = null;
}

// ===================================
// AI MEAL ANALYSIS (SIMULATED)
// ===================================
async function analyzeMeal() {
  if (!state.currentImage) {
    showToast('Please capture or upload a photo first');
    return;
  }
  
  showLoading('Analyzing your meal with AI...');
  
  try {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulated AI response
    const analysis = simulateAIAnalysis();
    
    hideLoading();
    
    // Populate form with results
    document.getElementById('meal-name').value = analysis.name;
    document.getElementById('meal-calories').value = analysis.calories;
    document.getElementById('meal-protein').value = analysis.protein;
    document.getElementById('meal-carbs').value = analysis.carbs;
    document.getElementById('meal-fats').value = analysis.fats;
    
    // Show results section
    document.getElementById('analysis-results').classList.remove('hidden');
    
    showToast('Meal analyzed successfully!');
    
  } catch (error) {
    hideLoading();
    showToast('Analysis failed. Please try again.');
    console.error('Analysis error:', error);
  }
}

function simulateAIAnalysis() {
  // Simulated meal database
  const meals = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 20, fats: 15 },
    { name: 'Salmon with Rice', calories: 520, protein: 40, carbs: 55, fats: 18 },
    { name: 'Vegetable Stir Fry', calories: 280, protein: 12, carbs: 40, fats: 8 },
    { name: 'Turkey Sandwich', calories: 420, protein: 30, carbs: 45, fats: 12 },
    { name: 'Greek Yogurt Bowl', calories: 250, protein: 20, carbs: 30, fats: 6 },
    { name: 'Pasta with Meatballs', calories: 650, protein: 35, carbs: 75, fats: 22 },
    { name: 'Chicken Burrito Bowl', calories: 580, protein: 42, carbs: 60, fats: 18 },
    { name: 'Protein Smoothie', calories: 320, protein: 28, carbs: 35, fats: 8 },
    { name: 'Egg White Omelette', calories: 220, protein: 25, carbs: 8, fats: 10 },
    { name: 'Quinoa Buddha Bowl', calories: 450, protein: 18, carbs: 55, fats: 16 }
  ];
  
  // Return random meal for simulation
  return meals[Math.floor(Math.random() * meals.length)];
}

// ===================================
// MEAL FORM HANDLING
// ===================================
function setupMealForm() {
  const saveMealBtn = document.getElementById('save-meal-btn');
  const portionBtns = document.querySelectorAll('.portion-btn');
  
  // Portion size selection
  portionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      portionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  
  // Save meal
  saveMealBtn.addEventListener('click', () => {
    saveMeal();
  });
}

function saveMeal() {
  const name = document.getElementById('meal-name').value.trim();
  const calories = parseFloat(document.getElementById('meal-calories').value) || 0;
  const protein = parseFloat(document.getElementById('meal-protein').value) || 0;
  const carbs = parseFloat(document.getElementById('meal-carbs').value) || 0;
  const fats = parseFloat(document.getElementById('meal-fats').value) || 0;
  const notes = document.getElementById('meal-notes').value.trim();
  
  // Get active portion multiplier
  const activePortion = document.querySelector('.portion-btn.active');
  const portionMultiplier = parseFloat(activePortion.dataset.portion) || 1;
  
  if (!name || calories <= 0) {
    showToast('Please provide meal name and calories');
    return;
  }
  
  const meal = {
    id: Date.now(),
    name,
    calories: calories * portionMultiplier,
    protein: protein * portionMultiplier,
    carbs: carbs * portionMultiplier,
    fats: fats * portionMultiplier,
    notes,
    portion: portionMultiplier,
    image: state.currentImage,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString()
  };
  
  state.meals.unshift(meal);
  saveToLocalStorage();
  
  // Reset form and switch to dashboard
  resetMealForm();
  updateDashboard();
  renderRecentMeals();
  renderHistory();
  switchView('dashboard');
  
  showToast('Meal saved successfully!');
}

function resetMealForm() {
  document.getElementById('meal-name').value = '';
  document.getElementById('meal-calories').value = '';
  document.getElementById('meal-protein').value = '';
  document.getElementById('meal-carbs').value = '';
  document.getElementById('meal-fats').value = '';
  document.getElementById('meal-notes').value = '';
  document.getElementById('analysis-results').classList.add('hidden');
  hidePreview();
  
  // Reset portion to regular
  document.querySelectorAll('.portion-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.portion === '1') {
      btn.classList.add('active');
    }
  });
}

// ===================================
// DASHBOARD UPDATES
// ===================================
function updateDashboard() {
  const today = new Date().toLocaleDateString();
  const todayMeals = state.meals.filter(meal => meal.date === today);
  
  // Calculate totals
  const totals = todayMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fats: acc.fats + meal.fats
  }), { calories: 0, protein: 0, carbs: 0, fats: 0 });
  
  // Get current plan targets
  const plan = state.currentPlan || state.plans[0];
  
  // Update stat cards
  updateStatCard('calories', totals.calories, plan.calories);
  updateStatCard('protein', totals.protein, plan.protein);
  updateStatCard('carbs', totals.carbs, plan.carbs);
  updateStatCard('fats', totals.fats, plan.fats);
}

function updateStatCard(nutrient, consumed, target) {
  const consumedEl = document.getElementById(`${nutrient}-consumed`);
  const targetEl = document.getElementById(`${nutrient}-target`);
  const progressEl = document.getElementById(`${nutrient}-progress`);
  const remainingEl = document.getElementById(`${nutrient}-remaining`);
  
  if (consumedEl) consumedEl.textContent = Math.round(consumed);
  if (targetEl) targetEl.textContent = Math.round(target);
  
  const percentage = Math.min((consumed / target) * 100, 100);
  if (progressEl) progressEl.style.width = `${percentage}%`;
  
  const remaining = target - consumed;
  if (remainingEl) {
    if (remaining > 0) {
      remainingEl.textContent = `${Math.round(remaining)}${nutrient === 'calories' ? ' kcal' : 'g'} remaining`;
    } else {
      remainingEl.textContent = `${Math.round(Math.abs(remaining))}${nutrient === 'calories' ? ' kcal' : 'g'} over target`;
    }
  }
}

function renderRecentMeals() {
  const container = document.getElementById('recent-meals');
  const today = new Date().toLocaleDateString();
  const todayMeals = state.meals.filter(meal => meal.date === today);
  
  if (todayMeals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
          <path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
        <p>No meals tracked yet today</p>
        <button class="btn-primary" onclick="switchView('camera')" style="margin-top: 1rem;">Scan Your First Meal</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = todayMeals.slice(0, 6).map(meal => `
    <div class="meal-card">
      <div class="meal-header">
        <div>
          <h4 class="meal-name">${meal.name}</h4>
          <p class="meal-time">${new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <button class="btn-icon" onclick="deleteMeal(${meal.id})">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
        </button>
      </div>
      <div class="meal-macros">
        <div class="meal-macro">
          <span class="macro-label">Calories</span>
          <span class="macro-value">${Math.round(meal.calories)}</span>
        </div>
        <div class="meal-macro">
          <span class="macro-label">Protein</span>
          <span class="macro-value">${Math.round(meal.protein)}g</span>
        </div>
        <div class="meal-macro">
          <span class="macro-label">Carbs</span>
          <span class="macro-value">${Math.round(meal.carbs)}g</span>
        </div>
        <div class="meal-macro">
          <span class="macro-label">Fats</span>
          <span class="macro-value">${Math.round(meal.fats)}g</span>
        </div>
      </div>
    </div>
  `).join('');
}

function deleteMeal(mealId) {
  if (confirm('Delete this meal?')) {
    state.meals = state.meals.filter(meal => meal.id !== mealId);
    saveToLocalStorage();
    updateDashboard();
    renderRecentMeals();
    renderHistory();
    showToast('Meal deleted');
  }
}

function clearTodayMeals() {
  if (confirm('Clear all meals from today?')) {
    const today = new Date().toLocaleDateString();
    state.meals = state.meals.filter(meal => meal.date !== today);
    saveToLocalStorage();
    updateDashboard();
    renderRecentMeals();
    renderHistory();
    showToast('Today\'s meals cleared');
  }
}

// ===================================
// HISTORY
// ===================================
function setupHistoryFilter() {
  const filterSelect = document.getElementById('history-filter');
  filterSelect.addEventListener('change', () => {
    renderHistory();
  });
}

function renderHistory() {
  const container = document.getElementById('history-list');
  const filter = document.getElementById('history-filter').value;
  
  let filteredMeals = [...state.meals];
  const now = new Date();
  
  if (filter === 'today') {
    const today = now.toLocaleDateString();
    filteredMeals = filteredMeals.filter(meal => meal.date === today);
  } else if (filter === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    filteredMeals = filteredMeals.filter(meal => new Date(meal.timestamp) >= weekAgo);
  } else if (filter === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    filteredMeals = filteredMeals.filter(meal => new Date(meal.timestamp) >= monthAgo);
  }
  
  if (filteredMeals.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
          <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
        </svg>
        <p>No meals found for this period</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = filteredMeals.map(meal => `
    <div class="history-item">
      <div class="history-info">
        <h4>${meal.name}</h4>
        <p class="history-meta">
          ${new Date(meal.timestamp).toLocaleDateString()} • 
          ${new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <div class="history-stats">
        <div class="history-stat">
          <span class="history-stat-value">${Math.round(meal.calories)}</span>
          <span class="history-stat-label">kcal</span>
        </div>
        <div class="history-stat">
          <span class="history-stat-value">${Math.round(meal.protein)}g</span>
          <span class="history-stat-label">protein</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ===================================
// PLANS MANAGEMENT
// ===================================
function setupPlanForm() {
  const planForm = document.getElementById('plan-form');
  planForm.addEventListener('submit', (e) => {
    e.preventDefault();
    createPlan();
  });
}

function createPlan() {
  const name = document.getElementById('plan-name').value.trim();
  const calories = parseFloat(document.getElementById('plan-calories').value) || 0;
  const protein = parseFloat(document.getElementById('plan-protein').value) || 0;
  const carbs = parseFloat(document.getElementById('plan-carbs').value) || 0;
  const fats = parseFloat(document.getElementById('plan-fats').value) || 0;
  
  if (!name || calories <= 0) {
    showToast('Please provide plan name and calorie target');
    return;
  }
  
  const plan = {
    id: Date.now().toString(),
    name,
    calories,
    protein,
    carbs,
    fats,
    active: false
  };
  
  state.plans.push(plan);
  saveToLocalStorage();
  renderPlans();
  hideCreatePlan();
  showToast('Plan created successfully!');
}

function renderPlans() {
  const container = document.getElementById('plans-list');
  
  if (state.plans.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <svg width="64" height="64" viewBox="0 0 20 20" fill="currentColor" opacity="0.3">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
        <p>No nutrition plans yet</p>
        <button class="btn-primary" onclick="showCreatePlan()" style="margin-top: 1rem;">Create Your First Plan</button>
      </div>
    `;
    return;
  }
  
  container.innerHTML = state.plans.map(plan => `
    <div class="plan-card ${plan.active ? 'active' : ''}" onclick="selectPlan('${plan.id}')">
      <div class="plan-header">
        <div>
          <h3 class="plan-name">${plan.name}</h3>
          ${plan.active ? '<span class="plan-badge">Active</span>' : ''}
        </div>
        <button class="btn-icon" onclick="deletePlan(event, '${plan.id}')">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
        </button>
      </div>
      <div class="plan-goals">
        <div class="plan-goal">
          <span class="plan-goal-label">Calories</span>
          <span class="plan-goal-value">${Math.round(plan.calories)}</span>
        </div>
        <div class="plan-goal">
          <span class="plan-goal-label">Protein</span>
          <span class="plan-goal-value">${Math.round(plan.protein)}g</span>
        </div>
        <div class="plan-goal">
          <span class="plan-goal-label">Carbs</span>
          <span class="plan-goal-value">${Math.round(plan.carbs)}g</span>
        </div>
        <div class="plan-goal">
          <span class="plan-goal-label">Fats</span>
          <span class="plan-goal-value">${Math.round(plan.fats)}g</span>
        </div>
      </div>
    </div>
  `).join('');
}

function selectPlan(planId) {
  // Set all plans to inactive
  state.plans.forEach(plan => plan.active = false);
  
  // Activate selected plan
  const selectedPlan = state.plans.find(p => p.id === planId);
  if (selectedPlan) {
    selectedPlan.active = true;
    state.currentPlan = selectedPlan;
  }
  
  saveToLocalStorage();
  renderPlans();
  updateDashboard();
  showToast('Plan activated!');
}

function deletePlan(event, planId) {
  event.stopPropagation();
  
  if (confirm('Delete this plan?')) {
    state.plans = state.plans.filter(plan => plan.id !== planId);
    
    // Set new active plan if deleted plan was active
    if (state.currentPlan?.id === planId) {
      state.currentPlan = state.plans[0] || null;
      if (state.currentPlan) {
        state.currentPlan.active = true;
      }
    }
    
    saveToLocalStorage();
    renderPlans();
    updateDashboard();
    showToast('Plan deleted');
  }
}

function showCreatePlan() {
  document.getElementById('create-plan-modal').classList.remove('hidden');
}

function hideCreatePlan() {
  document.getElementById('create-plan-modal').classList.add('hidden');
  document.getElementById('plan-form').reset();
}

// ===================================
// PROFILE MANAGEMENT
// ===================================
function setupProfileForm() {
  const profileForm = document.getElementById('profile-form');
  
  // Load current profile data
  document.getElementById('user-name').value = state.user.name;
  document.getElementById('user-email').value = state.user.email;
  if (state.user.age) document.getElementById('user-age').value = state.user.age;
  if (state.user.weight) document.getElementById('user-weight').value = state.user.weight;
  document.getElementById('user-goal').value = state.user.goal;
  
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveProfile();
  });
}

function saveProfile() {
  state.user = {
    name: document.getElementById('user-name').value.trim(),
    email: document.getElementById('user-email').value.trim(),
    age: parseFloat(document.getElementById('user-age').value) || null,
    weight: parseFloat(document.getElementById('user-weight').value) || null,
    goal: document.getElementById('user-goal').value
  };
  
  // Update profile display
  document.getElementById('profile-name').textContent = state.user.name;
  document.getElementById('profile-email').textContent = state.user.email;
  
  saveToLocalStorage();
  showToast('Profile updated successfully!');
}

// ===================================
// UI HELPERS
// ===================================
function showLoading(message = 'Loading...') {
  const overlay = document.getElementById('loading-overlay');
  const loadingText = document.querySelector('.loading-text');
  loadingText.textContent = message;
  overlay.classList.remove('hidden');
}

function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  overlay.classList.add('hidden');
}

function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

// ===================================
// LOCAL STORAGE
// ===================================
function saveToLocalStorage() {
  try {
    localStorage.setItem('calocount-state', JSON.stringify({
      meals: state.meals,
      plans: state.plans,
      user: state.user,
      theme: state.theme
    }));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('calocount-state');
    if (saved) {
      const data = JSON.parse(saved);
      state.meals = data.meals || [];
      state.plans = data.plans || state.plans;
      state.user = data.user || state.user;
      state.theme = data.theme || 'light';
      
      // Set active plan
      state.currentPlan = state.plans.find(p => p.active) || state.plans[0];
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ===================================
// EXPORT FOR HTML ACCESS
// ===================================
window.switchView = switchView;
window.clearTodayMeals = clearTodayMeals;
window.deleteMeal = deleteMeal;
window.showCreatePlan = showCreatePlan;
window.hideCreatePlan = hideCreatePlan;
window.selectPlan = selectPlan;
window.deletePlan = deletePlan;

// ===================================
// PROFILE PICTURE UPLOAD & LIVE UPDATES
// ===================================

// Update profile display (name and email at top of profile card)
function updateProfileDisplay() {
  const displayName = document.getElementById('profile-display-name');
  const displayEmail = document.getElementById('profile-display-email');
  
  if (displayName && state.user.name) {
    displayName.textContent = state.user.name;
  }
  if (displayEmail && state.user.email) {
    displayEmail.textContent = state.user.email;
  }
}

// Profile picture upload functionality
function setupProfilePictureUpload() {
  const editBtn = document.getElementById('edit-avatar-btn');
  const fileInput = document.getElementById('avatar-upload');
  const avatarImg = document.getElementById('profile-avatar-img');
  const avatarPlaceholder = document.getElementById('profile-avatar-placeholder');

  if (!editBtn || !fileInput) return;

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
      state.user.avatar = imageData;
      saveToLocalStorage();

      // Show success message
      showToast('Profile picture updated!');
    };

    reader.readAsDataURL(file);
  });

  // Load saved avatar on page load
  loadSavedAvatar();
}

// Load saved avatar
function loadSavedAvatar() {
  if (!state.user || !state.user.avatar) return;

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

// Enhanced profile form submission with live updates
const profileForm = document.getElementById('profile-form');
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const age = document.getElementById('user-age').value;
    const weight = document.getElementById('user-weight').value;
    const goal = document.getElementById('user-goal').value;
    
    state.user = {
      ...state.user,
      name,
      email,
      age,
      weight,
      goal
    };
    
    // Update display name and email immediately
    updateProfileDisplay();
    
    saveToLocalStorage();
    showToast('Profile updated successfully!');
  });
}

// Initialize profile features on load
setTimeout(() => {
  setupProfilePictureUpload();
  updateProfileDisplay();
}, 100);

console.log('CaloCount Pro - Advanced AI Calorie Tracking');
console.log('All features loaded successfully! 🎉');