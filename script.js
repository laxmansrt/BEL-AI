const GROQ_KEY = "";
    const API_BASE = "https://bel-ai-bknd.vercel.app/api";
    // Shared config bridge for belai-features.js (external scripts can't access inline let/const)
    window.BELAI = {
      get API_BASE() { return API_BASE; },
      get BOT_LANG() { return typeof BOT_LANG !== 'undefined' ? BOT_LANG : 'en'; },
      get ACTIVE_DELIVERIES() { return typeof ACTIVE_DELIVERIES !== 'undefined' ? ACTIVE_DELIVERIES : []; },
      get CROPS_DB() { return typeof CROPS_DB !== 'undefined' ? CROPS_DB : []; },
    };
    // ⚠️  Replace with your Google Client ID from console.cloud.google.com
    const GOOGLE_CLIENT_ID = "1033866191301-5usv26jdgb3mlqq890hrmajriai73dgj.apps.googleusercontent.com";
    // NOTE: GROQ_KEY is handled server-side in the backend
  </script>

  <!-- SHARED BG + OVERLAY (swapped per screen via JS) -->
  <img id="globalBg" class="bg-photo" src="" alt="" />
  <div class="bg-overlay" id="bgOverlay"></div>

  <!-- ══════════════════════════════════════════════
  SCREEN 0 — AUTHENTICATION
══════════════════════════════════════════════ -->
  <div id="mod-auth" class="screen active">
    <div class="screen-content" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        ">
      <div style="font-size: 48px; margin-bottom: 8px">🌾</div>
      <div style="
            font-size: 42px;
            font-weight: 800;
            color: var(--gold);
            letter-spacing: -2px;
            line-height: 1;
            margin-bottom: 32px;
          ">
        Welcome to BELAI
      </div>

      <div class="glass" style="width: 100%; max-width: 400px; padding: 24px" id="authBox">
        <div style="
              display: flex;
              gap: 10px;
              margin-bottom: 20px;
              border-bottom: 1px solid var(--glass-border);
              padding-bottom: 10px;
            ">
          <div class="chip active" id="tabLogin" onclick="switchAuth('login')" style="flex: 1; text-align: center">
            Login
          </div>
          <div class="chip" id="tabReg" onclick="switchAuth('register')" style="flex: 1; text-align: center">
            Register
          </div>
        </div>

        <div id="formLogin">
          <input class="glass-input" id="authLogEmail" placeholder="Email (gmail)" type="email"
            style="margin-bottom: 12px" />
          <input class="glass-input" id="authLogPass" placeholder="Password" type="password"
            style="margin-bottom: 16px" />
          <button class="btn-primary" onclick="doLogin()">Login →</button>
          <div class="auth-divider">or</div>
          <div class="google-btn-container" style="display:flex; justify-content:center; width: 100%;"></div>
          <div style="text-align: center; margin-top: 14px">
            <span style="
                  font-size: 13px;
                  color: rgba(255, 255, 255, 0.5);
                  cursor: pointer;
                " onclick="switchAuth('forgot')">Forgot Password?</span>
          </div>
        </div>

        <div id="formReg" style="display: none">
          <input class="glass-input" id="authRegName" placeholder="Full Name" style="margin-bottom: 12px" />
          <input class="glass-input" id="authRegPhone" placeholder="Phone Number" style="margin-bottom: 12px" />
          <input class="glass-input" id="authRegEmail" placeholder="Email (gmail)" type="email"
            style="margin-bottom: 12px" />
          <input class="glass-input" id="authRegPass" placeholder="Password" type="password"
            style="margin-bottom: 20px" />
          <button class="btn-primary" onclick="doRegister()">
            Register ✓
          </button>
          <div class="auth-divider">or</div>
          <div class="google-btn-container" style="display:flex; justify-content:center; width: 100%;"></div>
        </div>

        <div id="formForgot" style="display: none">
          <div style="
                font-size: 14px;
                color: rgba(255, 255, 255, 0.7);
                margin-bottom: 16px;
                text-align: center;
              ">
            Enter your email and set a new password
          </div>
          <input class="glass-input" id="authForgotEmail" placeholder="Email (gmail)" type="email"
            style="margin-bottom: 12px" />
          <input class="glass-input" id="authForgotNew" placeholder="New Password" type="password"
            style="margin-bottom: 16px" />
          <button class="btn-primary" onclick="doResetPassword()">
            Reset Password 🔑
          </button>
          <div style="text-align: center; margin-top: 14px">
            <span style="
                  font-size: 13px;
                  color: rgba(255, 255, 255, 0.5);
                  cursor: pointer;
                " onclick="switchAuth('login')">← Back to Login</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 1 — LANGUAGE SELECTION
══════════════════════════════════════════════ -->

  <!-- ══════════════════════════════════════════════
  SCREEN: USER PROFILE
══════════════════════════════════════════════ -->
  <div id="mod-profile" class="screen" style="overflow-y: auto; padding-bottom: 80px">
    <!-- Hero / Header -->
    <div class="profile-hero" id="profileHero">
      <button class="btn-outline back-btn profile-back" onclick="goHome()"
        style="padding: 0; width: 40px; height: 40px; font-size: 18px">
        ←
      </button>
      <button class="btn-outline profile-edit-btn" id="profileEditBtn" onclick="toggleProfileEdit()">
        ✏️ Edit
      </button>

      <div class="profile-avatar-wrap">
        <img id="profileAvatar" class="profile-avatar"
          src="https://api.dicebear.com/7.x/initials/svg?seed=BELAI&backgroundColor=2d6a4f" alt="Avatar" />
        <button class="profile-avatar-edit" onclick="document.getElementById('avatarInput').click()">
          📷
        </button>
        <input type="file" id="avatarInput" accept="image/*" style="display: none" onchange="uploadAvatar(this)" />
      </div>
      <div class="profile-name" id="profileDisplayName">Loading...</div>
      <div class="profile-meta" id="profileDisplayMeta">
        <span>📍</span><span id="profileDisplayVillage">—</span>
        <span>|</span>
        <span>📞</span><span id="profileDisplayPhone">—</span>
      </div>
      <div class="profile-bio" id="profileDisplayBio">
        Tap Edit to add a short bio.
      </div>

      <!-- Google Auth -->
      <div id="googleSection">
        <button class="google-btn" onclick="linkGoogle()">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4"
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z" />
            <path fill="#34A853"
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H1.957v2.332A8.997 8.997 0 0 0 9 18z" />
            <path fill="#FBBC05"
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H1.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l2.007-1.332z" />
            <path fill="#EA4335"
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 1.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>

    <!-- Edit Form (hidden by default) -->
    <div id="profileEditForm" style="display: none; padding: 20px" class="profile-form">
      <div class="glass" style="padding: 20px">
        <div style="
              font-size: 16px;
              font-weight: 700;
              color: var(--gold);
              margin-bottom: 16px;
            ">
          ✏️ Edit Profile
        </div>
        <input class="glass-input" id="editName" placeholder="Full Name" />
        <input class="glass-input" id="editVillage" placeholder="Village / Town Name" />
        <div style="display: flex; gap: 8px; margin-bottom: 12px">
          <div class="glass-input" style="
                width: 70px;
                padding: 12px;
                text-align: center;
                flex-shrink: 0;
              ">
            +91
          </div>
          <input class="glass-input" id="editPhone" placeholder="Phone Number" style="flex: 1; margin: 0" type="tel" />
        </div>
        <textarea id="editBio" class="glass-input" rows="3" maxlength="150" placeholder="Short bio (max 150 chars)"
          style="resize: none; font-family: inherit"></textarea>
        <div style="
              font-size: 11px;
              color: rgba(255, 255, 255, 0.4);
              margin-bottom: 16px;
              text-align: right;
            " id="bioCharCount">
          0/150
        </div>
        <button class="btn-primary" onclick="saveProfile()">
          💾 Save Changes
        </button>
        <button class="btn-outline" style="margin-top: 8px" onclick="toggleProfileEdit()">
          ✕ Cancel
        </button>
      </div>
    </div>

    <!-- Queries Section -->
    <div style="padding: 20px">
      <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          ">
        <div style="font-size: 18px; font-weight: 700; color: var(--gold)">
          💬 Queries & Interactions
        </div>
        <button class="btn-primary" style="padding: 8px 14px; font-size: 12px" onclick="openNewQueryModal()">
          + Post Query
        </button>
      </div>

      <!-- Tab Switcher -->
      <div class="query-tabs">
        <button class="query-tab active" id="tab-received" onclick="switchQueryTab('received')">
          Received Queries
        </button>
        <button class="query-tab" id="tab-mine" onclick="switchQueryTab('mine')">
          My Queries
        </button>
      </div>

      <!-- Queries List -->
      <div id="queriesList"></div>
    </div>

    <!-- New Query Modal -->
    <div id="newQueryModal" style="
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 200;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 20px;
        ">
      <div class="glass" style="width: 100%; max-width: 420px; padding: 24px">
        <div style="
              font-size: 17px;
              font-weight: 700;
              color: var(--gold);
              margin-bottom: 16px;
            ">
          📢 Post a Query
        </div>
        <input class="glass-input" id="queryTitle" placeholder="Query Title (e.g. Best pesticide for aphids?)"
          style="margin-bottom: 12px" />
        <textarea id="queryDesc" class="glass-input" rows="3" placeholder="Describe your query in detail..."
          style="resize: none; font-family: inherit; margin-bottom: 16px"></textarea>
        <button class="btn-primary" onclick="submitQuery()">
          Post Query 🌱
        </button>
        <button class="btn-outline" style="margin-top: 8px" onclick="closeNewQueryModal()">
          Cancel
        </button>
      </div>
    </div>
  </div>

  <div id="splash" class="screen">
    <div class="screen-content" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          text-align: center;
        ">
      <div style="margin-bottom: 8px; font-size: 48px">🌾</div>
      <div style="
            font-size: 52px;
            font-weight: 800;
            color: var(--gold);
            letter-spacing: -2px;
            line-height: 1;
          ">
        BELAI
      </div>
      <div style="
            font-size: 13px;
            color: var(--white75);
            font-style: italic;
            margin-top: 8px;
            margin-bottom: 48px;
          ">
        ಕೃಷಿಯನ್ನು ಮರುಕಲ್ಪಿಸಲಾಗಿದೆ · Farming Re-imagined
      </div>
      <button class="btn-outline" style="
            position: absolute;
            top: 20px;
            left: 20px;
            border-radius: 50%;
            width: 44px;
            height: 44px;
            padding: 0;
            font-size: 20px;
          " onclick="showScreen('mod-auth')">
        ←
      </button>
      <div style="
            font-size: 28px;
            font-weight: 700;
            color: var(--white);
            margin-bottom: 32px;
          ">
        Choose Your Language
      </div>
      <!-- Top row: 3 cards -->
      <div class="grid-3" style="max-width: 520px; width: 100%; margin-bottom: 16px">
        <div class="glass lang-card" onclick="pickLang('kn', this)" style="
              padding: 24px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              border-radius: 20px;
            ">
          <div style="font-size: 40px">🌾</div>
          <div style="
                font-size: 20px;
                font-weight: 700;
                font-family: &quot;Noto Sans Kannada&quot;, sans-serif;
              ">
            ಕನ್ನಡ
          </div>
          <div style="font-size: 11px; color: var(--white40)">Kannada</div>
        </div>
        <div class="glass lang-card" onclick="pickLang('te', this)" style="
              padding: 24px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              border-radius: 20px;
            ">
          <div style="font-size: 40px">🌶</div>
          <div style="
                font-size: 20px;
                font-weight: 700;
                font-family: &quot;Noto Sans Telugu&quot;, sans-serif;
              ">
            తెలుగు
          </div>
          <div style="font-size: 11px; color: var(--white40)">Telugu</div>
        </div>
        <div class="glass lang-card" onclick="pickLang('hi', this)" style="
              padding: 24px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              border-radius: 20px;
            ">
          <div style="font-size: 40px">🌽</div>
          <div style="
                font-size: 20px;
                font-weight: 700;
                font-family: &quot;Noto Sans Devanagari&quot;, sans-serif;
              ">
            हिंदी
          </div>
          <div style="font-size: 11px; color: var(--white40)">Hindi</div>
        </div>
      </div>
      <!-- Bottom row: 2 cards centered -->
      <div style="
            display: flex;
            gap: 16px;
            justify-content: center;
            overflow: visible;
            max-width: 520px;
            width: 100%;
          ">
        <div class="glass lang-card" onclick="pickLang('ta', this)" style="
              padding: 24px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              border-radius: 20px;
              width: 160px;
              flex-shrink: 0;
              position: relative;
              z-index: 1;
            ">
          <div style="font-size: 40px">🍚</div>
          <div style="
                font-size: 20px;
                font-weight: 700;
                font-family: &quot;Noto Sans Tamil&quot;, sans-serif;
              ">
            தமிழ்
          </div>
          <div style="font-size: 11px; color: var(--white40)">Tamil</div>
        </div>
        <div class="glass lang-card" onclick="pickLang('en', this)" style="
              padding: 24px 16px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 10px;
              border-radius: 20px;
              width: 160px;
              flex-shrink: 0;
              position: relative;
              z-index: 1;
            ">
          <div style="font-size: 40px">🥬</div>
          <div style="font-size: 20px; font-weight: 700">English</div>
          <div style="font-size: 11px; color: var(--white40)">English</div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 2 — HOME DASHBOARD
══════════════════════════════════════════════ -->
  <div id="modsel" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="showScreen('splash')" style="margin-right: 12px">
        ←
      </button>
      <div style="font-size: 26px; font-weight: 800; color: var(--gold)">
        🌾 BELAI
      </div>
      <div class="glass-sm" style="
            padding: 8px 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: var(--white75);
          ">
        <span>☀️</span><span id="hWeather">32°C</span><span style="color: var(--white40)">|</span><span
          id="hCity">Karnataka</span>
      </div>
    </div>
    <div class="screen-content" style="padding-top: 0">
      <div style="
            font-size: 28px;
            font-weight: 700;
            color: var(--white);
            text-align: center;
            margin-bottom: 8px;
            line-height: 1.3;
          ">
        What would you<br />like to do today?
      </div>
      <div style="
            font-size: 14px;
            color: var(--white75);
            text-align: center;
            margin-bottom: 28px;
          ">
        Select a feature to get started
      </div>
      <div class="grid-3" id="modGrid">
        <!-- Injected by JS -->
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 3 — SUPPLY & TRADING
══════════════════════════════════════════════ -->
  <div id="mod-supply" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="goHome()">←</button>
      <div class="page-title" id="supTitle">Supply & Trading</div>
      <button class="lang-pill" onclick="showLangModal()">🌐</button>
    </div>
    <div class="screen-content" style="padding-top: 0">
      <!-- Ticker -->
      <div class="ticker-wrap">
        <div class="ticker-track" id="priceTicker"></div>
      </div>
      <!-- Tabs -->
      <div class="tab-row">
        <div class="chip active" onclick="supTab(0, this)">
          🔍 Find Buyers
        </div>
        <div class="chip" onclick="supTab(1, this)">📦 Track Produce</div>
        <div class="chip" onclick="supTab(2, this)">🛒 Buy Products</div>
        <div class="chip" onclick="supTab(3, this)">📊 Market Prices</div>
      </div>
      <!-- Tab 0 -->
      <div id="st-0">
        <input class="glass-input listing-field" id="cropSearch" placeholder="🔍 Search crops..."
          oninput="filterCrops(this.value)" />
        <div id="cropGrid" style="margin-bottom: 20px"></div>
        <div class="glass" style="padding: 20px; margin-bottom: 16px">
          <div class="sec-label" style="margin-bottom: 16px">
            📦 List Your Crops
          </div>
          <input class="glass-input listing-field" id="lName" placeholder="Crop name..." list="cropSug" /><datalist
            id="cropSug"></datalist>
          <div style="display: flex; gap: 10px" class="listing-field">
            <input class="glass-input" id="lQty" placeholder="Quantity" style="flex: 1" />
            <select class="glass-input" id="lUnit" style="flex: 0.6">
              <option>Kg</option>
              <option>Quintal</option>
              <option>Ton</option>
            </select>
          </div>
          <input class="glass-input listing-field" id="lPrice" placeholder="Price per unit (₹)" />
          <div style="display: flex; gap: 8px; margin-bottom: 14px">
            <div class="chip active" id="grA" onclick="setGrade(this, 'A')">
              Grade A
            </div>
            <div class="chip" id="grB" onclick="setGrade(this, 'B')">
              Grade B
            </div>
            <div class="chip" id="grC" onclick="setGrade(this, 'C')">
              Grade C
            </div>
          </div>
          <div class="glass-sm" onclick="showToast('Photo upload: tap to select')" style="
                padding: 18px;
                text-align: center;
                border-style: dashed;
                margin-bottom: 14px;
                cursor: pointer;
              ">
            <div style="font-size: 24px">📸</div>
            <div style="font-size: 12px; color: var(--white75); margin-top: 6px">
              Upload Crop Photo
            </div>
          </div>
          <button class="btn-primary listing-field" onclick="submitListing()">
            ✓ Submit Listing
          </button>
          <button class="btn-outline" style="width: 100%; margin-top: 10px" onclick="shareLocation()" id="locBtn">
            📍 Share My Location
          </button>
          <div id="locCard" style="margin-top: 12px"></div>
        </div>
        <div id="myListSection" style="display: none">
          <div class="sec-label">My Listings</div>
          <div id="myListScroll" class="h-scroll"></div>
        </div>
      </div>
      <!-- Tab 1 -->
      <div id="st-1" style="display: none">
        <div id="deliveryCards"></div>
      </div>
      <!-- Tab 2 -->
      <div id="st-2" style="display: none">
        <div class="sec-title">🛒 Available Crops</div>
        <div style="
              display: flex;
              gap: 8px;
              overflow-x: auto;
              margin-bottom: 16px;
            " id="buyFilter">
          <div class="chip active" onclick="filterBuy('all', this)">
            All Karnataka
          </div>
          <div class="chip" onclick="filterBuy('near', this)">
            Nearby (&lt;20km)
          </div>
        </div>
        <div class="grid-2" id="buyGrid"></div>
      </div>
      <!-- Tab 3 -->
      <div id="st-3" style="display: none">
        <div class="sec-title">📊 Live Market Prices</div>
        <div style="
              display: flex;
              gap: 10px;
              flex-wrap: wrap;
              margin-bottom: 16px;
            ">
          <button class="btn-outline" onclick="toggleSharePrice()">
            ➕ Share My Price
          </button>
          <button class="btn-outline" onclick="toggleMPFilter()">
            🔍 Filter District
          </button>
        </div>
        <div id="sharePriceForm" style="display: none" class="glass" style="padding: 16px; margin-bottom: 16px">
          <div style="padding: 16px">
            <input class="glass-input listing-field" id="mpCrop" placeholder="Crop name..." />
            <input class="glass-input listing-field" id="mpPrice" placeholder="Price per quintal (₹)" type="number" />
            <select class="glass-input listing-field" id="mpDist"></select>
            <button class="btn-primary" onclick="submitMarketPrice()">
              ✓ Share Price
            </button>
          </div>
        </div>
        <div id="mpGrid" class="grid-2"></div>
      </div>
    </div>
  </div>

  <!-- Smart Contract Modal -->
  <div class="sc-overlay" id="scModal">
    <div class="glass" style="width:100%;max-width:420px;padding:24px;border-radius:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <div style="font-size:17px;font-weight:700;color:var(--gold)">⛓️ Smart Contract</div>
        <button class="btn-outline" style="padding:6px 12px;font-size:12px" onclick="closeModal('scModal')">✕
          Close</button>
      </div>
      <div class="glass-sm" style="padding:16px;margin-bottom:12px">
        <div style="font-size:11px;color:var(--white40);letter-spacing:0.5px;font-weight:600;margin-bottom:8px">CONTRACT
          TERMS</div>
        <div
          style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:13px;color:var(--white75)">Crop</span><span style="font-size:13px;font-weight:700"
            id="sc-crop">—</span>
        </div>
        <div
          style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:13px;color:var(--white75)">Agreed Price</span><span
            style="font-size:13px;font-weight:700;color:var(--gold)" id="sc-price">—</span>
        </div>
        <div
          style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:13px;color:var(--white75)">Quantity</span><span style="font-size:13px;font-weight:700"
            id="sc-qty">—</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding:8px 0"><span
            style="font-size:13px;color:var(--white75)">Delivery Date</span><span style="font-size:13px;font-weight:700"
            id="sc-date">—</span></div>
      </div>
      <div class="glass-sm" style="padding:14px;margin-bottom:12px;border:1px solid rgba(34,197,94,0.35)">
        <div style="font-size:11px;color:#22c55e;font-weight:700;letter-spacing:0.5px;margin-bottom:6px">🛡️ FARMER
          PROTECTION CLAUSE</div>
        <div style="font-size:12px;color:var(--white75);line-height:1.6">75% of the agreed price is <strong
            style="color:#22c55e">guaranteed &amp; locked in escrow</strong> at contract signing. Released to farmer
          automatically on delivery confirmation.</div>
      </div>
      <div class="escrow-lock">
        <div style="font-size:24px">🔒</div>
        <div>
          <div style="font-size:12px;font-weight:700;color:#22c55e">Auto-Escrow Active</div>
          <div style="font-size:11px;color:var(--white75)">Funds locked · AgroChain Network · Block #<span
              id="sc-block">4,821,993</span></div>
        </div>
        <div
          style="margin-left:auto;width:10px;height:10px;border-radius:50%;background:#22c55e;animation:pulseDot 1.5s infinite;flex-shrink:0">
        </div>
      </div>
      <button class="btn-primary" style="width:100%;margin-top:16px"
        onclick="showToast('✅ Smart Contract signed & escrow locked!');closeModal('scModal')">✍️ Sign &amp; Lock
        Contract</button>
    </div>
  </div>

  <!-- Provenance Modal -->
  <div class="prov-overlay" id="provModal">
    <div class="glass"
      style="width:100%;max-width:420px;padding:24px;border-radius:20px;max-height:90vh;overflow-y:auto">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div style="font-size:17px;font-weight:700;color:var(--gold)">🔍 Product Provenance</div>
        <button class="btn-outline" style="padding:6px 12px;font-size:12px" onclick="closeModal('provModal')">✕
          Close</button>
      </div>
      <img id="prov-img" src="" alt=""
        style="width:100%;height:160px;object-fit:cover;border-radius:12px;margin-bottom:14px">
      <div style="margin-bottom:12px">
        <div style="font-size:16px;font-weight:700" id="prov-crop">—</div>
        <div style="font-size:12px;color:var(--gold)" id="prov-farmer">—</div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px">
        <span class="prov-tag">📅 <span id="prov-harvest">—</span></span>
        <span class="prov-tag">📍 <span id="prov-village">—</span></span>
        <span class="prov-tag">🧪 <span id="prov-pesticide">—</span></span>
      </div>
      <div class="glass-sm" style="padding:14px;margin-bottom:10px">
        <div style="font-size:11px;color:var(--white40);font-weight:600;letter-spacing:0.5px;margin-bottom:8px">
          CERTIFICATIONS</div>
        <div
          style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:12px">🌿 Organic Certified</span><span
            style="color:#22c55e;font-size:12px;font-weight:700" id="prov-organic">—</span>
        </div>
        <div
          style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
          <span style="font-size:12px">🌍 Carbon Footprint</span><span
            style="color:var(--gold);font-size:12px;font-weight:700" id="prov-carbon">—</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0"><span
            style="font-size:12px">💧 Water Usage</span><span style="font-size:12px;font-weight:700"
            id="prov-water">—</span></div>
      </div>
      <div class="glass-sm"
        style="padding:14px;margin-bottom:14px;text-align:center;border:1px solid rgba(245,200,66,0.3)">
        <div style="font-size:11px;color:var(--white40);margin-bottom:4px">LAB CERTIFIED BY</div>
        <div style="font-size:13px;font-weight:700;color:var(--gold)">🏛️ IARI Certified Lab · Karnataka</div>
        <div style="font-size:11px;color:#22c55e;margin-top:2px">✓ Pesticide Residue Within Safe Limit</div>
      </div>
      <button class="btn-primary" style="width:100%" onclick="showToast('💸 Crypto tip sent to farmer wallet!')">💸 Tip
        the Farmer</button>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 4 — CROP PLANNER
══════════════════════════════════════════════ -->
  <div id="mod-planner" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="goHome()">←</button>
      <div class="page-title" id="planTitle">Crop Planner</div>
      <button class="lang-pill" onclick="showLangModal()">🌐</button>
    </div>
    <div class="screen-content" style="padding-top: 0">
      <!-- Weather hero -->
      <div class="glass" style="
            padding: 20px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
        <div>
          <div style="font-size: 52px; font-weight: 800; line-height: 1">
            32°C
          </div>
          <div class="gold" style="font-size: 13px; margin-top: 4px">
            Kharif Season · 2024
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px">
            <span class="glass-sm" style="padding: 6px 10px; font-size: 12px">💧 72%</span>
            <span class="glass-sm" style="padding: 6px 10px; font-size: 12px">🌧 10% Rain</span>
            <span class="glass-sm" style="padding: 6px 10px; font-size: 12px">📅 7-day</span>
          </div>
        </div>
        <div style="font-size: 72px">🌤</div>
      </div>
      <!-- 4 tiles -->
      <div style="
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 16px;
          ">
        <div class="glass" style="padding: 14px 8px; text-align: center; cursor: pointer" onclick="cycleSoil()">
          <div style="font-size: 24px">🏔</div>
          <div style="font-size: 10px; color: var(--gold); margin-top: 6px">
            Soil
          </div>
          <div style="font-size: 12px; font-weight: 600; margin-top: 2px" id="soilV">
            Red Loam
          </div>
        </div>
        <div class="glass" style="padding: 14px 8px; text-align: center; cursor: pointer" onclick="toggleDistDrop()">
          <div style="font-size: 24px">📍</div>
          <div style="font-size: 10px; color: var(--gold); margin-top: 6px">
            District
          </div>
          <div style="font-size: 12px; font-weight: 600; margin-top: 2px" id="distV">
            Tap map
          </div>
        </div>
        <div class="glass" style="padding: 14px 8px; text-align: center; cursor: pointer" onclick="cycleSeas()">
          <div style="font-size: 24px">☀️</div>
          <div style="font-size: 10px; color: var(--gold); margin-top: 6px">
            Season
          </div>
          <div style="font-size: 12px; font-weight: 600; margin-top: 2px" id="seasV">
            Kharif
          </div>
        </div>
        <div class="glass" style="padding: 14px 8px; text-align: center; cursor: pointer" onclick="cycleRain()">
          <div style="font-size: 24px">🌧</div>
          <div style="font-size: 10px; color: var(--gold); margin-top: 6px">
            Rain
          </div>
          <div style="font-size: 12px; font-weight: 600; margin-top: 2px" id="rainV">
            Medium
          </div>
        </div>
      </div>
      <!-- District search -->
      <div id="distDrop" class="glass" style="display: none; padding: 16px; margin-bottom: 16px">
        <input class="glass-input" id="distSearch" placeholder="Search district..." oninput="filterDists(this.value)"
          style="margin-bottom: 10px" />
        <div id="distPills" class="h-scroll"></div>
      </div>
      <!-- Karnataka Map -->
      <div class="glass" style="padding: 16px; margin-bottom: 16px">
        <div class="sec-label">Select Your District</div>
        <svg id="karnMap" viewBox="0 0 400 500" style="width: 100%; max-width: 340px; display: block; margin: auto">
          <path
            d="M95,30 L130,15 L165,20 L200,10 L240,18 L275,8 L310,22 L345,18 L375,35 L385,60 L378,90 L388,115 L380,145 L370,170 L382,195 L374,225 L355,250 L362,278 L348,305 L325,328 L305,352 L278,372 L255,395 L235,418 L210,440 L188,458 L165,448 L142,430 L118,408 L95,385 L72,360 L52,332 L38,300 L42,268 L32,240 L44,210 L38,178 L52,148 L45,118 L58,88 L72,62 Z"
            fill="rgba(245,200,66,0.06)" stroke="rgba(245,200,66,0.35)" stroke-width="1.5" />
          <g id="distDots"></g>
        </svg>
      </div>
      <button class="btn-primary" id="planBtn" onclick="getRecommendations()" style="margin-bottom: 20px">
        ✨ Get AI Recommendations
      </button>
      <div id="plannerResults"></div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 5 — DISEASE AI
══════════════════════════════════════════════ -->
  <div id="mod-disease" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="goHome()">←</button>
      <div class="page-title">Disease AI</div>
      <button class="lang-pill" onclick="showLangModal()">🌐</button>
    </div>
    <div class="screen-content" style="padding-top: 0">
      <div class="glass" style="padding: 20px; margin-bottom: 16px; text-align: center">
        <div style="font-size: 48px; margin-bottom: 12px">🔬</div>
        <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px">
          Scan Plant for Disease
        </div>
        <div style="font-size: 14px; color: var(--white75)">
          Take a photo or upload from gallery
        </div>
      </div>
      <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 20px;
          ">
        <button class="btn-primary" onclick="openCamera('disease')" style="
              padding: 20px 14px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            ">
          <span style="font-size: 32px">📸</span><span style="font-size: 13px">Take Photo</span>
        </button>
        <button class="btn-primary" onclick="document.getElementById('fileUpload').click()" style="
              padding: 20px 14px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            ">
          <span style="font-size: 32px">🖼️</span><span style="font-size: 13px">Gallery</span>
        </button>
      </div>
      <input type="file" id="fileUpload" accept="image/*" style="display: none" onchange="handleDiseaseFile(event)" />
      <div id="diseaseProcessing" style="display: none" class="glass"
        style="padding: 20px; text-align: center; margin-bottom: 16px">
        <div style="padding: 20px; text-align: center">
          <img id="diseasePreview" src="" style="
                width: 100%;
                max-height: 200px;
                object-fit: cover;
                border-radius: var(--radius-sm);
                margin-bottom: 14px;
              " />
          <div class="dot-bounce" style="justify-content: center">
            <span></span><span></span><span></span>
          </div>
          <div style="margin-top: 10px; color: var(--white75); font-size: 14px">
            Analyzing plant pathology...
          </div>
        </div>
      </div>
      <div id="diseaseResults" style="display: none"></div>
      <!-- Disease Risk Meter -->
      <div class="glass" style="padding: 20px; margin-top: 16px">
        <div class="sec-label">Disease Risk Meter</div>
        <div id="riskMeter" style="margin-top: 8px">
          <div style="
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: var(--white75);
                margin-bottom: 6px;
              ">
            <span>Low Risk</span><span>High Risk</span>
          </div>
          <div style="
                height: 8px;
                border-radius: 4px;
                background: rgba(255, 255, 255, 0.1);
                overflow: hidden;
              ">
            <div id="riskBar" style="
                  height: 100%;
                  border-radius: 4px;
                  width: 30%;
                  background: linear-gradient(
                    to right,
                    #22c55e,
                    #f59e0b,
                    #ef4444
                  );
                  transition: width 0.5s;
                "></div>
          </div>
          <div style="
                text-align: center;
                margin-top: 8px;
                font-size: 12px;
                color: var(--white75);
              ">
            Based on current humidity & temperature
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 6 — FOOD SAFETY
══════════════════════════════════════════════ -->
  <div id="mod-food" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="goHome()">←</button>
      <div class="page-title">Food Safety</div>
      <button class="lang-pill" onclick="showLangModal()">🌐</button>
    </div>
    <div class="screen-content" style="padding-top: 0">
      <div style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-bottom: 20px;
          ">
        <button class="btn-primary" onclick="startScanner('barcode')" style="
              padding: 20px 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            ">
          <span style="font-size: 32px">📷</span><span style="font-size: 12px">Scan Barcode</span>
        </button>
        <button class="btn-primary" onclick="startScanner('label')" style="
              padding: 20px 10px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 8px;
            ">
          <span style="font-size: 32px">📸</span><span style="font-size: 12px">Scan Label</span>
        </button>
      </div>
      <!-- Manual entry -->
      <div class="glass" style="padding: 20px; margin-bottom: 16px">
        <div class="sec-label" style="margin-bottom: 14px">Manual Entry</div>
        <input class="glass-input listing-field" id="fsName" placeholder="Product name" />
        <input class="glass-input listing-field" id="fsBrand" placeholder="Brand" />
        <div style="display: flex; gap: 10px" class="listing-field">
          <div style="flex: 1">
            <div style="
                  font-size: 11px;
                  color: var(--white75);
                  margin-bottom: 4px;
                ">
              Mfg Date
            </div>
            <input class="glass-input" id="fsMfg" type="date" />
          </div>
          <div style="flex: 1">
            <div style="
                  font-size: 11px;
                  color: var(--white75);
                  margin-bottom: 4px;
                ">
              Expiry Date
            </div>
            <input class="glass-input" id="fsExp" type="date" />
          </div>
        </div>
        <input class="glass-input listing-field" id="fsBatch" placeholder="Batch No." />
        <button class="btn-primary" onclick="addManualProduct()">
          + Add to Tracker
        </button>
      </div>
      <!-- CCTV -->
      <div class="sec-label">CCTV Compliance Monitor</div>
      <div class="grid-2" style="margin-bottom: 20px">
        <div class="cctv-cell">
          <div class="cctv-scanline"></div>
          <div class="rec-badge">🔴 REC</div>
          <div style="
                position: absolute;
                bottom: 6px;
                left: 8px;
                font-size: 10px;
                color: var(--white75);
              " id="c1t">
            Prep Zone
          </div>
          <div id="ct1" style="
                position: absolute;
                bottom: 6px;
                right: 8px;
                font-size: 9px;
                color: var(--white40);
              "></div>
        </div>
        <div class="cctv-cell">
          <div class="cctv-scanline"></div>
          <div class="rec-badge">🔴 REC</div>
          <div style="
                position: absolute;
                bottom: 6px;
                left: 8px;
                font-size: 10px;
                color: var(--white75);
              ">
            Storage
          </div>
          <div id="ct2" style="
                position: absolute;
                bottom: 6px;
                right: 8px;
                font-size: 9px;
                color: var(--white40);
              "></div>
        </div>
        <div class="cctv-cell">
          <div class="cctv-scanline"></div>
          <div class="rec-badge">🔴 REC</div>
          <div style="
                position: absolute;
                bottom: 6px;
                left: 8px;
                font-size: 10px;
                color: var(--white75);
              ">
            Cooking
          </div>
          <div id="ct3" style="
                position: absolute;
                bottom: 6px;
                right: 8px;
                font-size: 9px;
                color: var(--white40);
              "></div>
        </div>
        <div class="cctv-cell">
          <div class="cctv-scanline"></div>
          <div class="rec-badge">🔴 REC</div>
          <div style="
                position: absolute;
                bottom: 6px;
                left: 8px;
                font-size: 10px;
                color: var(--white75);
              ">
            Washing
          </div>
          <div id="ct4" style="
                position: absolute;
                bottom: 6px;
                right: 8px;
                font-size: 9px;
                color: var(--white40);
              "></div>
        </div>
      </div>
      <!-- Tracker -->
      <div class="sec-label">Inventory Tracker</div>
      <div id="foodTrackerGrid"></div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 7 — AGRIBOT
══════════════════════════════════════════════ -->
  <div id="mod-bot" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="goHome()">←</button>
      <div class="page-title">AgriBot</div>
      <div style="display:flex;align-items:center;gap:8px">
        <button onclick="startVideoCall()"
          style="display:flex;align-items:center;gap:5px;padding:7px 13px;background:rgba(34,197,94,0.22);border:1px solid rgba(34,197,94,0.5);border-radius:20px;color:#22c55e;font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif">📹
          Video Call</button>
        <div class="glass-sm"
          style="padding:7px 12px;font-size:12px;color:var(--red);font-weight:600;border-color:rgba(239,68,68,0.3)">🔴
          Expert</div>
      </div>
    </div>
    <div class="screen-content" style="
          padding-top: 0;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 80px);
        ">
      <!-- Bot identity -->
      <div style="text-align: center; margin-bottom: 16px">
        <div style="
              width: 88px;
              height: 88px;
              border-radius: 50%;
              background: var(--glass-bg);
              backdrop-filter: var(--glass-blur);
              border: 2px solid var(--gold);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
              margin: 0 auto 10px;
              box-shadow: 0 0 30px rgba(245, 200, 66, 0.3);
            ">
          🤖
        </div>
        <div style="font-size: 18px; font-weight: 700; color: var(--gold)">
          BELAI ರೊಬೊ
        </div>
        <div style="
              font-size: 12px;
              color: var(--white75);
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
              margin-top: 4px;
            ">
          <span class="live-dot"></span>AI Agriculture Expert · Online
        </div>
      </div>
      <!-- Lang pills -->
      <div class="h-scroll" style="justify-content: center; margin-bottom: 14px">
        <div class="chip active" onclick="setBotLang('kn', this)"
          style="font-family: &quot;Noto Sans Kannada&quot;, sans-serif">
          ಕನ್ನಡ
        </div>
        <div class="chip" onclick="setBotLang('te', this)"
          style="font-family: &quot;Noto Sans Telugu&quot;, sans-serif">
          తెలుగు
        </div>
        <div class="chip" onclick="setBotLang('hi', this)"
          style="font-family: &quot;Noto Sans Devanagari&quot;, sans-serif">
          हिंदी
        </div>
        <div class="chip" onclick="setBotLang('ta', this)" style="font-family: &quot;Noto Sans Tamil&quot;, sans-serif">
          தமிழ்
        </div>
        <div class="chip" onclick="setBotLang('en', this)">English</div>
      </div>
      <!-- Quick chips -->
      <div class="h-scroll" style="margin-bottom: 14px" id="quickChips">
        <div class="chip" onclick="sendQuick('Best crop for my soil?')">
          Best crop for my soil?
        </div>
        <div class="chip" onclick="sendQuick('Leaves turning yellow')">
          Leaves turning yellow
        </div>
        <div class="chip" onclick="sendQuick('PM-KISAN scheme?')">
          PM-KISAN?
        </div>
        <div class="chip" onclick="sendQuick('Mandi prices today')">
          Mandi prices
        </div>
        <div class="chip" onclick="sendQuick('Rain forecast advice')">
          Rain advice
        </div>
      </div>
      <!-- Chat window -->
      <div id="chatWindow" class="glass" style="
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 14px;
            min-height: 200px;
          ">
        <div class="msg-bot">
          👋 Hello! I am BELAI. How can I assist you with farming today?
        </div>
      </div>
      <!-- Input -->
      <div class="glass-sm" style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 14px;
          ">
        <button onclick="startVoice()" style="
              background: none;
              border: none;
              font-size: 22px;
              cursor: pointer;
              flex-shrink: 0;
            " title="Voice">
          🎙️
        </button>
        <input id="chatInput" class="glass-input" placeholder="Type or speak..."
          style="border-radius: 12px; padding: 12px 14px" onkeypress="if (event.key === 'Enter') sendBotMsg();" />
        <button onclick="sendBotMsg()" style="
              width: 44px;
              height: 44px;
              border-radius: 50%;
              background: var(--gold);
              border: none;
              font-size: 18px;
              cursor: pointer;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
          ➤
        </button>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN: BLOCKCHAIN EXPLORER
══════════════════════════════════════════════ -->
  <div id="mod-blockchain" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="closeBlockchainExplorer()">←</button>
      <div class="page-title">⛓️ Blockchain Explorer</div>
      <div class="glass-sm"
        style="padding:6px 10px;font-size:11px;color:#22c55e;font-weight:700;border-color:rgba(34,197,94,0.35);display:flex;align-items:center;gap:5px">
        <span class="live-dot"></span>Live
      </div>
    </div>
    <div class="screen-content" style="padding-top:0">
      <div style="display:flex;gap:10px;margin-bottom:16px;align-items:center">
        <input class="glass-input" id="bcSearchInput" placeholder="🔍 Enter Order ID (e.g. ORD61021)" style="flex:1"
          onkeypress="if(event.key==='Enter')searchBlockchain()" />
        <button class="btn-primary" style="padding:14px 16px;width:auto;flex-shrink:0"
          onclick="searchBlockchain()">Search</button>
      </div>
      <div id="bcOrderBanner" class="glass-sm" style="display:none;padding:12px 16px;margin-bottom:12px">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:10px;color:var(--white40);letter-spacing:0.5px;font-weight:600">ORDER ID</div>
            <div style="font-size:16px;font-weight:700;color:var(--gold)" id="bcOrderIdLabel">—</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:10px;color:var(--white40)">Total Blocks</div>
            <div style="font-size:22px;font-weight:800;color:#22c55e" id="bcBlockCount">0</div>
          </div>
        </div>
      </div>
      <div id="bcStatsRow" style="display:none;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div class="glass-sm" style="padding:10px 14px;flex:1;min-width:120px">
          <div style="font-size:10px;color:var(--white40);font-weight:600;letter-spacing:0.5px">FARMER GETS (75%)</div>
          <div style="font-size:16px;font-weight:800;color:#22c55e" id="bcFarmerShare">₹—</div>
        </div>
        <div class="glass-sm" style="padding:10px 14px;flex:1;min-width:120px">
          <div style="font-size:10px;color:var(--white40);font-weight:600;letter-spacing:0.5px">PLATFORM FEE (25%)</div>
          <div style="font-size:16px;font-weight:800;color:var(--gold)" id="bcPlatformShare">₹—</div>
        </div>
      </div>
      <div id="bcEmpty" class="glass" style="padding:40px;text-align:center;color:var(--white75)">
        <div style="font-size:40px;margin-bottom:12px">⛓️</div>
        <div style="font-size:16px;font-weight:700;color:var(--white);margin-bottom:6px">Blockchain Explorer</div>
        <div style="font-size:13px;line-height:1.6">Enter any Order ID to view its tamper-proof chain.<br />Or tap
          <strong style="color:var(--gold)">🔗 View Blockchain</strong> on any order in Track Produce.
        </div>
      </div>
      <div id="bcChain"></div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  SCREEN 8 — EQUIPMENT MARKET
══════════════════════════════════════════════ -->
  <div id="mod-equip" class="screen">
    <div class="top-bar">
      <button class="back-btn" onclick="goHome()">←</button>
      <div class="page-title">Equipment Market</div>
      <button class="lang-pill" onclick="showLangModal()">🌐</button>
    </div>
    <div class="screen-content" style="padding-top: 0">
      <!-- Hero stats -->
      <div class="glass" style="padding: 20px; margin-bottom: 16px">
        <div style="display: flex; align-items: center; gap: 16px">
          <div>
            <div style="
                  font-size: 56px;
                  font-weight: 800;
                  line-height: 1;
                  color: var(--white);
                ">
              60
            </div>
            <div style="font-size: 13px; color: var(--white75); margin-top: 4px">
              Total Equipment Available
            </div>
            <div style="
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                  margin-top: 12px;
                ">
              <span class="glass-sm" style="padding: 6px 10px; font-size: 12px">🚜 18 Vehicles</span>
              <span class="glass-sm" style="padding: 6px 10px; font-size: 12px">🔧 42 Tools</span>
              <span class="glass-sm" style="padding: 6px 10px; font-size: 12px">💰 ₹150–4000/day</span>
            </div>
          </div>
          <div style="font-size: 72px; opacity: 0.7">🚜</div>
        </div>
      </div>
      <!-- Tabs -->
      <div class="tab-row">
        <div class="chip active" onclick="eqTab('browse', this)">Browse</div>
        <div class="chip" onclick="eqTab('bookings', this)">My Bookings</div>
        <div class="chip" onclick="eqTab('list', this)">List Equipment</div>
      </div>
      <!-- Browse -->
      <div id="eq-browse">
        <div class="h-scroll" style="margin-bottom: 16px" id="eqFilters">
          <div class="chip active" onclick="filterEq('All', this)">All</div>
          <div class="chip" onclick="filterEq('Tractors', this)">
            🚜 Tractors
          </div>
          <div class="chip" onclick="filterEq('Harvesters', this)">
            🌾 Harvesters
          </div>
          <div class="chip" onclick="filterEq('Sprayers', this)">
            💧 Sprayers
          </div>
          <div class="chip" onclick="filterEq('Pumps', this)">⚙️ Pumps</div>
          <div class="chip" onclick="filterEq('Drones', this)">🤖 Drones</div>
        </div>
        <div class="grid-2" id="equipGrid"></div>
      </div>
      <!-- Bookings -->
      <div id="eq-bookings" style="display: none">
        <div id="myBkgList"></div>
      </div>
      <!-- List -->
      <div id="eq-list" style="display: none" class="glass" style="padding: 20px">
        <div style="padding: 20px">
          <div class="sec-label" style="margin-bottom: 16px">
            Create Listing
          </div>
          <input class="glass-input listing-field" id="eqName" placeholder="Equipment name" />
          <select class="glass-input listing-field" id="eqCat">
            <option>Tractor</option>
            <option>Sprayer</option>
            <option>Harvester</option>
            <option>Pump</option>
            <option>Drone</option>
            <option>Seeder</option>
          </select>
          <input class="glass-input listing-field" id="eqPrice" placeholder="₹ Price per day" type="number" />
          <div class="glass-sm" style="
                padding: 16px;
                text-align: center;
                border-style: dashed;
                margin-bottom: 14px;
                cursor: pointer;
              " onclick="showToast('Photo upload ready')">
            <div style="font-size: 24px">📸</div>
            <div style="font-size: 12px; color: var(--white75); margin-top: 4px">
              Upload Equipment Photo
            </div>
          </div>
          <button class="btn-primary" onclick="submitEqListing()">
            Publish Listing
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
  MODALS
══════════════════════════════════════════════ -->
  <!-- Camera modal -->
  <div id="cameraModal" style="
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9000;
        background: rgba(0, 0, 0, 0.85);
        align-items: center;
        justify-content: center;
        padding: 20px;
      ">
    <div class="glass" style="width: 100%; max-width: 500px; padding: 20px">
      <video id="camVideo" autoplay playsinline style="
            width: 100%;
            border-radius: var(--radius-sm);
            background: #000;
            margin-bottom: 14px;
          "></video>
      <div id="zxingOverlay" style="display: none; position: relative">
        <div style="
              position: absolute;
              inset: 0;
              border: 2px solid var(--gold);
              border-radius: 8px;
              animation: pulse 1.5s infinite;
            "></div>
      </div>
      <div style="display: flex; gap: 10px">
        <button id="camCapBtn" class="btn-primary" style="flex: 1; padding: 14px" onclick="capturePhoto()">
          📸 Capture
        </button>
        <button class="btn-outline" style="flex: 0.5" onclick="closeCamera()">
          ✕ Cancel
        </button>
      </div>
    </div>
  </div>
  <!-- Booking modal -->
  <div id="bookingModal" style="
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9000;
        background: rgba(0, 0, 0, 0.8);
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
      ">
    <div class="glass" style="width: 100%; max-width: 500px; padding: 24px" id="bookContent"></div>
  </div>
  <!-- Lang modal -->
  <div id="langModal" style="
        display: none;
        position: fixed;
        inset: 0;
        z-index: 9000;
        background: rgba(0, 0, 0, 0.7);
        align-items: center;
        justify-content: center;
        padding: 20px;
      ">
    <div class="glass" style="width: 100%; max-width: 360px; padding: 24px">
      <div style="
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
          ">
        Select Language
      </div>
      <div class="grid-2" style="gap: 12px">
        <div class="chip" onclick="pickLangModal('kn')"
          style="text-align: center; padding: 16px; justify-content: center">
          ಕನ್ನಡ
        </div>
        <div class="chip" onclick="pickLangModal('te')" style="text-align: center; padding: 16px">
          తెలుగు
        </div>
        <div class="chip" onclick="pickLangModal('hi')" style="text-align: center; padding: 16px">
          हिंदी
        </div>
        <div class="chip" onclick="pickLangModal('ta')" style="text-align: center; padding: 16px">
          தமிழ்
        </div>
        <div class="chip" onclick="pickLangModal('en')" style="text-align: center; padding: 16px; grid-column: 1/-1">
          English
        </div>
      </div>
      <button class="btn-outline" style="width: 100%; margin-top: 16px" onclick="closeLangModal()">
        Cancel
      </button>
    </div>
  </div>

  <!-- Toast + Load -->
  <!-- ════════════════════════════════════════════
  VIDEO CALL OVERLAY (AgriBot only)
════════════════════════════════════════════ -->
  <div id="videoCallOverlay">
    <!-- Status bar top-center -->
    <div class="vc-status-bar">
      <span class="live-dot"></span>
      <span id="vcStatusText">AgriBot AI · Live</span>
      <span class="vc-lang-badge" id="vcLangBadge">EN</span>
    </div>
    <!-- Info bar: weather (left) + order status (right) -->
    <div class="vc-info-bar">
      <div class="vc-card">
        <div class="vc-card-title">🌡️ Weather</div>
        <div class="vc-card-val" id="vcWeatherTemp">—°C</div>
        <div class="vc-card-sub" id="vcWeatherCity">Locating...</div>
      </div>
      <div class="vc-card">
        <div class="vc-card-title">📦 Active Order</div>
        <div class="vc-card-val" id="vcOrderStatus" style="font-size:11px">—</div>
        <div class="vc-card-sub" id="vcOrderId">No active order</div>
      </div>
    </div>
    <!-- Market prices card (mid-right) -->
    <div class="vc-mkt-card">
      <div class="vc-card-title">📊 Live Prices</div>
      <div id="vcPrices" style="font-size:11px;line-height:1.9"></div>
    </div>
    <!-- AI Avatar -->
    <div class="vc-avatar-wrap">
      <div class="vc-ai-orb">
        <div class="vc-ring"></div>
        <div class="vc-ring"></div>
        <div class="vc-ring"></div>
        <div style="font-size:44px;position:relative;z-index:1">🤖</div>
        <div class="vc-speaking-anim" id="vcSpeakAnim"><span></span><span></span><span></span><span></span><span></span>
        </div>
        <div style="font-size:11px;font-weight:700;color:#22c55e;position:relative;z-index:1;margin-top:4px">BELAI Agent
        </div>
      </div>
    </div>
    <!-- PiP farmer camera -->
    <div class="vc-pip" id="vcPip">
      <video id="vcPipVideo" autoplay playsinline muted></video>
    </div>
    <!-- Transcript -->
    <div class="vc-transcript" id="vcTranscript"></div>
    <!-- Controls -->
    <div class="vc-controls">
      <button class="vc-btn" id="vcMuteBtn" onclick="toggleVcMute()" title="Mute">🎙️</button>
      <button class="vc-end-btn" onclick="endVideoCall()" title="End Call">📵</button>
      <button class="vc-btn" id="vcCamBtn" onclick="toggleVcCamera()" title="Camera">📷</button>
    </div>
  </div>
  <div id="toast"></div>
  <div id="loadOverlay">
    <div class="spin"></div>
    <div style="font-size: 14px; color: var(--white75)" id="loadText">
      Loading...
    </div>
  </div>

  <script>
    // ── SCREEN BACKGROUNDS ─────────────────────────────
    const BG = {
      "mod-profile":
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1920&q=80&fit=crop",
      "mod-auth":
        "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1920&q=80&fit=crop",
      splash:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80&fit=crop",
      modsel:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80&fit=crop",
      "mod-supply":
        "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1920&q=80&fit=crop",
      "mod-planner":
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&q=80&fit=crop",
      "mod-disease":
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80&fit=crop",
      "mod-food":
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80&fit=crop",
      "mod-bot":
        "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&q=80&fit=crop",
      "mod-equip":
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1920&q=80&fit=crop",
    };

    // ── MODULE CARDS CONFIG ────────────────────────────
    let MODS = [
      {
        id: "supply",
        name: "Supply & Trading",
        desc: "Find buyers & track produce",
        img: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80&fit=crop",
        icon: "📦",
      },
      {
        id: "planner",
        name: "Crop Planner",
        desc: "AI crop recommendations",
        img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80&fit=crop",
        icon: "🌱",
      },
      {
        id: "disease",
        name: "Disease AI",
        desc: "Detect plant diseases",
        img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80&fit=crop",
        icon: "🔬",
      },
      {
        id: "food",
        name: "Food Safety",
        desc: "Scan & track food quality",
        img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80&fit=crop",
        icon: "🛡",
      },
      {
        id: "bot",
        name: "AgriBot",
        desc: "AI farming assistant",
        img: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&q=80&fit=crop",
        icon: "🤖",
      },
      {
        id: "equip",
        name: "Equipment Market",
        desc: "Rent & list farm equipment",
        img: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=80&fit=crop",
        icon: "🚜",
      },
    ];

    // ── AUTH LOGIC ──────────────────────────────────────
    function switchAuth(mode) {
      document
        .getElementById("tabLogin")
        .classList.toggle("active", mode === "login");
      document
        .getElementById("tabReg")
        .classList.toggle("active", mode === "register");
      document.getElementById("formLogin").style.display =
        mode === "login" ? "" : "none";
      document.getElementById("formReg").style.display =
        mode === "register" ? "" : "none";
      document.getElementById("formForgot").style.display =
        mode === "forgot" ? "" : "none";
    }
    async function doLogin() {
      const email = document.getElementById("authLogEmail").value.trim(),
        pass = document.getElementById("authLogPass").value;
      if (!email || !pass) return showToast("Enter email and password");
      showLoad("Logging in...");
      try {
        const res = await fetch(API_BASE + "/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password: pass }),
        });
        const data = await res.json();
        hideLoad();
        if (data.error)
          return showToast("❌ " + data.error + " — try Forgot Password?");
        localStorage.setItem("belai_user", JSON.stringify(data.user));
        showToast("✅ Login successful!");
        showScreen("splash"); // → language selection
      } catch (e) {
        hideLoad();
        showToast("Login failed — check your connection");
      }
    }
    async function doResetPassword() {
      const email = document.getElementById("authForgotEmail").value.trim();
      const newPass = document.getElementById("authForgotNew").value;
      if (!email || !newPass)
        return showToast("Enter email and new password");
      if (newPass.length < 4)
        return showToast("Password must be at least 4 characters");
      showLoad("Resetting password...");
      try {
        const res = await fetch(API_BASE + "/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword: newPass }),
        });
        const data = await res.json();
        hideLoad();
        if (data.error) return showToast("❌ " + data.error);
        showToast("✅ Password reset! Please login now.");
        document.getElementById("authLogEmail").value = email;
        switchAuth("login");
      } catch (e) {
        hideLoad();
        showToast("Reset failed — check your connection");
      }
    }
    async function doRegister() {
      const name = document.getElementById("authRegName").value.trim(),
        phone = document.getElementById("authRegPhone").value.trim();
      const email = document.getElementById("authRegEmail").value.trim(),
        pass = document.getElementById("authRegPass").value;
      if (!name || !phone || !email || !pass)
        return showToast("Fill all fields");
      showLoad("Registering...");
      try {
        const res = await fetch(API_BASE + "/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, email, password: pass }),
        });
        const data = await res.json();
        hideLoad();
        if (data.error) return showToast(data.error);
        localStorage.setItem("belai_user", JSON.stringify(data.user));
        showToast("✅ Registration successful!");
        showScreen("splash"); // → language selection
      } catch (e) {
        hideLoad();
        showToast("Registration failed");
      }
    }
    function logout() {
      localStorage.removeItem("belai_user");
      showScreen("mod-auth");
    }

    // ── Google Sign-In ────────────────────────────────────
    function initGoogleAuth() {
      if (!window.google || !window.google.accounts) return;
      if (GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') return;

      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
        ux_mode: 'popup',
      });

      // Render standard Google buttons to avoid programmatic click blockers
      const containers = document.querySelectorAll('.google-btn-container');
      containers.forEach(container => {
        google.accounts.id.renderButton(container, {
          theme: "filled_black",
          size: "large",
          shape: "pill",
          width: 280,
          text: "continue_with"
        });
      });
    }

    // Automatically initialize when the script loads or document is ready
    window.onload = () => {
      initGoogleAuth();
      // Fallback initialized attempt
      setTimeout(initGoogleAuth, 1000);
    };
    async function handleGoogleCredential(response) {
      showLoad('Signing in with Google...');
      try {
        const res = await fetch(API_BASE + '/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: response.credential }),
        });
        const data = await res.json();
        hideLoad();
        if (!res.ok || data.error) throw new Error(data.error || 'Google sign-in failed');
        localStorage.setItem('belai_user', JSON.stringify(data.user));
        showToast('🌾 Welcome, ' + data.user.name + '!');
        showScreen('splash');
      } catch (e) {
        hideLoad();
        showToast('❌ ' + e.message);
      }
    }

    // ── LANG TRANSLATIONS ───────────────────────────────
    const MOD_TRANS = {
      kn: [
        "ಪೂರೈಕೆ ಮತ್ತು ವ್ಯಾಪಾರ",
        "ಬೆಳೆ ಯೋಜನೆ",
        "ರೋಗ AI",
        "ಆಹಾರ ಸುರಕ್ಷತೆ",
        "ಅಗ್ರಿಬಾಟ್",
        "ಉಪಕರಣ ಮಾರುಕಟ್ಟೆ",
      ],
      te: [
        "సరఫరా & ట్రేడింగ్",
        "పంట ప్రణాళిక",
        "వ్యాధి AI",
        "ఆహార భద్రత",
        "అగ్రిబాట్",
        "పరికరాల మార్కెట్",
      ],
      hi: [
        "आपूर्ति और व्यापार",
        "फसल योजनाकार",
        "रोग AI",
        "खाद्य सुरक्षा",
        "एग्रीबॉट",
        "उपकरण बाजार",
      ],
      ta: [
        "விநியோகம் மற்றும் வர்த்தகம்",
        "பயிர் திட்டமிடுபவர்",
        "நோய் AI",
        "உணவு பாதுகாப்பு",
        "அக்ரிபாட்",
        "உபகரணங்கள் சந்தை",
      ],
      en: [
        "Supply & Trading",
        "Crop Planner",
        "Disease AI",
        "Food Safety",
        "AgriBot",
        "Equipment Market",
      ],
    };
    function applyTranslations(lang) {
      const titles = MOD_TRANS[lang] || MOD_TRANS["en"];
      MODS.forEach((m, i) => (m.name_local = titles[i]));
      buildModGrid();
    }

    // ── STATE ──────────────────────────────────────────
    let CL = "en",
      CONV_HIST = [],
      BOT_LANG = "kn",
      MY_BOOKINGS = [];
    let FOOD_ITEMS = JSON.parse(localStorage.getItem("belai_food") || "[]");
    let SEL_DIST = "Mysuru",
      SOIL_I = 0,
      SEAS_I = 0,
      RAIN_I = 0,
      GRADE = "A";
    let MY_LISTINGS = [],
      MARKET_PRICES = [],
      ACTIVE_DELIVERIES = [];
    let CAM_STREAM = null,
      CAM_MODE = "";

    // ── NAVIGATION ──────────────────────────────────────
    function showScreen(id) {
      document
        .querySelectorAll(".screen")
        .forEach((s) => s.classList.remove("active"));
      const s = document.getElementById(id);
      if (s) s.classList.add("active");
      const bg = document.getElementById("globalBg");
      if (BG[id]) {
        bg.src = BG[id];
        bg.style.display = "block";
      } else bg.style.display = "none";
      window.scrollTo(0, 0);
    }
    function pickLang(lang, el) {
      localStorage.setItem("belai_lang", lang);
      applyTranslations(lang);
      document
        .querySelectorAll(".lang-card")
        .forEach((c) => c.classList.remove("sel"));
      if (el) el.classList.add("sel");
      CL = lang;
      setTimeout(() => {
        showScreen("modsel");
        buildModGrid();
      }, 400);
    }
    function goHome() {
      showScreen("modsel");
    }
    function openMod(id) {
      showScreen("mod-" + id);
      if (id === "supply") initSupply();
      if (id === "equip") renderEqGrid("All");
      if (id === "food") initFood();
      if (id === "bot") initBot();
      if (id === "planner") initPlanner();
    }
    function buildModGrid() {
      const g = document.getElementById("modGrid");
      if (!g) return;
      g.innerHTML = MODS.map(
        (m) => `
    <div class="mod-card fade-up" onclick="openMod('${m.id}')">
      <img src="${m.img}" alt="${m.name}" style="width:100%;height:60%;object-fit:cover">
      <div style="position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 55%)"></div>
      <div class="mod-foot">
        <div class="mod-name">${m.icon} ${m.name_local || m.name}</div>
        <div class="mod-desc">${m.desc}</div>
      </div>
      <div class="mod-arrow">→</div>
    </div>`,
      ).join("");
    }

    // ── TOAST / LOAD ────────────────────────────────────
    function showToast(msg, dur = 2800) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), dur);
    }
    function showLoad(txt = "Loading...") {
      const o = document.getElementById("loadOverlay");
      o.classList.add("show");
      document.getElementById("loadText").textContent = txt;
    }
    function hideLoad() {
      document.getElementById("loadOverlay").classList.remove("show");
    }

    // ── LANG MODAL ──────────────────────────────────────
    function showLangModal() {
      const m = document.getElementById("langModal");
      m.style.display = "flex";
    }
    function closeLangModal() {
      document.getElementById("langModal").style.display = "none";
    }
    function pickLangModal(l) {
      CL = l;
      closeLangModal();
      showToast("Language updated ✓");
    }

    // ── SUPPLY ──────────────────────────────────────────
    const CROPS_DB = [
      {
        name: "Tomato",
        price: 1200,
        img: "1546094096-0df4bcaaa337",
        dist: "Kolar",
        farmer: "Ramesh K",
        qty: "500 Kg",
        grade: "A",
      },
      {
        name: "Paddy",
        price: 2200,
        img: "1536304993881-ff6e9eefa2a6",
        dist: "Raichur",
        farmer: "Suresh M",
        qty: "2 Ton",
        grade: "A",
      },
      {
        name: "Wheat",
        price: 2700,
        img: "1574323347407-f5e1ad6d020b",
        dist: "Dharwad",
        farmer: "Priya D",
        qty: "1 Quintal",
        grade: "B",
      },
      {
        name: "Maize",
        price: 1900,
        img: "1601593346583-8f43c84e8f78",
        dist: "Davanagere",
        farmer: "Kumar N",
        qty: "300 Kg",
        grade: "A",
      },
      {
        name: "Onion",
        price: 1500,
        img: "1518977956812-cd3dbadaaf31",
        dist: "Chitradurga",
        farmer: "Lakshmi R",
        qty: "800 Kg",
        grade: "B",
      },
      {
        name: "Banana",
        price: 1200,
        img: "1571771894821-ce9b6c11b08e",
        dist: "Chamarajanagar",
        farmer: "Basappa G",
        qty: "200 Kg",
        grade: "A",
      },
      {
        name: "Coffee",
        price: 8000,
        img: "1611854779393-1b2da9d400fe",
        dist: "Chikkamagaluru",
        farmer: "Anand S",
        qty: "100 Kg",
        grade: "A",
      },
      {
        name: "Coconut",
        price: 25,
        img: "1556909114-44e3e70034e2",
        dist: "Tumakuru",
        farmer: "Veena T",
        qty: "5000 units",
        grade: "A",
      },
    ];
    const KARNATAKA_DISTS = [
      "Bagalkot",
      "Ballari",
      "Belagavi",
      "Bengaluru Rural",
      "Bengaluru Urban",
      "Bidar",
      "Chamarajanagar",
      "Chikkaballapur",
      "Chikkamagaluru",
      "Chitradurga",
      "Dakshina Kannada",
      "Davanagere",
      "Dharwad",
      "Gadag",
      "Hassan",
      "Haveri",
      "Kalaburagi",
      "Kodagu",
      "Kolar",
      "Koppal",
      "Mandya",
      "Mysuru",
      "Raichur",
      "Ramanagara",
      "Shivamogga",
      "Tumakuru",
      "Udupi",
      "Uttara Kannada",
      "Vijayapura",
      "Yadgir",
    ];

    function initSupply() {
      renderCrops();
      buildTicker();
      renderBuyGrid();
      renderMPGrid();
      const d = document.getElementById("mpDist");
      if (d)
        d.innerHTML = KARNATAKA_DISTS.map(
          (x) => `<option>${x}</option>`,
        ).join("");
    }
    function supTab(n, el) {
      document.querySelectorAll(".tab-row .chip").forEach((c, i) => {
        c.classList.toggle("active", i === n);
      });
      ["st-0", "st-1", "st-2", "st-3"].forEach((id, i) => {
        const el2 = document.getElementById(id);
        if (el2) el2.style.display = i === n ? "" : "none";
      });
      if (n === 1) renderDeliveries();
      if (n === 2) renderBuyGrid();
      if (n === 3) renderMPGrid();
    }
    function renderCrops(q = "") {
      const g = document.getElementById("cropGrid");
      if (!g) return;
      const items = q ? CROPS_DB.filter(c => c.name.toLowerCase().includes(q.toLowerCase())) : CROPS_DB;
      const trustScores = [98, 94, 87, 96, 91, 99, 93, 88];
      const farmerShares = [82, 76, 88, 71, 85, 79, 83, 77];
      g.innerHTML = items.map((c, i) => {
        const trust = trustScores[i % trustScores.length];
        const share = farmerShares[i % farmerShares.length];
        const delivDate = new Date(Date.now() + (5 + i) * 24 * 3600000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        return `
    <div class="glass-sm" style="overflow:hidden;margin-bottom:10px">
      <img src="https://images.unsplash.com/photo-${c.img}?w=500&q=80&fit=crop" style="width:100%;height:80px;object-fit:cover" loading="lazy">
      <div style="padding:12px">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px">
          <span style="font-weight:700">${c.name}</span>
          <span class="bc-badge">✓ Verified</span>
          <span class="trust-score">⛓ ${trust}/100</span>
        </div>
        <div style="font-size:12px;color:var(--white75)">${c.dist} · ${c.qty}</div>
        <div style="font-size:18px;font-weight:800;color:var(--gold);margin-top:4px">₹${c.price}<span style="font-size:11px;color:var(--white40)">/Kg</span></div>
        <div style="font-size:11px;color:var(--white40);margin-top:8px;margin-bottom:3px">Farmer Share Ratio</div>
        <div class="farmer-bar-wrap"><div class="farmer-bar-fill" style="width:${share}%"></div></div>
        <div style="font-size:10px;color:#22c55e;margin-bottom:8px">${share}% goes directly to the farmer</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <button class="btn-outline" style="flex:1;font-size:10px;padding:6px" onclick="showToast('Calling ${c.farmer}...')">📞 Contact</button>
          <button class="btn-outline" style="flex:1;font-size:10px;padding:6px" onclick="requestDelivery('${c.name}','${c.dist}')">🚚 Order</button>
          <button class="btn-primary" style="flex:1;font-size:10px;padding:6px" onclick="openSmartContract('${c.name}','₹${c.price}/Kg','${c.qty}','${delivDate}')">⛓ Smart Deal</button>
        </div>
      </div>
    </div>`;
      }).join("");
    }
    function filterCrops(q) {
      renderCrops(q);
    }
    function buildTicker() {
      const prices = CROPS_DB.map((c) => `${c.name}: ₹${c.price}/Kg`);
      const t = document.getElementById("priceTicker");
      if (!t) return;
      const txt = [...prices, ...prices]
        .map(
          (p) =>
            `<span style="color:var(--gold);font-weight:600">${p}</span>`,
        )
        .join(
          '<span style="color:rgba(255,255,255,0.3);padding:0 20px">•</span>',
        );
      t.innerHTML = txt;
    }
    function setGrade(el, g) {
      GRADE = g;
      document
        .querySelectorAll("#grA,#grB,#grC")
        .forEach((e) => e.classList.remove("active"));
      el.classList.add("active");
    }
    function submitListing() {
      const name = document.getElementById("lName").value.trim(),
        qty = document.getElementById("lQty").value.trim(),
        price = document.getElementById("lPrice").value.trim();
      if (!name || !qty || !price) {
        showToast("Fill all fields");
        return;
      }
      MY_LISTINGS.push({
        name,
        qty,
        price,
        grade: GRADE,
        time: new Date().toLocaleTimeString(),
      });
      showToast("Listing submitted ✓");
      document.getElementById("lName").value = "";
      document.getElementById("lQty").value = "";
      document.getElementById("lPrice").value = "";
      document.getElementById("myListSection").style.display = "";
      const s = document.getElementById("myListScroll");
      s.innerHTML = MY_LISTINGS.map(
        (l) =>
          `<div class="glass-sm" style="min-width:140px;padding:12px;flex-shrink:0"><div style="font-weight:700">${l.name}</div><div style="font-size:11px;color:var(--white75)">${l.qty} · ₹${l.price} · ${l.grade}</div></div>`,
      ).join("");
    }
    function shareLocation() {
      showLoad("Detecting location...");
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          hideLoad();
          const dist =
            KARNATAKA_DISTS[
            Math.floor(Math.random() * KARNATAKA_DISTS.length)
            ];
          const c = document.getElementById("locCard");
          c.style.display = "";
          c.innerHTML = `<div class="glass-sm" style="padding:12px;font-size:13px"><span class="live-dot" style="margin-right:6px"></span>📍 Location shared: <strong>${dist}</strong></div>`;
          showToast("📍 Location shared!");
        },
        () => {
          hideLoad();
          showToast("Location permission denied");
        },
      );
    }
    function filterBuy(t, el) {
      document
        .querySelectorAll("#buyFilter .chip")
        .forEach((c) => c.classList.remove("active"));
      el.classList.add("active");
      renderBuyGrid(t);
    }
    function renderBuyGrid(filter = "all") {
      const g = document.getElementById("buyGrid");
      if (!g) return;
      const certs = ["Certified Organic", "Natural Farming", "GAP Certified", "Organic Pending", "Certified Organic", "Premium Organic", "Natural Farming", "Certified Organic"];
      g.innerHTML = CROPS_DB.map((c, i) => `
    <div class="glass-sm" style="overflow:hidden">
      <img src="https://images.unsplash.com/photo-${c.img}?w=300&q=80&fit=crop" style="width:100%;height:100px;object-fit:cover" loading="lazy">
      <div style="padding:12px">
        <div style="font-weight:700">${c.name}</div>
        <div style="font-size:11px;color:var(--gold)">${c.dist}</div>
        <div style="font-size:16px;font-weight:800;color:var(--white);margin:6px 0">₹${c.price}<span style="font-size:10px;color:var(--white40)">/Kg</span></div>
        <div style="font-size:10px;color:var(--white75);margin-bottom:8px">👨‍🌾 ${c.farmer} · ${certs[i % certs.length]}</div>
        <button class="btn-outline" style="width:100%;font-size:10px;padding:7px;margin-bottom:6px" onclick="requestDelivery('${c.name}','${c.dist}')">🚚 Request Delivery</button>
        <button class="btn-primary" style="width:100%;font-size:10px;padding:7px" onclick="openProvenance('${c.name}','${c.farmer}','${c.dist}','${c.img}',${i})">📱 QR Scan to Verify</button>
      </div>
    </div>`).join("");
    }
    function requestDelivery(crop, from) {
      const id = "ORD" + Date.now().toString().slice(-5);
      const farmerName = from ? from + ' Farmer' : 'Farmer';
      ACTIVE_DELIVERIES.push({
        id,
        crop,
        from,
        step: 1,
        driver: "Rajesh Kumar",
        phone: "9876543210",
        vehicle: "KA-05 AB 1234",
        eta: 45,
      });
      // Also persist to backend (creates genesis ledger block)
      fetch(API_BASE + "/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cropName: crop, fromDistrict: from, farmerName, amount: 5000 + Math.floor(Math.random() * 3000) }),
      }).catch(() => { });
      showToast("Order " + id + " placed! Track in Track Produce ✓");
    }
    function renderDeliveries() {
      const c = document.getElementById("deliveryCards");
      if (!c) return;
      if (!ACTIVE_DELIVERIES.length) {
        c.innerHTML = '<div class="glass" style="padding:24px;text-align:center;color:var(--white75)">No active deliveries. Order from Buy Products tab.</div>';
        return;
      }
      const chainSteps = [
        { icon: "🌾", label: "Farm Harvested", detail: "Batch sealed & hashed on-chain" },
        { icon: "🏭", label: "Aggregator Received", detail: "Weight verified at APMC node" },
        { icon: "❄️", label: "Cold Storage", detail: "Temp: 4°C · Humidity: 68%" },
        { icon: "🚚", label: "In Transit", detail: "GPS Live · ETA tracking active" },
        { icon: "✅", label: "Delivered", detail: "Signature confirmed on-chain" },
      ];
      const iotTemps = [4.2, 3.8, 4.5, 4.1];
      const iotHumids = [68, 71, 65, 69];
      const iotpH = [6.8, 7.1, 6.5, 6.9];
      c.innerHTML = ACTIVE_DELIVERIES.map((d, di) => {
        const batchId = 4821000 + di * 137;
        const tempVal = iotTemps[di % iotTemps.length];
        const humidVal = iotHumids[di % iotHumids.length];
        const phVal = iotpH[di % iotpH.length];
        const hasTamper = di === 0 && ACTIVE_DELIVERIES.length > 1;
        return `
    <div class="glass" style="padding:20px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div><div style="font-weight:700">${d.crop}</div><div style="font-size:12px;color:var(--gold)">${d.id} · Batch #${batchId}</div></div>
        <div class="glass-sm" style="padding:6px 12px;font-size:12px;color:var(--green-dot)">ETA ${d.eta} min</div>
      </div>
      <div style="font-size:11px;color:var(--white40);font-weight:700;letter-spacing:0.5px;margin-bottom:8px">⛓️ BLOCKCHAIN SUPPLY CHAIN</div>
      ${chainSteps.map((s, i) => {
          const status = i < d.step ? 'done' : i === d.step ? 'active' : 'pending';
          return `<div class="chain-step">
          <div class="chain-dot ${status}">${status === 'done' ? '✓' : status === 'active' ? s.icon : (i + 1)}</div>
          <div style="flex:1">
            <div style="font-size:13px;font-weight:600;color:${status !== 'pending' ? 'var(--white)' : 'var(--white40)'}">${s.label}</div>
            <div style="font-size:11px;color:var(--white40)">${status !== 'pending' ? s.detail : 'Waiting...'}</div>
          </div>
          ${status === 'active' ? '<div style="font-size:18px">🛻</div>' : ''}
        </div>`;
        }).join('')}
      <div style="font-size:11px;color:var(--white40);font-weight:700;letter-spacing:0.5px;margin:14px 0 8px">📡 IoT LIVE DATA (On-Chain Oracle)</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <span class="iot-pill">🌡️ ${tempVal}°C</span>
        <span class="iot-pill">💧 ${humidVal}% RH</span>
        <span class="iot-pill">⚗️ pH ${phVal}</span>
        <span class="iot-pill" style="background:rgba(34,197,94,0.12);border-color:rgba(34,197,94,0.3);color:#22c55e">✓ Chain Valid</span>
      </div>
      ${hasTamper ? `<div class="tamper-alert">
        <div style="font-size:20px">🚨</div>
        <div>
          <div style="font-size:12px;font-weight:700;color:#f87171">Cold Chain Breach Detected</div>
          <div style="font-size:11px;color:var(--white75);margin-top:2px">Temp rose to 12.3°C at <strong>Tumakuru Hub</strong></div>
          <div style="font-size:10px;color:var(--white40);margin-top:2px">⏱ ${new Date(Date.now() - 3600000).toLocaleTimeString('en-IN')} · Block #${batchId - 3}</div>
        </div>
      </div>` : ''}
      <div class="glass-sm" style="padding:12px;margin-top:12px;display:flex;justify-content:space-between;align-items:center">
        <div><div style="font-size:13px;font-weight:600">${d.driver}</div><div style="font-size:11px;color:var(--white75)">${d.vehicle}</div></div>
        <button class="btn-outline" style="padding:8px 14px;font-size:12px" onclick="showToast('Calling driver...')">📞 Call</button>
      </div>
      <div style="display:flex; gap:8px; margin-top:10px">
        <button onclick="toggleTrackMap('${d.id}')" style="flex:1;padding:11px;background:rgba(245,200,66,0.15);border:1px solid rgba(245,200,66,0.45);border-radius:12px;color:var(--gold);font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px">
          📍 Track on Map
        </button>
        <button onclick="openBlockchainExplorer('${d.id}')" style="flex:1;padding:11px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.45);border-radius:12px;color:#22c55e;font-size:12px;font-weight:700;cursor:pointer;font-family:'Inter',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px">
          🔗 View Blockchain
        </button>
      </div>
      <div id="map-container-${d.id}" style="display:none; height:200px; margin-top:12px; border-radius:12px; overflow:hidden"></div>
    </div>`;
      }).join("");
    }
    let TRACKING_MAPS = {};
    function toggleTrackMap(id) {
      const mc = document.getElementById('map-container-' + id);
      if (mc.style.display === "none") {
        mc.style.display = "block";
        if (!TRACKING_MAPS[id]) {
          setTimeout(() => {
            const map = L.map('map-container-' + id).setView([12.9716, 77.5946], 8);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
            const truckIcon = L.divIcon({ html: '<div style="font-size:24px">🚚</div>', className: 'dummy-style', iconSize: [24, 24] });
            const m = L.marker([12.9716 + (Math.random() - 0.5) * 0.5, 77.5946 + (Math.random() - 0.5) * 0.5], { icon: truckIcon }).addTo(map);
            setInterval(() => {
              const pos = m.getLatLng();
              m.setLatLng([pos.lat + (Math.random() - 0.5) * 0.01, pos.lng + (Math.random() - 0.5) * 0.01]);
            }, 2000);
            TRACKING_MAPS[id] = map;
            map.invalidateSize();
          }, 50);
        } else {
          TRACKING_MAPS[id].invalidateSize();
        }
      } else {
        mc.style.display = "none";
      }
    }
    function toggleSharePrice() {
      const f = document.getElementById("sharePriceForm");
      f.style.display = f.style.display === "none" ? "" : "none";
    }
    function toggleMPFilter() {
      showToast("Filter districts ready");
    }
    function submitMarketPrice() {
      const crop = document.getElementById("mpCrop").value.trim(),
        price = document.getElementById("mpPrice").value;
      if (!crop || !price) {
        showToast("Fill crop and price");
        return;
      }
      MARKET_PRICES.push({
        crop,
        price,
        dist: document.getElementById("mpDist").value,
        trend: "up",
      });
      showToast("Price shared ✓");
      renderMPGrid();
    }
    function renderMPGrid() {
      const g = document.getElementById("mpGrid");
      if (!g) return;
      const forecasts = ["+8%", "+3%", "+12%", "-5%", "+6%", "+15%", "+4%", "-2%"];
      const carbons = [12, 8, 15, 6, 11, 22, 9, 7];
      const all = [
        ...CROPS_DB.map((c, i) => ({ crop: c.name, price: c.price, img: c.img, trend: "up", dist: c.dist, forecast: forecasts[i % forecasts.length], carbon: carbons[i % carbons.length] })),
        ...MARKET_PRICES,
      ];
      g.innerHTML = all.map((m, i) => {
        const mandiPrice = Math.round(m.price * 0.82);
        const agroPrice = m.price;
        const maxBar = Math.max(mandiPrice, agroPrice);
        const mandiW = Math.round((mandiPrice / maxBar) * 100);
        const seed = m.price;
        const trendData = Array.from({ length: 8 }, (_, j) => Math.round(seed * (0.82 + ((seed * (j + 1)) % 17) / 55)));
        const maxT = Math.max(...trendData);
        const carbonVal = m.carbon || carbons[i % carbons.length] || 9;
        const forecastVal = m.forecast || forecasts[i % forecasts.length] || "+5%";
        const fcUp = forecastVal.startsWith("+");
        return `
    <div class="glass-sm" style="overflow:hidden">
      ${m.img ? `<img src="https://images.unsplash.com/photo-${m.img}?w=300&q=80&fit=crop" style="width:100%;height:80px;object-fit:cover" loading="lazy">` : ""}
      <div style="padding:12px">
        <div style="font-weight:700">${m.crop}</div>
        <div style="font-size:11px;color:var(--white75);margin-bottom:8px">${m.dist || "Karnataka"}</div>
        <div style="font-size:10px;color:var(--white40);font-weight:600;letter-spacing:0.4px;margin-bottom:6px">MANDI vs AGROCHAIN</div>
        <div class="chart-row"><span style="font-size:10px;color:var(--white40);width:54px;flex-shrink:0">APMC</span><div style="flex:1;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;height:8px"><div class="chart-bar-mandi" style="width:${mandiW}%;height:100%"></div></div><span style="font-size:10px;color:#f87171;margin-left:5px;min-width:38px">₹${mandiPrice}</span></div>
        <div class="chart-row"><span style="font-size:10px;color:var(--white40);width:54px;flex-shrink:0">AgroChain</span><div style="flex:1;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;height:8px"><div class="chart-bar-agro" style="width:100%;height:100%"></div></div><span style="font-size:10px;color:#22c55e;margin-left:5px;min-width:38px">₹${agroPrice}</span></div>
        <div style="font-size:10px;color:var(--white40);font-weight:600;letter-spacing:0.4px;margin:8px 0 4px">30-DAY PRICE TREND</div>
        <div style="display:flex;align-items:flex-end;gap:2px;height:28px;margin-bottom:8px">
          ${trendData.map(v => `<div style="flex:1;border-radius:2px 2px 0 0;height:${Math.max(4, Math.round((v / maxT) * 28))}px;background:${v >= m.price ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.4)"}"></div>`).join("")}
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
          <span class="forecast-badge">${fcUp ? "🤖" : "📉"} 7d: ${forecastVal}</span>
          <div class="carbon-counter"><div style="font-size:10px;color:#22c55e;font-weight:700">🌿 ${carbonVal} Carbon Tokens</div></div>
        </div>
      </div>
    </div>`;
      }).join("");
    }

    // ── CROP PLANNER ────────────────────────────────────
    const SOILS = [
      "Red Loam",
      "Black Cotton",
      "Alluvial",
      "Laterite",
      "Coastal Sandy",
    ];
    const SEASONS = ["Kharif ☀️", "Rabi ❄️", "Zaid 🔥"];
    const RAINS = ["High Rainfall", "Medium Rainfall", "Low Rainfall"];
    const DIST_COORDS = {
      Belagavi: [115, 75],
      Bidar: [355, 85],
      Kalaburagi: [340, 150],
      Vijayapura: [170, 145],
      Raichur: [315, 215],
      Koppal: [260, 195],
      Dharwad: [132, 162],
      Gadag: [188, 188],
      Haveri: [176, 220],
      Bagalkot: [182, 248],
      Davanagere: [212, 270],
      Shivamogga: [162, 290],
      Chitradurga: [254, 288],
      Tumakuru: [248, 352],
      Chikkamagaluru: [148, 322],
      Hassan: [172, 358],
      Bengaluru: [290, 380],
      Kolar: [342, 375],
      Mandya: [215, 392],
      Mysuru: [200, 420],
      Chamarajanagar: [220, 448],
      Kodagu: [160, 390],
      Udupi: [105, 348],
      Dakshina: [115, 390],
      Uttara: [118, 155],
      Yadgir: [350, 185],
      Ballari: [285, 248],
      Ramanagara: [258, 378],
      Chikkaballapur: [312, 355],
      Bengaluru_Rural: [278, 360],
    };

    function initPlanner() {
      buildDistDots();
      filterDists("");
    }
    function buildDistDots() {
      const g = document.getElementById("distDots");
      if (!g) return;
      g.innerHTML = Object.entries(DIST_COORDS)
        .map(
          ([d, [x, y]]) =>
            `<circle class="dd" id="dd-${d}" cx="${x}" cy="${y}" r="6" fill="rgba(245,200,66,0.45)" stroke="rgba(245,200,66,0.8)" stroke-width="1.5" style="cursor:pointer;transition:r .2s" onclick="selectDist('${d.replace(/_/g, " ")}')" onmouseover="this.setAttribute('r','8')" onmouseout="this.setAttribute('r','6')"><title>${d.replace(/_/g, " ")}</title></circle>`,
        )
        .join("");
    }
    function selectDist(d) {
      SEL_DIST = d;
      document.getElementById("distV").textContent = d;
      document
        .querySelectorAll(".dd")
        .forEach((c) => c.setAttribute("fill", "rgba(245,200,66,0.45)"));
      const el = document.getElementById("dd-" + d.replace(/ /g, "_"));
      if (el) el.setAttribute("fill", "var(--gold)");
      showToast("📍 " + d + " selected");
    }
    function cycleSoil() {
      SOIL_I = (SOIL_I + 1) % SOILS.length;
      document.getElementById("soilV").textContent = SOILS[SOIL_I];
    }
    function cycleSeas() {
      SEAS_I = (SEAS_I + 1) % SEASONS.length;
      document.getElementById("seasV").textContent =
        SEASONS[SEAS_I].split(" ")[0];
    }
    function cycleRain() {
      RAIN_I = (RAIN_I + 1) % RAINS.length;
      document.getElementById("rainV").textContent =
        RAINS[RAIN_I].split(" ")[0];
    }
    function toggleDistDrop() {
      const d = document.getElementById("distDrop");
      d.style.display = d.style.display === "none" ? "" : "none";
    }
    function filterDists(q) {
      const p = document.getElementById("distPills");
      if (!p) return;
      const dists = KARNATAKA_DISTS.filter((d) =>
        d.toLowerCase().includes(q.toLowerCase()),
      );
      p.innerHTML = dists
        .map(
          (d) =>
            `<div class="chip" onclick="selectDist('${d}')" style="flex-shrink:0">${d}</div>`,
        )
        .join("");
    }

    async function getRecommendations() {
      const btn = document.getElementById("planBtn");
      btn.disabled = true;
      btn.textContent = "⏳ Analyzing...";
      showLoad("Getting AI recommendations...");
      try {
        const prompt = `District:${SEL_DIST},Soil:${SOILS[SOIL_I]},Season:${SEASONS[SEAS_I]},Rainfall:${RAINS[RAIN_I]}. Return ONLY valid JSON: {"crops":[{"name":"...","yield_per_acre":"...","msp_price":"...","water_need":"Low/Medium/High","growth_days":"...","roi_percent":"...","why":"..."}]} with 5 crops best suited.`;
        const res = await fetch(API_BASE + "/crop-planner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            district: SEL_DIST,
            soil: SOILS[SOIL_I],
            season: SEASONS[SEAS_I],
            rainfall: RAINS[RAIN_I],
          }),
        });
        const data = await res.json();
        hideLoad();
        btn.disabled = false;
        btn.textContent = "✨ Get AI Recommendations";
        if (data.crops) renderCropRec(data.crops);
        else showDemoRec();
      } catch (e) {
        hideLoad();
        btn.disabled = false;
        btn.textContent = "✨ Get AI Recommendations";
        showDemoRec();
      }
    }
    const CROP_IMGS = {
      Tomato: "1546094096-0df4bcaaa337",
      Paddy: "1536304993881-ff6e9eefa2a6",
      Wheat: "1574323347407-f5e1ad6d020b",
      Maize: "1601593346583-8f43c84e8f78",
      Ragi: "1574323347407-f5e1ad6d020b",
      Sugarcane: "1536304993881-ff6e9eefa2a6",
      Cotton: "1601593346583-8f43c84e8f78",
      Sunflower: "1536304993881-ff6e9eefa2a6",
      Groundnut: "1574323347407-f5e1ad6d020b",
    };
    function getCropImg(name) {
      const k = Object.keys(CROP_IMGS).find((c) =>
        name.toLowerCase().includes(c.toLowerCase()),
      );
      return k ? CROP_IMGS[k] : "1500937386664-56d1dfef3854";
    }
    function renderCropRec(crops) {
      const r = document.getElementById("plannerResults");
      r.innerHTML =
        `<div class="sec-label" style="margin-bottom:14px">AI Recommendations for ${SEL_DIST}</div>` +
        crops
          .map(
            (c, i) => `
    <div class="rec-card ${i === 0 ? "best" : ""}">
      ${i === 0 ? `<div style="position:absolute;top:-1px;right:14px;background:var(--gold);color:#000;font-size:10px;font-weight:800;padding:3px 10px;border-radius:0 0 8px 8px">👑 BEST PICK</div>` : ""}
      <img src="https://images.unsplash.com/photo-${getCropImg(c.name)}?w=200&q=80&fit=crop" alt="${c.name}" loading="lazy">
      <div style="flex:1;min-width:0">
        <div style="font-size:16px;font-weight:700">${c.name}</div>
        <div style="font-size:12px;color:var(--gold);margin-top:2px">ROI: ${c.roi_percent}% · ${c.growth_days} days</div>
        <div style="font-size:11px;color:var(--white75);margin-top:4px;line-height:1.4">${c.why}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
          <span class="glass-sm" style="padding:4px 8px;font-size:10px">💧${c.water_need}</span>
          <span class="glass-sm" style="padding:4px 8px;font-size:10px">₹${c.msp_price} MSP</span>
          <span class="glass-sm" style="padding:4px 8px;font-size:10px">🌾${c.yield_per_acre}</span>
        </div>
      </div>
    </div>`,
          )
          .join("");
    }
    function showDemoRec() {
      renderCropRec([
        {
          name: "Tomato",
          roi_percent: 85,
          growth_days: 90,
          why: "High demand in Bengaluru markets. Ideal for red loam soil.",
          water_need: "Medium",
          msp_price: "₹800",
          yield_per_acre: "15-20t",
        },
        {
          name: "Paddy",
          roi_percent: 60,
          growth_days: 120,
          why: "Staple crop suited for kharif season with medium rainfall.",
          water_need: "High",
          msp_price: "₹2183",
          yield_per_acre: "4-5t",
        },
        {
          name: "Maize",
          roi_percent: 70,
          growth_days: 100,
          why: "Good for fodder and food processing industries nearby.",
          water_need: "Medium",
          msp_price: "₹1962",
          yield_per_acre: "5-7t",
        },
        {
          name: "Groundnut",
          roi_percent: 65,
          growth_days: 110,
          why: "Well-suited for red loam. Oil content high.",
          water_need: "Low",
          msp_price: "₹5550",
          yield_per_acre: "2-3t",
        },
        {
          name: "Ragi",
          roi_percent: 55,
          growth_days: 90,
          why: "Drought resistant. Low input cost, high nutritional value.",
          water_need: "Low",
          msp_price: "₹3578",
          yield_per_acre: "2-3t",
        },
      ]);
    }

    // ── DISEASE AI ──────────────────────────────────────
    function openCamera(mode) {
      CAM_MODE = mode;
      const m = document.getElementById("cameraModal");
      m.style.display = "flex";
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          CAM_STREAM = s;
          document.getElementById("camVideo").srcObject = s;
        })
        .catch(() => showToast("Camera access denied"));
    }
    function closeCamera() {
      if (CAM_STREAM) {
        CAM_STREAM.getTracks().forEach((t) => t.stop());
        CAM_STREAM = null;
      }
      document.getElementById("cameraModal").style.display = "none";
    }
    function capturePhoto() {
      const v = document.getElementById("camVideo");
      const c = document.createElement("canvas");
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      c.getContext("2d").drawImage(v, 0, 0);
      const b64 = c.toDataURL("image/jpeg", 0.8);
      closeCamera();
      if (CAM_MODE === "disease") analyzeDisease(b64);
      else if (CAM_MODE === "food") analyzeLabel(b64);
    }
    function handleDiseaseFile(e) {
      const f = e.target.files[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => analyzeDisease(ev.target.result);
      r.readAsDataURL(f);
    }
    async function analyzeDisease(b64) {
      const p = document.getElementById("diseaseProcessing");
      p.querySelector("img").src = b64;
      p.style.display = "";
      document.getElementById("diseaseResults").style.display = "none";
      try {
        const res = await fetch(API_BASE + "/disease", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: b64.slice(0, 2000000) }),
        });
        const data = await res.json();
        const txt = data.choices?.[0]?.message?.content || "";
        const m = txt.match(/\{[\s\S]*\}/);
        p.style.display = "none";
        if (m) showDiseaseResult(JSON.parse(m[0]));
        else showDemoDisease();
      } catch (e) {
        p.style.display = "none";
        showDemoDisease();
      }
    }
    function showDiseaseResult(d) {
      const r = document.getElementById("diseaseResults");
      r.style.display = "";
      r.innerHTML = `
    <div class="glass" style="padding:20px;margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <div style="font-size:18px;font-weight:700">${d.disease_name}</div>
          <div style="font-size:12px;color:var(--white75);font-style:italic">${d.scientific_name}</div>
        </div>
        <div class="glass-sm" style="padding:8px 12px;text-align:center">
          <div style="font-size:24px;font-weight:800;color:var(--gold)">${d.confidence_percent}%</div>
          <div style="font-size:10px;color:var(--white75)">Confidence</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px">
        <span class="glass-sm" style="padding:5px 10px;font-size:11px;color:var(--red)">⚠️ ${d.severity}</span>
        <span class="glass-sm" style="padding:5px 10px;font-size:11px">${d.affected_area_percent}% Affected</span>
      </div>
    </div>
    <div class="glass" style="padding:20px;margin-bottom:14px">
      <div class="sec-label" style="margin-bottom:12px">Treatment Steps</div>
      ${(d.treatment_steps || []).map((s, i) => `<div style="display:flex;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06)"><div style="width:28px;height:28px;border-radius:50%;background:rgba(245,200,66,0.2);border:1px solid var(--gold);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;color:var(--gold)">${i + 1}</div><div style="font-size:13px;line-height:1.5;color:var(--white75)">${s}</div></div>`).join("")}
    </div>
    ${d.pesticides?.length
          ? `<div class="glass" style="padding:20px;margin-bottom:14px">
      <div class="sec-label" style="margin-bottom:12px">Pesticides</div>
      ${d.pesticides.map((p) => `<div class="glass-sm" style="padding:12px;margin-bottom:8px"><div style="font-weight:600">${p.name}</div><div style="font-size:12px;color:var(--white75)">${p.dosage} · ${p.frequency}</div></div>`).join("")}
    </div>`
          : ""
        }`;
      document.getElementById("riskBar").style.width =
        Math.min(d.affected_area_percent * 1.5, 95) + "%";
    }
    function showDemoDisease() {
      showDiseaseResult({
        disease_name: "Early Blight",
        scientific_name: "Alternaria solani",
        confidence_percent: 92,
        severity: "Moderate",
        affected_area_percent: 35,
        cause: "Fungal infection due to high humidity",
        symptoms_observed: "Brown spots with yellow halos on lower leaves",
        treatment_steps: [
          "Remove infected leaves immediately",
          "Apply Mancozeb 2g/L every 7 days",
          "Improve air circulation around plants",
        ],
        pesticides: [
          {
            name: "Mancozeb 75 WP",
            dosage: "2g/L water",
            frequency: "Every 7 days",
          },
          {
            name: "Copper Oxychloride",
            dosage: "3g/L",
            frequency: "Alternate weeks",
          },
        ],
        organic_alternatives: "Neem oil spray 5ml/L every week",
        prevention_tips: "Avoid overhead irrigation; use drip system",
      });
    }

    // ── FOOD SAFETY ──────────────────────────────────────
    let FOOD_CAM_MODE = "";
    function initFood() {
      setInterval(() => {
        const t = new Date().toLocaleTimeString();
        ["ct1", "ct2", "ct3", "ct4"].forEach((id) => {
          const e = document.getElementById(id);
          if (e) e.textContent = t;
        });
      }, 1000);
      renderFoodTracker();
    }
    function startScanner(m) {
      FOOD_CAM_MODE = m;
      if (m === "label") openCamera("food");
      else openBarcodeScanner();
    }
    function openBarcodeScanner() {
      openCamera("food");
      showToast("Point camera at barcode");
    }
    async function analyzeLabel(b64) {
      showLoad("Analyzing label...");
      try {
        const res = await fetch(API_BASE + "/food-label", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: b64.slice(0, 2000000) }),
        });
        const data = await res.json();
        hideLoad();
        if (data.productName) addToTracker(data);
        else showToast("Could not read label");
      } catch (e) {
        hideLoad();
        showToast("Analysis failed");
      }
    }
    function addManualProduct() {
      const name = document.getElementById("fsName").value.trim(),
        brand = document.getElementById("fsBrand").value.trim();
      const mfg = document.getElementById("fsMfg").value,
        exp = document.getElementById("fsExp").value,
        batch = document.getElementById("fsBatch").value.trim();
      if (!name || !exp) {
        showToast("Enter product name and expiry");
        return;
      }
      const days = Math.floor((new Date(exp) - new Date()) / 86400000);
      addToTracker({
        productName: name,
        brand,
        mfgDate: mfg,
        expiryDate: exp,
        batchNo: batch || "N/A",
        daysUntilExpiry: days,
      });
      ["fsName", "fsBrand", "fsMfg", "fsExp", "fsBatch"].forEach((id) => {
        const e = document.getElementById(id);
        if (e) e.value = "";
      });
    }
    function addToTracker(item) {
      FOOD_ITEMS.push(item);
      localStorage.setItem("belai_food", JSON.stringify(FOOD_ITEMS));
      renderFoodTracker();
      showToast(item.productName + " added ✓", 4000);
    }
    function showFoodResult(item) {
      addToTracker(item);
    }
    function renderFoodTracker() {
      const g = document.getElementById("foodTrackerGrid");
      if (!g || !FOOD_ITEMS.length) return;
      g.innerHTML = FOOD_ITEMS.map((f) => {
        const d = f.daysUntilExpiry;
        const color =
          d < 7 ? "var(--red)" : d < 30 ? "#f59e0b" : "var(--green-dot)";
        return `<div class="glass-sm" style="padding:14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-weight:600">${f.productName}</div><div style="font-size:11px;color:var(--white75)">${f.brand || ""}${f.batchNo ? " · Batch:" + f.batchNo : ""}</div><div style="font-size:11px;color:var(--white40);margin-top:2px">Exp: ${f.expiryDate}</div></div>
      <div style="text-align:right"><div style="font-size:20px;font-weight:700;color:${color}">${d}</div><div style="font-size:10px;color:var(--white75)">days left</div></div>
    </div>`;
      }).join("");
    }
    function checkExpiryAlerts() {
      return FOOD_ITEMS.filter((f) => f.daysUntilExpiry < 7).length;
    }

    // ── AGRIBOT ─────────────────────────────────────────
    const BELAI_SYS = {
      en: "You are BELAI, a warm expert agricultural AI for Indian farmers. Give practical advice on crops, diseases, government schemes (PM-Kisan Rs.6000/year, PM Fasal Bima Yojana), Karnataka mandi prices. Use emojis. Keep under 130 words. End with one helpful follow-up question.",
      kn: "Neevu BELAI — Karnataka raitara AI sahayaka. Bele, roga, sarkar yojane bagge advice kodi. Emojis balisiri. 130 padagalige miti. Follow-up prashne madi.",
      te: "Meeru BELAI — Telugu raitulakai AI sahaayakudu. Emojis vaadandi. Follow-up question adugandi.",
      hi: "Main BELAI hoon — Indian kisanon ke liye AI sahayak. Follow-up sawaal karein.",
      ta: "Naan BELAI. Follow-up kelvigal keluungal.",
    };
    function initBot() { }
    function setBotLang(l, el) {
      BOT_LANG = l;
      document
        .querySelectorAll("#mod-bot .chip")
        .forEach((c) => c.classList.remove("active"));
      if (el) el.classList.add("active");
    }
    function sendQuick(q) {
      document.getElementById("chatInput").value = q;
      sendBotMsg();
    }
    async function sendBotMsg() {
      const inp = document.getElementById("chatInput");
      const msg = inp.value.trim();
      if (!msg) return;
      inp.value = "";
      addChatMsg(msg, "user");
      CONV_HIST.push({ role: "user", content: msg });
      const lb = addChatMsg(
        '<div class="dot-bounce"><span></span><span></span><span></span></div>',
        "bot",
      );
      try {
        const res = await fetch(API_BASE + "/agribot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lang: BOT_LANG,
            history: CONV_HIST.slice(-8),
          }),
        });
        const data = await res.json();
        const reply = data.reply || "Unable to respond. Try again.";
        lb.innerHTML = reply;
        CONV_HIST.push({ role: "assistant", content: reply });
      } catch (e) {
        lb.innerHTML = "Connection error. Try again.";
      }
      const cw = document.getElementById("chatWindow");
      cw.scrollTop = cw.scrollHeight;
    }
    function addChatMsg(text, role) {
      const cw = document.getElementById("chatWindow");
      const d = document.createElement("div");
      d.className = role === "user" ? "msg-user" : "msg-bot";
      d.innerHTML = text;
      cw.appendChild(d);
      cw.scrollTop = cw.scrollHeight;
      return d;
    }
    let currentVoiceRec = null;
    function startVoice() {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        showToast("Voice not supported");
        return;
      }
      if (currentVoiceRec) {
        try { currentVoiceRec.stop(); } catch (e) { }
      }
      currentVoiceRec = new SR();
      currentVoiceRec.lang =
        BOT_LANG === "kn" ? "kn-IN" : BOT_LANG === "hi" ? "hi-IN" : BOT_LANG === "te" ? "te-IN" : "en-IN";

      currentVoiceRec.onstart = () => showToast("Listening... (Speak now)");
      currentVoiceRec.onend = () => { currentVoiceRec = null; };

      currentVoiceRec.onresult = (e) => {
        document.getElementById("chatInput").value = e.results[0][0].transcript;
        sendBotMsg();
      };
      currentVoiceRec.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        showToast("Voice error: " + e.error);
      };
      currentVoiceRec.start();
    }

    // ── EQUIPMENT ────────────────────────────────────────
    const EQ_DB = [
      {
        id: 1,
        name: "Mahindra 575 DI Tractor",
        cat: "Tractors",
        price: 1200,
        owner: "Ramesh K",
        dist: "Mysuru",
        img: "1601584115197-04ecc0da31d7",
        avail: true,
      },
      {
        id: 2,
        name: "John Deere 5050D",
        cat: "Tractors",
        price: 1800,
        owner: "Suresh M",
        dist: "Belagavi",
        img: "1568602471122-91175650d5a",
        avail: false,
      },
      {
        id: 3,
        name: "Kubota DC-70 Harvester",
        cat: "Harvesters",
        price: 4000,
        owner: "Priya D",
        dist: "Raichur",
        img: "1574323347407-f5e1ad6d020b",
        avail: true,
      },
      {
        id: 4,
        name: "Power Sprayer 16L",
        cat: "Sprayers",
        price: 300,
        owner: "Kumar N",
        dist: "Dharwad",
        img: "1416879595882-3373a0480b5b",
        avail: true,
      },
      {
        id: 5,
        name: "Honda WB20 Water Pump",
        cat: "Pumps",
        price: 400,
        owner: "Anand S",
        dist: "Tumakuru",
        img: "1542838132-92c53300491e",
        avail: true,
      },
      {
        id: 6,
        name: "DJI Agras T30 Drone",
        cat: "Drones",
        price: 5000,
        owner: "Tech Farm",
        dist: "Bengaluru",
        img: "1625246333195-78d9c38ad449",
        avail: true,
      },
      {
        id: 7,
        name: "Rotavator 7ft",
        cat: "Tillers",
        price: 800,
        owner: "Lakshmi R",
        dist: "Haveri",
        img: "1601584115197-04ecc0da31d7",
        avail: false,
      },
      {
        id: 8,
        name: "Paddy Thresher",
        cat: "Harvesters",
        price: 1500,
        owner: "Basappa G",
        dist: "Mandya",
        img: "1536304993881-ff6e9eefa2a6",
        avail: true,
      },
    ];
    let EQ_CAT = "All",
      BKG_EQ = null,
      BKG_DAYS = 1;

    function eqTab(t, el) {
      document
        .querySelectorAll("#mod-equip .tab-row .chip")
        .forEach((c) => c.classList.remove("active"));
      if (el) el.classList.add("active");
      ["eq-browse", "eq-bookings", "eq-list"].forEach((id) => {
        const e = document.getElementById(id);
        if (e) e.style.display = id === "eq-" + t ? "" : "none";
      });
      if (t === "bookings") renderMyBkgs();
    }
    function filterEq(cat, el) {
      EQ_CAT = cat;
      document
        .querySelectorAll("#eqFilters .chip")
        .forEach((c) => c.classList.remove("active"));
      if (el) el.classList.add("active");
      renderEqGrid(cat);
    }
    function renderEqGrid(cat) {
      const g = document.getElementById("equipGrid");
      if (!g) return;
      const items =
        cat === "All" ? EQ_DB : EQ_DB.filter((e) => e.cat === cat);
      g.innerHTML = items
        .map(
          (e) => `
    <div class="glass-sm eq-card" style="overflow:hidden">
      <img class="eq-img" src="https://images.unsplash.com/photo-${e.img}?w=400&q=80&fit=crop" alt="${e.name}" loading="lazy">
      <div class="eq-body">
        <div style="font-size:14px;font-weight:700;line-height:1.3">${e.name}</div>
        <div style="font-size:11px;color:var(--gold);margin-top:3px">${e.owner} · ${e.dist}</div>
        <div style="font-size:20px;font-weight:800;margin:8px 0">₹${e.price}<span style="font-size:11px;color:var(--white40)">/day</span></div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="${e.avail ? "avail-green" : "avail-red"}">${e.avail ? "● Available" : "● Booked"}</span>
          <button class="btn-outline" style="font-size:11px;padding:7px 12px" onclick="openBooking(${e.id})" ${!e.avail ? 'disabled style="opacity:.5"' : ""}>Book Now</button>
        </div>
      </div>
    </div>`,
        )
        .join("");
    }
    function openBooking(id) {
      BKG_EQ = EQ_DB.find((e) => e.id === id);
      if (!BKG_EQ) return;
      const m = document.getElementById("bookingModal");
      m.style.display = "flex";
      renderBkgModal();
    }
    function renderBkgModal() {
      const m = document.getElementById("bookContent");
      if (!m || !BKG_EQ) return;
      m.innerHTML = `
    <div style="font-size:18px;font-weight:700;margin-bottom:4px">${BKG_EQ.name}</div>
    <div style="font-size:13px;color:var(--white75);margin-bottom:20px">${BKG_EQ.owner} · ${BKG_EQ.dist}</div>
    <div class="glass-sm" style="padding:14px;margin-bottom:16px">
      <div style="font-size:12px;color:var(--gold);margin-bottom:10px">SELECT DURATION</div>
      <div style="display:flex;align-items:center;gap:16px;justify-content:center">
        <button class="btn-outline" style="width:44px;height:44px;border-radius:50%;font-size:20px" onclick="BKG_DAYS=Math.max(1,BKG_DAYS-1);this.parentNode.querySelector('.bkg-days').textContent=BKG_DAYS+' day'+(BKG_DAYS>1?'s':'')">−</button>
        <div style="text-align:center"><div class="bkg-days" style="font-size:28px;font-weight:800">${BKG_DAYS} day</div></div>
        <button class="btn-outline" style="width:44px;height:44px;border-radius:50%;font-size:20px" onclick="BKG_DAYS=Math.min(30,BKG_DAYS+1);this.parentNode.querySelector('.bkg-days').textContent=BKG_DAYS+' day'+(BKG_DAYS>1?'s':'')">+</button>
      </div>
    </div>
    <div class="glass-sm" style="padding:14px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center">
      <div style="font-size:14px;color:var(--white75)">Total Cost</div>
      <div style="font-size:24px;font-weight:800;color:var(--gold)">₹${BKG_EQ.price} × ${BKG_DAYS} days</div>
    </div>
    <input class="glass-input" id="bkgName" placeholder="Your name" style="margin-bottom:10px">
    <input class="glass-input" id="bkgPhone" placeholder="Phone number" style="margin-bottom:16px">
    <div style="display:flex;gap:10px">
      <button class="btn-primary" style="flex:2" onclick="confirmBooking()">✓ Confirm Booking</button>
      <button class="btn-outline" style="flex:1" onclick="document.getElementById('bookingModal').style.display='none'">Cancel</button>
    </div>`;
    }
    function confirmBooking() {
      const name = document.getElementById("bkgName")?.value.trim(),
        phone = document.getElementById("bkgPhone")?.value.trim();
      if (!name || !phone) {
        showToast("Enter name and phone");
        return;
      }
      MY_BOOKINGS.push({
        eq: BKG_EQ.name,
        days: BKG_DAYS,
        total: BKG_EQ.price * BKG_DAYS,
        name,
        phone,
        status: "Confirmed",
        id: "BK" + Date.now().toString().slice(-4),
      });
      document.getElementById("bookingModal").style.display = "none";
      showToast("Booking confirmed! ✓ Check My Bookings");
    }
    function renderMyBkgs() {
      const c = document.getElementById("myBkgList");
      if (!c) return;
      if (!MY_BOOKINGS.length) {
        c.innerHTML =
          '<div class="glass" style="padding:24px;text-align:center;color:var(--white75)">No bookings yet. Browse and book equipment!</div>';
        return;
      }
      c.innerHTML = MY_BOOKINGS.map(
        (b) =>
          `<div class="glass-sm" style="padding:16px;margin-bottom:12px"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><div style="font-weight:700">${b.eq}</div><span class="avail-green">● ${b.status}</span></div><div style="font-size:12px;color:var(--white75)">${b.days} day(s) · ${b.name} · ${b.phone}</div><div style="font-size:16px;font-weight:700;color:var(--gold);margin-top:6px">₹${b.total} total · ID: ${b.id}</div></div>`,
      ).join("");
    }
    function submitEqListing() {
      const n = document.getElementById("eqName")?.value.trim(),
        p = document.getElementById("eqPrice")?.value;
      if (!n || !p) {
        showToast("Fill name and price");
        return;
      }
      showToast("Equipment listed ✓");
      document.getElementById("eqName").value = "";
      document.getElementById("eqPrice").value = "";
    }

    // ── PROFILE ─────────────────────────────────────────────────────

    let QUERY_TAB = "received";
    let QUERIES_DB = JSON.parse(
      localStorage.getItem("belai_queries") || "[]",
    );

    function initProfile() {
      const raw = localStorage.getItem("belai_user");
      if (!raw) return;
      const u = JSON.parse(raw);
      const profile = JSON.parse(
        localStorage.getItem("belai_profile") || "{}",
      );

      // Set display fields
      document.getElementById("profileDisplayName").textContent =
        profile.name || u.name || "Farmer";
      document.getElementById("profileDisplayVillage").textContent =
        profile.village || "—";
      document.getElementById("profileDisplayPhone").textContent =
        profile.phone || u.phone || "—";
      document.getElementById("profileDisplayBio").textContent =
        profile.bio || "Tap Edit to add a short bio.";

      // Avatar
      if (profile.avatar) {
        document.getElementById("profileAvatar").src = profile.avatar;
      } else {
        const initials = (u.name || "U").slice(0, 2).toUpperCase();
        document.getElementById("profileAvatar").src =
          "https://api.dicebear.com/7.x/initials/svg?seed=" +
          encodeURIComponent(initials) +
          "&backgroundColor=2d6a4f";
      }

      // Google badge vs connect button
      const gSection = document.getElementById("googleSection");
      if (profile.googleLinked) {
        gSection.innerHTML =
          '<div class="google-connected-badge"><svg width="16" height="16" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.566 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H1.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H1.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l2.007-1.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 1.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>✅ Google Connected <span style="color:rgba(255,255,255,0.5);font-size:11px;margin-left:4px">(' +
          profile.googleEmail +
          ")</span></div>";
      }

      // Render queries
      switchQueryTab(QUERY_TAB);
    }

    function toggleProfileEdit() {
      const form = document.getElementById("profileEditForm");
      const visible = form.style.display !== "none";
      if (!visible) {
        // Pre-fill with current values
        const profile = JSON.parse(
          localStorage.getItem("belai_profile") || "{}",
        );
        const user = JSON.parse(localStorage.getItem("belai_user") || "{}");
        document.getElementById("editName").value =
          profile.name || user.name || "";
        document.getElementById("editVillage").value = profile.village || "";
        document.getElementById("editPhone").value =
          profile.phone || user.phone || "";
        document.getElementById("editBio").value = profile.bio || "";
        updateBioCount();
      }
      form.style.display = visible ? "none" : "";
      document.getElementById("profileEditBtn").textContent = visible
        ? "✏️ Edit"
        : "✕ Close";
    }

    function updateBioCount() {
      const v = (document.getElementById("editBio") || {}).value || "";
      const el = document.getElementById("bioCharCount");
      if (el) el.textContent = v.length + "/150";
    }

    function saveProfile() {
      const profile = JSON.parse(
        localStorage.getItem("belai_profile") || "{}",
      );
      profile.name = document.getElementById("editName").value.trim();
      profile.village = document.getElementById("editVillage").value.trim();
      profile.phone = document.getElementById("editPhone").value.trim();
      profile.bio = document.getElementById("editBio").value.trim();

      localStorage.setItem("belai_profile", JSON.stringify(profile));
      toggleProfileEdit();
      initProfile();
      showToast("Profile updated ✓");
    }

    function uploadAvatar(input) {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const profile = JSON.parse(
          localStorage.getItem("belai_profile") || "{}",
        );
        profile.avatar = e.target.result;
        localStorage.setItem("belai_profile", JSON.stringify(profile));
        document.getElementById("profileAvatar").src = e.target.result;
        showToast("Photo updated ✓");
      };
      reader.readAsDataURL(file);
    }

    function linkGoogle() {
      // Simulate OAuth link (real Google OAuth needs server-side client ID)
      const profile = JSON.parse(
        localStorage.getItem("belai_profile") || "{}",
      );
      profile.googleLinked = true;
      profile.googleEmail =
        JSON.parse(localStorage.getItem("belai_user") || "{}").email ||
        "user@gmail.com";
      localStorage.setItem("belai_profile", JSON.stringify(profile));
      initProfile();
      showToast("Google account linked ✓");
    }

    // ── QUERIES ─────────────────────────────────────────────────
    function switchQueryTab(tab) {
      QUERY_TAB = tab;
      ["received", "mine"].forEach((t) => {
        document
          .getElementById("tab-" + t)
          ?.classList.toggle("active", t === tab);
      });
      renderQueries();
    }

    function renderQueries() {
      const list = document.getElementById("queriesList");
      if (!list) return;
      const userId =
        JSON.parse(localStorage.getItem("belai_user") || "{}").id || "me";
      const data = (tab) =>
        QUERIES_DB.filter((q) =>
          tab === "mine" ? q.authorId === userId : q.authorId !== userId,
        );
      const queries = data(QUERY_TAB);

      if (!queries.length) {
        list.innerHTML =
          '<div style="text-align:center;padding:40px;color:rgba(255,255,255,0.4)">' +
          (QUERY_TAB === "mine"
            ? "You have not posted any queries yet."
            : "No queries from others yet.") +
          "</div>";
        return;
      }

      list.innerHTML = queries
        .map(
          (q, i) => `
    <div class="query-card">
      <div class="query-card-head">
        <img class="query-user-avatar"
          src="https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(q.authorName || "U")}&backgroundColor=2d6a4f"
          alt="avatar">
        <div>
          <div style="font-size:14px;font-weight:600;color:var(--white)">${q.authorName || "Farmer"}</div>
          <div style="font-size:12px;color:rgba(255,255,255,0.5)">📍 ${q.village || "Unknown"}</div>
        </div>
        <div style="margin-left:auto;font-size:11px;color:rgba(255,255,255,0.4)">${timeAgo(q.time)}</div>
      </div>
      <div class="query-title">${q.title}</div>
      <div class="query-desc">${q.desc}</div>
      <div class="query-meta">
        <span>💬 ${(q.replies || []).length} replies</span>
      </div>
      <div id="replyBox-${i}" style="display:none" class="reply-box">
        <textarea rows="2" placeholder="Type your reply..." id="replyText-${i}"></textarea>
        <button class="btn-primary" style="margin-top:8px;padding:8px 16px;font-size:13px"
          onclick="submitReply(${i})">Send Reply →</button>
      </div>
      ${QUERY_TAB === "received"
              ? `
        <button class="btn-outline" style="margin-top:10px;font-size:12px;padding:6px 14px"
          onclick="toggleReplyBox(${i})">💬 Reply / Interact</button>
      `
              : ""
            }
    </div>
  `,
        )
        .join("");
    }

    function toggleReplyBox(i) {
      const box = document.getElementById("replyBox-" + i);
      if (box) box.style.display = box.style.display === "none" ? "" : "none";
    }

    function submitReply(i) {
      const userId =
        JSON.parse(localStorage.getItem("belai_user") || "{}").id || "me";
      const profile = JSON.parse(
        localStorage.getItem("belai_profile") || "{}",
      );
      const text = (
        document.getElementById("replyText-" + i) || {}
      ).value?.trim();
      if (!text) return showToast("Please type a reply first");
      const queries = QUERIES_DB.filter((q) => q.authorId !== userId);
      const q = queries[i];
      if (!q) return;
      const qIdx = QUERIES_DB.indexOf(q);
      if (!QUERIES_DB[qIdx].replies) QUERIES_DB[qIdx].replies = [];
      QUERIES_DB[qIdx].replies.push({
        from: profile.name || "You",
        text,
        time: Date.now(),
      });
      localStorage.setItem("belai_queries", JSON.stringify(QUERIES_DB));
      renderQueries();
      showToast("Reply sent ✓");
    }

    function openNewQueryModal() {
      const m = document.getElementById("newQueryModal");
      if (m) {
        m.style.display = "flex";
      }
    }

    function closeNewQueryModal() {
      const m = document.getElementById("newQueryModal");
      if (m) m.style.display = "none";
    }

    function submitQuery() {
      const title = document.getElementById("queryTitle")?.value?.trim();
      const desc = document.getElementById("queryDesc")?.value?.trim();
      if (!title || !desc) return showToast("Fill in both fields");
      const user = JSON.parse(localStorage.getItem("belai_user") || "{}");
      const profile = JSON.parse(
        localStorage.getItem("belai_profile") || "{}",
      );
      const newQ = {
        title,
        desc,
        authorId: user.id || "me",
        authorName: profile.name || user.name || "Farmer",
        village: profile.village || "—",
        time: Date.now(),
        replies: [],
      };
      QUERIES_DB.push(newQ);
      localStorage.setItem("belai_queries", JSON.stringify(QUERIES_DB));
      document.getElementById("queryTitle").value = "";
      document.getElementById("queryDesc").value = "";
      closeNewQueryModal();
      switchQueryTab("mine");
      showToast("Query posted ✓");
    }

    function timeAgo(ts) {
      const diff = Date.now() - ts;
      const m = Math.floor(diff / 60000);
      if (m < 1) return "just now";
      if (m < 60) return m + " min ago";
      if (m < 1440) return Math.floor(m / 60) + " hr ago";
      return Math.floor(m / 1440) + " days ago";
    }

    // ── INIT ──────────────────────────────────────────────
    window.addEventListener("load", () => {
      // Always start from login screen every time the app loads
      showScreen("mod-auth");

      if ("serviceWorker" in navigator)
        navigator.serviceWorker
          .register("/service-worker.js")
          .catch(() => { });
    });