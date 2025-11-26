// ===================================
// ADVANCED AI CHATBOT
// Full-featured intelligent assistant
// ===================================

(function() {
  'use strict';

  // ===================================
  // CHATBOT STATE
  // ===================================
  const chatbotState = {
    isOpen: false,
    messages: [],
    isTyping: false,
    conversationContext: []
  };

  // ===================================
  // KNOWLEDGE BASE
  // ===================================
  const appKnowledge = {
    features: {
      dashboard: "Track your daily calories, protein, carbs, and fats with real-time progress bars and visual indicators.",
      scanner: "Use your camera or upload photos to scan meals. AI analyzes the image and provides nutritional information.",
      history: "View all your logged meals with filters for today, this week, this month, or all time.",
      plans: "Create custom nutrition plans with daily calorie and macro targets tailored to your goals.",
      analytics: "Access AI-powered insights, trend charts, 7-day predictions, and achievement tracking.",
      profile: "Upload a profile picture, set your personal info, weight, age, and fitness goals."
    },
    
    howTo: {
      scan: "Go to 'Scan Meal', click 'Use Camera' or 'Upload Photo', take/select a picture, then click 'Analyze Meal'. The AI will identify the food and suggest nutritional values.",
      track: "After scanning or manually entering a meal, adjust portion size if needed, add notes, and click 'Save Meal' to add it to your daily totals.",
      goals: "Go to 'Plans', click 'Create Plan', enter your target calories and macros, then save. Your active plan will show on the dashboard.",
      upload: "In the Profile section, click the camera icon on your avatar, select an image under 5MB, and it will save automatically.",
      view: "Go to Analytics to see calorie trends, macro distribution, weekly progress charts, AI insights, and 7-day predictions based on your patterns."
    },

    technical: {
      charts: "Custom Canvas-based charts with high-DPI rendering, no external libraries required.",
      ai: "Uses linear regression for predictions, statistical analysis for insights, and pattern recognition for recommendations.",
      storage: "All data saved to browser localStorage, including meals, plans, profile info, and uploaded photos.",
      mobile: "Fully responsive with touch gestures, pull-to-refresh, bottom navigation, and safe area support for notched devices.",
      performance: "60fps animations, sub-100ms chart rendering, optimized DOM updates, and hardware-accelerated transforms."
    }
  };

  // ===================================
  // AI RESPONSE ENGINE
  // ===================================
  function generateAIResponse(userMessage) {
    const message = userMessage.toLowerCase();

    // Greetings
    if (message.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return "Hey there! I'm your CaloCount AI assistant. I can help you with tracking meals, understanding features, or answering questions about nutrition. What would you like to know?";
    }

    // Help/What can you do
    if (message.match(/(what can you do|help|features|capabilities)/)) {
      return "I can help you with:\n\n• Explaining how to use CaloCount features\n• Tracking meals and setting goals\n• Understanding your analytics and predictions\n• Nutrition tips and macro information\n• Technical details about the app\n\nJust ask me anything!";
    }

    // Dashboard
    if (message.match(/(dashboard|home|stats|progress)/)) {
      return "The Dashboard shows your daily nutrition at a glance. You'll see calorie and macro progress bars, today's meals, and quick access to scan new meals. Your stats update in real-time as you log food!";
    }

    // Scanner
    if (message.match(/(scan|camera|photo|picture|analyze|ai scan)/)) {
      return appKnowledge.howTo.scan + "\n\nYou can also manually adjust the nutritional values if the AI estimation needs tweaking!";
    }

    // Analytics
    if (message.match(/(analytics|charts|insights|predictions|trends)/)) {
      return "Analytics is where the magic happens! You get:\n\n• AI Insights based on your patterns\n• 14-day calorie trend chart\n• Macro distribution breakdown\n• Weekly progress comparisons\n• 7-day calorie predictions using machine learning\n• Achievement tracking\n\nNeed demo data? Type: demo.loadData() in the console!";
    }

    // Profile
    if (message.match(/(profile|picture|photo|avatar|settings|upload)/)) {
      return "In Profile, you can upload a profile picture (just click the camera icon!), set your name, email, age, weight, and fitness goals. Everything saves automatically to your browser.";
    }

    // Plans/Goals
    if (message.match(/(plan|goal|target|calorie.*goal|macro.*goal)/)) {
      return appKnowledge.howTo.goals + "\n\nYou can create multiple plans and switch between them. Great for cutting, bulking, or maintenance phases!";
    }

    // History
    if (message.match(/(history|past meals|previous|logged)/)) {
      return "History shows all your tracked meals. Filter by today, this week, this month, or all time. You can also delete meals if you logged something by mistake.";
    }

    // Mobile
    if (message.match(/(mobile|phone|responsive|app)/)) {
      return "CaloCount is fully mobile-optimized! On phones, you'll see bottom navigation, swipe gestures work, and you can pull down to refresh. It works like a native app!";
    }

    // Nutrition advice
    if (message.match(/(protein|carbs|carbohydrates|fats|calories|nutrition|macro)/)) {
      return "Here are general macro guidelines:\n\n• Protein: 0.8-1g per lb of body weight for general health, 1-1.5g for muscle building\n• Carbs: 45-65% of calories, your body's main energy source\n• Fats: 20-35% of calories, essential for hormones and nutrient absorption\n\nRemember, these are guidelines. Your ideal macros depend on your goals, activity level, and body type!";
    }

    // Weight loss
    if (message.match(/(lose weight|weight loss|cut|cutting|deficit)/)) {
      return "For weight loss, you need a calorie deficit (eating less than you burn). A safe rate is 0.5-1kg per week, which is about a 500-750 calorie deficit per day.\n\nTips:\n• Track consistently\n• Prioritize protein to preserve muscle\n• Stay hydrated\n• Be patient - sustainable loss takes time!";
    }

    // Muscle gain
    if (message.match(/(gain.*muscle|build.*muscle|bulk|surplus)/)) {
      return "Building muscle requires a calorie surplus and adequate protein. Aim for:\n\n• 200-500 calorie surplus\n• 1.6-2.2g protein per kg body weight\n• Progressive strength training\n• 7-9 hours of sleep\n\nGain 0.25-0.5kg per week for lean gains. Track your progress in Analytics!";
    }

    // Technical questions
    if (message.match(/(how.*work|code|built|technology|technical)/)) {
      return "CaloCount is built with pure vanilla JavaScript, HTML5, and CSS3 - zero frameworks!\n\nKey tech:\n• Custom Canvas charts (no libraries)\n• Linear regression ML for predictions\n• LocalStorage for data persistence\n• 60fps animations with requestAnimationFrame\n• Mobile-first responsive design\n\nIt's production-ready with 4,000+ lines of code!";
    }

    // Data/Privacy
    if (message.match(/(data|privacy|secure|safe|stored)/)) {
      return "Your data is 100% private and stored locally in your browser using localStorage. Nothing is sent to external servers. Your photos, meals, and personal info stay on your device only.";
    }

    // Demo data
    if (message.match(/(demo|test|sample.*data|example)/)) {
      return "Want to see the app with sample data? Open your browser console (F12) and type:\n\ndemo.loadData()\n\nThis adds 2 weeks of meals so you can see charts, analytics, and predictions in action!";
    }

    // Chatbot itself
    if (message.match(/(who are you|what are you|about you|your name)/)) {
      return "I'm your CaloCount AI Assistant! I'm here 24/7 to help you understand features, answer nutrition questions, and guide you through the app. Think of me as your personal fitness tech support!";
    }

    // Thank you
    if (message.match(/(thank|thanks|appreciate)/)) {
      return "You're welcome! Happy to help. Feel free to ask me anything else about CaloCount or nutrition! 😊";
    }

    // Jokes/Fun
    if (message.match(/(joke|funny|laugh)/)) {
      return "Why did the cookie go to the doctor?\n\nBecause it felt crumbly! 🍪\n\nBut seriously, let me know if you have any questions about tracking your nutrition!";
    }

    // Calculator
    if (message.match(/\d+\s*[\+\-\*\/]\s*\d+/)) {
      try {
        const result = eval(message.replace(/[^\d\+\-\*\/\.\(\)]/g, ''));
        return `The answer is ${result}! Need help with your macro calculations?`;
      } catch (e) {
        return "I can help with simple math! Try something like '150 + 200' or '2000 * 0.3'";
      }
    }

    // Default - intelligent fallback
    return generateContextualResponse(message);
  }

  function generateContextualResponse(message) {
    // Check for question words
    if (message.includes('how')) {
      return "Great question! CaloCount makes nutrition tracking simple. Try asking about specific features like 'How do I scan meals?' or 'How do I set goals?' I'm here to help!";
    }

    if (message.includes('why')) {
      return "That's a thoughtful question! CaloCount is designed to help you reach your fitness goals through accurate tracking and AI insights. What specific aspect are you curious about?";
    }

    if (message.includes('when')) {
      return "Timing is important! For best results, log meals as you eat them. The app tracks everything in real-time and updates your progress instantly.";
    }

    if (message.includes('where')) {
      return "You can find features in the sidebar: Dashboard for overview, Scan Meal for logging food, History for past meals, Plans for goals, Analytics for insights, and Profile for settings!";
    }

    // General fallback
    return "I want to help! Could you rephrase that or ask about:\n\n• How to use a feature\n• Nutrition questions\n• Technical details\n• Setting up your goals\n\nOr just say 'help' to see what I can do!";
  }

  // ===================================
  // CREATE CHATBOT UI
  // ===================================
  function createChatbotUI() {
    const chatbotHTML = `
      <!-- Chatbot Toggle Button -->
      <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      </button>

      <!-- Chatbot Window -->
      <div class="chatbot-window" id="chatbot-window">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div class="chatbot-status">
              <h3 class="chatbot-title">CaloCount AI</h3>
              <p class="chatbot-subtitle">
                <span class="status-indicator"></span>
                Always here to help
              </p>
            </div>
          </div>
          <div class="chatbot-header-actions">
            <button class="chatbot-header-btn" id="chatbot-minimize" aria-label="Minimize">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13H5v-2h14v2z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="chatbot-messages" id="chatbot-messages">
          <!-- Welcome screen will be inserted here -->
        </div>

        <!-- Input Area -->
        <div class="chatbot-input-area">
          <div class="chatbot-input-wrapper">
            <textarea 
              class="chatbot-input" 
              id="chatbot-input" 
              placeholder="Ask me anything..."
              rows="1"
            ></textarea>
            <button class="chatbot-send-btn" id="chatbot-send" aria-label="Send message">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }

  // ===================================
  // WELCOME SCREEN
  // ===================================
  function showWelcomeScreen() {
    const messagesContainer = document.getElementById('chatbot-messages');
    messagesContainer.innerHTML = `
      <div class="chatbot-welcome">
        <div class="welcome-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            <circle cx="9" cy="10" r="1.5"/>
            <circle cx="15" cy="10" r="1.5"/>
            <path d="M12 17c2.21 0 4-1.79 4-4h-8c0 2.21 1.79 4 4 4z"/>
          </svg>
        </div>
        <h2 class="welcome-title">Hi! I'm your AI assistant</h2>
        <p class="welcome-description">
          Ask me anything about CaloCount, nutrition tracking, or how to use features!
        </p>
        <div class="welcome-suggestions">
          <div class="suggestion-card" data-suggestion="How do I scan a meal?">
            <div class="suggestion-card-title">📸 Scan Meals</div>
            <div class="suggestion-card-desc">Learn how to use the AI scanner</div>
          </div>
          <div class="suggestion-card" data-suggestion="Tell me about analytics">
            <div class="suggestion-card-title">📊 Analytics</div>
            <div class="suggestion-card-desc">Understand your insights and predictions</div>
          </div>
          <div class="suggestion-card" data-suggestion="How do I set nutrition goals?">
            <div class="suggestion-card-title">🎯 Set Goals</div>
            <div class="suggestion-card-desc">Create custom nutrition plans</div>
          </div>
        </div>
      </div>
    `;

    // Add click handlers to suggestions
    document.querySelectorAll('.suggestion-card').forEach(card => {
      card.addEventListener('click', () => {
        const suggestion = card.dataset.suggestion;
        sendMessage(suggestion);
      });
    });
  }

  // ===================================
  // MESSAGE HANDLING
  // ===================================
  function addMessage(text, isUser = false) {
    const messagesContainer = document.getElementById('chatbot-messages');
    
    // Remove welcome screen if present
    const welcome = messagesContainer.querySelector('.chatbot-welcome');
    if (welcome) {
      welcome.remove();
    }

    const time = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const messageHTML = `
      <div class="chat-message ${isUser ? 'user' : 'bot'}">
        <div class="message-avatar ${isUser ? 'user' : 'bot'}">
          ${isUser ? 'U' : 'AI'}
        </div>
        <div class="message-content">
          <div class="message-bubble">${text.replace(/\n/g, '<br>')}</div>
          <div class="message-time">${time}</div>
        </div>
      </div>
    `;

    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Store in state
    chatbotState.messages.push({ text, isUser, time });
  }

  function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingHTML = `
      <div class="chat-message bot" id="typing-indicator">
        <div class="message-avatar bot">AI</div>
        <div class="message-content">
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
      </div>
    `;
    messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  function sendMessage(text = null) {
    const input = document.getElementById('chatbot-input');
    const message = text || input.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, true);
    if (!text) input.value = '';

    // Show typing indicator
    showTypingIndicator();
    chatbotState.isTyping = true;

    // Simulate AI thinking time
    setTimeout(() => {
      hideTypingIndicator();
      const response = generateAIResponse(message);
      addMessage(response, false);
      chatbotState.isTyping = false;
    }, 500 + Math.random() * 1000);
  }

  // ===================================
  // TOGGLE CHATBOT
  // ===================================
  function toggleChatbot() {
    chatbotState.isOpen = !chatbotState.isOpen;
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');

    if (chatbotState.isOpen) {
      toggle.classList.add('open');
      window.classList.add('open');
      
      // Show welcome if first time
      if (chatbotState.messages.length === 0) {
        showWelcomeScreen();
      }

      // Focus input
      setTimeout(() => {
        document.getElementById('chatbot-input').focus();
      }, 300);
    } else {
      toggle.classList.remove('open');
      window.classList.remove('open');
    }
  }

  // ===================================
  // EVENT LISTENERS
  // ===================================
  function setupEventListeners() {
    // Toggle button
    document.getElementById('chatbot-toggle').addEventListener('click', toggleChatbot);
    document.getElementById('chatbot-minimize').addEventListener('click', toggleChatbot);

    // Send button
    document.getElementById('chatbot-send').addEventListener('click', () => sendMessage());

    // Enter to send (Shift+Enter for new line)
    const input = document.getElementById('chatbot-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-resize textarea
    input.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
  }

  // ===================================
  // INITIALIZE
  // ===================================
  function initializeChatbot() {
    console.log('🤖 Initializing AI Chatbot...');
    createChatbotUI();
    setupEventListeners();
    console.log('✅ Chatbot ready!');
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChatbot);
  } else {
    initializeChatbot();
  }

  // Export for external access
  window.chatbot = {
    open: () => {
      if (!chatbotState.isOpen) toggleChatbot();
    },
    close: () => {
      if (chatbotState.isOpen) toggleChatbot();
    },
    send: (message) => sendMessage(message)
  };

})();

console.log('🤖 AI Chatbot Module Loaded');