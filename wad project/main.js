const BASE_URL = "http://localhost:5000/api";
console.log("✅ main.js v3 loaded");
let userProfile = { skills: [], interests: [], branch: "", year: "", college: "" };

async function fetchUserProfile() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  try {
    const res = await fetch(`${BASE_URL}/profile/${userId}`);
    if (res.ok) {
      userProfile = await res.json();
      window._userProfile = userProfile;
      updateUIWithProfile(userProfile);
      // Reload recommendations with this user's skills/interests
      loadOpportunities("All", "", "Ongoing");
      // Update badges with personalized counts
      updateNavBadges();
    }
  } catch (e) { console.log("Profile fetch failed", e); }
}

function updateUIWithProfile(p) {
  const nameEl   = document.querySelector(".user-name");
  const roleEl   = document.querySelector(".user-role");
  const heroEl   = document.querySelector(".hero-text h2");
  const heroSubEl= document.querySelector(".hero-text p");
  const avatarEl = document.querySelector(".avatar");

  if (nameEl && p.name)   nameEl.textContent = p.name.split(" ")[0] + " " + (p.name.split(" ")[1]?.[0] || "") + ".";
  if (roleEl && p.branch) roleEl.textContent = p.branch + (p.year ? " • Year " + p.year : "");
  if (heroEl && p.name)   heroEl.textContent = "Welcome back, " + p.name.split(" ")[0] + "! 👋";
  if (avatarEl && p.name) avatarEl.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(p.name) + "&background=8b5cf6&color=fff";

  // Personalized hero subtitle
  if (heroSubEl) {
    const hasProfile = p.skills?.length || p.interests?.length;
    if (hasProfile) {
      const domains = [...(p.skills||[]), ...(p.interests||[])].slice(0,3).join(", ");
      heroSubEl.textContent = "Showing opportunities matched to your skills: " + domains + " 🎯";
    } else {
      heroSubEl.textContent = "Complete your profile to get personalized recommendations!";
    }
  }
}

const deadlines = [
  { id:1, title:"Google SWE Intern",          company:"Google",       daysLeft:2  },
  { id:2, title:"Global AI Hackathon",         company:"Devpost",      daysLeft:5  },
  { id:3, title:"Microsoft Learn Ambassador",  company:"Microsoft",    daysLeft:12 },
  { id:4, title:"Goldman Sachs Analyst",       company:"Goldman Sachs",daysLeft:14 }
];

document.addEventListener("DOMContentLoaded", () => {

  // ── Intro ──────────────────────────────────────────────────────
  const introOverlay  = document.getElementById("intro-overlay");
  const authContainer = document.getElementById("auth-container");

  setTimeout(() => {
    introOverlay.style.opacity = "0";
    authContainer.classList.remove("hidden");
    setTimeout(() => { authContainer.classList.add("visible"); }, 50);
    setTimeout(() => { introOverlay.remove(); }, 800);
  }, 1500);

  // ── Auth ───────────────────────────────────────────────────────
  const authForm      = document.getElementById("auth-form");
  const authTitle     = document.getElementById("auth-title");
  const authSubtitle  = document.getElementById("auth-subtitle");
  const authSubmitBtn = document.getElementById("auth-submit-btn");
  const authToggleLink= document.getElementById("auth-toggle-link");
  const authToggleText= document.getElementById("auth-toggle-text");
  const nameGroup     = document.getElementById("name-group");
  const nameInput     = document.getElementById("name-input");
  let isLogin = true;

  authToggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Reset profile state when switching auth mode
    userProfile = { skills: [], interests: [], branch: "", year: "", college: "" };
    window._userProfile = null;
    isLogin = !isLogin;
    if (isLogin) {
      authTitle.textContent     = "Welcome back";
      authSubtitle.textContent  = "Login to find your next opportunity.";
      authSubmitBtn.textContent = "Login";
      authToggleText.textContent= "Don't have an account?";
      authToggleLink.textContent= "Sign Up";
      nameGroup.classList.add("hidden");
      nameInput.removeAttribute("required");
    } else {
      authTitle.textContent     = "Create Account";
      authSubtitle.textContent  = "Sign up to start tracking opportunities.";
      authSubmitBtn.textContent = "Sign Up";
      authToggleText.textContent= "Already have an account?";
      authToggleLink.textContent= "Login";
      nameGroup.classList.remove("hidden");
      nameInput.setAttribute("required", "true");
    }
  });

  authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email    = authForm.querySelector("input[type='email']").value;
    const password = authForm.querySelector("input[type='password']").value;
    const name     = nameInput.value;

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const body     = isLogin ? { email, password } : { name, email, password };
      const response = await fetch(BASE_URL + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (response.ok) {
        // ── Reset everything for fresh session ──
        userProfile = { skills: [], interests: [], branch: "", year: "", college: "" };
        window._userProfile = null;
        localStorage.setItem("userId", data._id);

        document.getElementById("auth-container").classList.add("hidden");
        const app = document.getElementById("app");
        app.classList.remove("hidden");
        app.style.display  = "flex";
        app.style.opacity  = "1";

        // Reset UI to defaults before fetching new profile
        const nameEl   = document.querySelector(".user-name");
        const roleEl   = document.querySelector(".user-role");
        const heroEl   = document.querySelector(".hero-text h2");
        const avatarEl = document.querySelector(".avatar");
        if (nameEl)   nameEl.textContent   = data.name ? data.name.split(" ")[0] + " " + (data.name.split(" ")[1]?.[0] || "") + "." : "User";
        if (roleEl)   roleEl.textContent   = "Student";
        if (heroEl)   heroEl.textContent   = "Welcome back, " + (data.name ? data.name.split(" ")[0] : "there") + "! 👋";
        if (avatarEl) avatarEl.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.name || "User") + "&background=8b5cf6&color=fff";

        await fetchUserProfile(); // fetch THIS user's profile
        renderDeadlines();

        document.querySelectorAll(".status-tab").forEach(s => s.classList.remove("active"));
        const liveTab = document.querySelector(".status-tab[data-status='Ongoing']");
        if (liveTab) liveTab.classList.add("active");
        loadOpportunities("All", "", "Ongoing");
        initFilterTabs();
        updateNavBadges();

        // MY SPACE and notification handled by inline onclick in HTML
      } else {
        alert(data.message || "Error ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    }
  });

  // ── Theme ──────────────────────────────────────────────────────
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle.querySelector("i");
  if (localStorage.getItem("theme") === "light") {
    document.documentElement.classList.add("light-mode");
    icon.className = "bx bx-moon";
  }
  themeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("light-mode");
    const isLight = document.documentElement.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
    icon.className = isLight ? "bx bx-moon" : "bx bx-sun";
  });

  // ── Chatbot ────────────────────────────────────────────────────
  const chatbotFab     = document.getElementById("chatbot-fab");
  const chatWindow     = document.getElementById("chat-window");
  const closeChatBtn   = document.getElementById("close-chat");
  const chatForm       = document.getElementById("chat-form");
  const chatInputField = document.getElementById("chat-input-field");
  const chatMessages   = document.getElementById("chat-messages");

  // ── Smart Chatbot with conversation flow ──────────────────────
  let chatState = { step: "idle", tempProfile: {} };

  chatbotFab.addEventListener("click", () => {
    chatWindow.classList.remove("hidden");
    setTimeout(() => {
      chatWindow.classList.add("visible");
      chatInputField.focus();
      // Show welcome message if first open
      if (chatMessages.children.length <= 1) {
        const name = userProfile.name ? userProfile.name.split(" ")[0] : "there";
        addAIMessage("Hey " + name + "! 👋 I'm your OpportunityOS AI. I can help you find the best opportunities and update your recommendations.\n\nShall I ask you a few quick questions to personalize your feed? (yes/no)");
        chatState.step = "ask_personalize";
      }
    }, 10);
  });

  closeChatBtn.addEventListener("click", () => {
    chatWindow.classList.remove("visible");
    setTimeout(() => { chatWindow.classList.add("hidden"); }, 300);
  });

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInputField.value.trim();
    if (!text) return;
    addUserMessage(text);
    chatInputField.value = "";
    await handleChatMessage(text.toLowerCase());
  });

  function addUserMessage(text) {
    const msg = document.createElement("div");
    msg.className = "message msg-user";
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addAIMessage(text, quickReplies) {
    const msg = document.createElement("div");
    msg.className = "message msg-ai";
    msg.style.cssText = "white-space:pre-line;";
    msg.textContent = text;
    chatMessages.appendChild(msg);

    if (quickReplies && quickReplies.length) {
      const qr = document.createElement("div");
      qr.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;";
      quickReplies.forEach(r => {
        const btn = document.createElement("button");
        btn.textContent = r;
        btn.style.cssText = "background:rgba(139,92,246,0.15);color:#a78bfa;border:1px solid rgba(139,92,246,0.3);padding:0.3rem 0.8rem;border-radius:99px;font-size:0.78rem;cursor:pointer;font-family:'Outfit',sans-serif;";
        btn.onclick = () => {
          addUserMessage(r);
          chatInputField.value = "";
          handleChatMessage(r.toLowerCase());
        };
        qr.appendChild(btn);
      });
      chatMessages.appendChild(qr);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleChatMessage(text) {
    // Conversation flow
    if (chatState.step === "ask_personalize") {
      if (text.includes("yes") || text.includes("sure") || text.includes("ok") || text.includes("yeah")) {
        chatState.step = "ask_branch";
        addAIMessage("Great! 🎯 What's your branch/stream?", ["CSE", "ECE", "Mechanical", "MBA", "Data Science", "Other"]);
      } else {
        chatState.step = "idle";
        addAIMessage("No problem! You can ask me anything about internships, hackathons, scholarships, or competitions. What are you looking for? 🔍", ["Internships", "Hackathons", "Scholarships", "Competitions"]);
      }
      return;
    }

    if (chatState.step === "ask_branch") {
      chatState.tempProfile.branch = text;
      chatState.step = "ask_year";
      addAIMessage("Got it! 📚 Which year are you in?", ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"]);
      return;
    }

    if (chatState.step === "ask_year") {
      chatState.tempProfile.year = text.replace(/[^0-9]/g, "") || "PG";
      chatState.step = "ask_skills";
      addAIMessage("Nice! 💻 What are your technical skills? (e.g. React, Python, Java, ML)", ["React, JavaScript", "Python, ML", "Java, Spring Boot", "C++, DSA", "Data Science, SQL"]);
      return;
    }

    if (chatState.step === "ask_skills") {
      chatState.tempProfile.skills = text.split(/[,\s]+/).filter(Boolean);
      chatState.step = "ask_interests";
      addAIMessage("Awesome! 🚀 What domains interest you most?", ["AI/ML", "Web Dev", "Blockchain", "Data Science", "Cloud", "Mobile Dev"]);
      return;
    }

    if (chatState.step === "ask_interests") {
      chatState.tempProfile.interests = text.split(/[,\s]+/).filter(Boolean);
      chatState.step = "ask_type";
      addAIMessage("Almost done! 🎯 What type of opportunity are you looking for?", ["Internship", "Hackathon", "Scholarship", "Competition", "All of them"]);
      return;
    }

    if (chatState.step === "ask_type") {
      chatState.tempProfile.preferredType = text;
      chatState.step = "idle";

      // Update profile with collected data
      const userId = localStorage.getItem("userId");
      if (userId && (chatState.tempProfile.skills || chatState.tempProfile.interests)) {
        try {
          const payload = {
            skills:    chatState.tempProfile.skills    || userProfile.skills    || [],
            interests: chatState.tempProfile.interests || userProfile.interests || [],
            branch:    chatState.tempProfile.branch    || userProfile.branch    || "",
            year:      chatState.tempProfile.year      || userProfile.year      || "",
            college:   userProfile.college || "",
          };
          const res = await fetch(BASE_URL + "/profile/" + userId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            userProfile = await res.json();
            window._userProfile = userProfile;
            updateUIWithProfile(userProfile);
          }
        } catch(e) { console.log("Profile update failed", e); }
      }

      // Reload recommendations
      const type = text.includes("internship") ? "Internship" :
                   text.includes("hackathon")  ? "Hackathon"  :
                   text.includes("scholarship")? "Scholarship":
                   text.includes("competition")? "Competitions": "All";

      if (window.loadOpportunities) loadOpportunities(type, "", "Ongoing");
      else if (window.fetchAndDisplay) fetchAndDisplay(type, "Ongoing");

      updateNavBadges();

      addAIMessage(
        "✅ Perfect! I've updated your profile and refreshed your recommendations!\n\n" +
        "🎯 Skills: " + (chatState.tempProfile.skills||[]).join(", ") + "\n" +
        "💡 Interests: " + (chatState.tempProfile.interests||[]).join(", ") + "\n\n" +
        "Your feed now shows the best " + (type === "All" ? "opportunities" : type + "s") + " matched to your profile! Check the cards — they're sorted by match score just for you 🚀",
        ["Show Internships", "Show Hackathons", "Show Scholarships"]
      );
      chatState.tempProfile = {};
      return;
    }

    // Quick reply shortcuts
    if (text === "show internships" || text === "internships") {
      if (window.loadOpportunities) loadOpportunities("Internship", "", "Ongoing");
      addAIMessage("Showing internships matched to your profile! 💼 Check the cards on the right.", ["Live Now", "Upcoming", "Closed"]);
      return;
    }
    if (text === "show hackathons" || text === "hackathons") {
      if (window.loadOpportunities) loadOpportunities("Hackathon", "", "Ongoing");
      addAIMessage("Showing hackathons matched to your profile! ⚡ Check the cards.", ["Live Now", "Upcoming", "Closed"]);
      return;
    }
    if (text === "show scholarships" || text === "scholarships") {
      if (window.loadOpportunities) loadOpportunities("Scholarship", "", "Ongoing");
      addAIMessage("Showing scholarships matched to your profile! 🎓 Check the cards.", ["Live Now", "Upcoming", "Closed"]);
      return;
    }
    if (text === "live now") {
      const activeFilter = document.querySelector(".filter-tab.active");
      const type = activeFilter ? (activeFilter.dataset.type || "All") : "All";
      if (window.loadOpportunities) loadOpportunities(type, "", "Ongoing");
      addAIMessage("Showing live opportunities! 🟢");
      return;
    }
    if (text === "upcoming") {
      const activeFilter = document.querySelector(".filter-tab.active");
      const type = activeFilter ? (activeFilter.dataset.type || "All") : "All";
      if (window.loadOpportunities) loadOpportunities(type, "", "Upcoming");
      addAIMessage("Showing upcoming opportunities! 🔵");
      return;
    }
    if (text === "update my profile" || text === "change skills") {
      chatState.step = "ask_branch";
      addAIMessage("Sure! Let's update your profile. What's your branch?", ["CSE", "ECE", "MBA", "Data Science"]);
      return;
    }

    // Default: send to backend AI
    try {
      const data = await sendMessage(text);
      addAIMessage(data.reply, ["Update my profile", "Show Internships", "Show Hackathons"]);
    } catch(e) {
      addAIMessage("Sorry, I couldn't connect to the server. Try again! 🔄");
    }
  }

  // ── Filter tabs — initialized after login via initFilterTabs() ─
  // ── Hamburger ──────────────────────────────────────────────────
  const hamburger      = document.getElementById("hamburger");
  const sidebar        = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      sidebarOverlay.classList.toggle("open");
    });
    sidebarOverlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      sidebarOverlay.classList.remove("open");
    });
  }

  // ── Sidebar nav handled by inline onclick in HTML ─────────────

  // ── Profile link ───────────────────────────────────────────────
  const profileNavLink = document.getElementById("profile-nav-link");
  if (profileNavLink) {
    profileNavLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openProfileModal();
    });
  }

  // Notification bell handled by inline onclick showNotifications() in HTML
  const searchInput = document.querySelector(".search-bar input");
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const activeTab = document.querySelector(".filter-tab.active");
        let q = activeTab ? activeTab.textContent.trim() : "All";
        if (q === "Internships")  q = "Internship";
        if (q === "Hackathons")   q = "Hackathon";
        if (q === "Scholarships") q = "Scholarship";
        loadOpportunities(q, searchInput.value.trim());
      }, 400);
    });
  }

  // ── Save button ────────────────────────────────────────────────
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".save-btn.modal-save")) {
      const userId = localStorage.getItem("userId");
      const modal  = document.getElementById("content-modal");
      if (!userId || modal.classList.contains("hidden")) return;
      const title = document.getElementById("modal-title").innerText;
      const opp   = window.opportunitiesData?.find(o => o.title === title);
      if (!opp) return;
      await fetch(BASE_URL + "/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, opportunityId: opp.id, status: "saved" })
      });
      const btn = e.target.closest(".save-btn.modal-save");
      btn.innerHTML = "<i class='bx bx-bookmark-check'></i> Saved";
      btn.style.color = "#34d399";
      btn.style.borderColor = "#34d399";
    }
  });

}); // end DOMContentLoaded

// ── Deadlines ──────────────────────────────────────────────────
function renderDeadlines() {
  const container = document.getElementById("deadlines-container");
  if (!container) return;
  container.innerHTML = "";
  deadlines.forEach(d => {
    const urgent = d.daysLeft <= 3;
    const item = document.createElement("div");
    item.className = "deadline-item";
    item.style.borderLeftColor = urgent ? "#e50914" : "#fbbf24";
    item.innerHTML = `
      <div class="deadline-info">
        <h4>${d.title}</h4>
        <p>${d.company}</p>
      </div>
      <div class="countdown" style="${urgent ? "color:#f87171;background:rgba(229,9,20,0.1);" : "color:#fbbf24;background:rgba(251,191,36,0.1);"}">
        <i class='bx bx-time-five'></i> ${d.daysLeft} Days
      </div>`;
    container.appendChild(item);
  });
}

// ── Opportunities ──────────────────────────────────────────────
async function getOpportunities(type = "All", search = "", status = "all") {
  const params = new URLSearchParams({ type });
  if (search) params.set("search", search);
  if (status && status !== "all") params.set("status", status);
  if (userProfile.skills && userProfile.skills.length)       params.set("skills",    userProfile.skills.join(","));
  if (userProfile.interests && userProfile.interests.length) params.set("interests", userProfile.interests.join(","));
  const url = BASE_URL + "/opportunities?" + params;
  console.log("Fetching:", url);
  const res = await fetch(url);
  return await res.json();
}

async function loadOpportunities(type = "All", search = "", status = "all") {
  try {
    const data = await getOpportunities(type, search, status);
    displayOpportunities(data);
  } catch(err) { console.error("Error loading ops:", err); }
}
window.loadOpportunities = loadOpportunities;
window.displayOpportunities = displayOpportunities;

function displayOpportunities(data) {
  const container = document.getElementById("recommendations-container");
  if (!container) return;
  window.opportunitiesData = data;
  container.innerHTML = "";

  // Update section header
  const header = document.querySelector(".recommended-section .section-header h3");
  if (header) {
    const activeFilter = document.querySelector(".filter-tab.active");
    const activeStatus = document.querySelector(".status-tab.active");
    const typeName   = activeFilter ? activeFilter.dataset.type || "All" : "All";
    const statusName = activeStatus ? activeStatus.textContent.replace(/[🟢🔵⚫]/g,"").trim() : "";
    const typeLabel  = typeName === "All" ? "All Opportunities" :
                       typeName === "Internship" ? "Internships" :
                       typeName === "Hackathon"  ? "Hackathons"  :
                       typeName === "Scholarship"? "Scholarships": "Competitions";
    header.textContent = typeName === "All" && !statusName
      ? "Recommended for You"
      : typeLabel + (statusName ? " — " + statusName : "") + " (" + data.length + ")";
  }
  if (!data.length) {
    container.innerHTML = `<p style="color:var(--text-muted);grid-column:1/-1;padding:2rem 0;">No opportunities found.</p>`;
    return;
  }
  data.forEach(opp => {
    let badgeClass = "badge-internship";
    if (opp.type === "Hackathon")    badgeClass = "badge-hackathon";
    if (opp.type === "Scholarship")  badgeClass = "badge-scholarship";
    if (opp.type === "Competitions") badgeClass = "badge-competitions";

    const tagsHtml = (opp.tags || []).slice(0,3).map(t => `<span class="opp-tag">#${t}</span>`).join("");
    const deadlineStr = opp.deadline ? new Date(opp.deadline).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : null;
    const statusColor = opp.status === "Ongoing" ? "background:rgba(16,185,129,0.12);color:#34d399;" :
                        opp.status === "Upcoming"? "background:rgba(59,130,246,0.12);color:#60a5fa;" :
                                                   "background:rgba(156,163,175,0.15);color:#9ca3af;";
    const card = document.createElement("div");
    card.className = "opp-card";
    const score = parseInt(opp.matchScore || "0");
    const isForYou = score >= 88 && (userProfile.skills?.length || userProfile.interests?.length);
    const forYouBadge = isForYou ? `<span class="for-you-badge">✦ For You</span>` : "";

    const typeGradients = {
      "Hackathon":    ["linear-gradient(135deg,#667eea,#764ba2)","linear-gradient(135deg,#f093fb,#f5576c)","linear-gradient(135deg,#4facfe,#00f2fe)","linear-gradient(135deg,#43e97b,#38f9d7)","linear-gradient(135deg,#fa709a,#fee140)","linear-gradient(135deg,#6a11cb,#2575fc)","linear-gradient(135deg,#a18cd1,#fbc2eb)","linear-gradient(135deg,#c94b4b,#4b134f)","linear-gradient(135deg,#f7971e,#ffd200)","linear-gradient(135deg,#fc4a1a,#f7b733)"],
      "Internship":   ["linear-gradient(135deg,#0f2027,#2c5364)","linear-gradient(135deg,#141e30,#243b55)","linear-gradient(135deg,#1a1a2e,#16213e)","linear-gradient(135deg,#232526,#414345)","linear-gradient(135deg,#2c3e50,#3498db)","linear-gradient(135deg,#16222a,#3a6186)","linear-gradient(135deg,#0f0c29,#302b63)","linear-gradient(135deg,#1f1c2c,#928dab)","linear-gradient(135deg,#1a1a2e,#e94560)","linear-gradient(135deg,#0d0d0d,#434343)"],
      "Scholarship":  ["linear-gradient(135deg,#11998e,#38ef7d)","linear-gradient(135deg,#56ab2f,#a8e063)","linear-gradient(135deg,#1d976c,#93f9b9)","linear-gradient(135deg,#134e5e,#71b280)","linear-gradient(135deg,#02aab0,#00cdac)","linear-gradient(135deg,#005c97,#363795)","linear-gradient(135deg,#1e3c72,#2a5298)","linear-gradient(135deg,#4776e6,#8e54e9)","linear-gradient(135deg,#3a7bd5,#3a6073)","linear-gradient(135deg,#0575e6,#021b79)"],
      "Competitions": ["linear-gradient(135deg,#f7971e,#ffd200)","linear-gradient(135deg,#fc4a1a,#f7b733)","linear-gradient(135deg,#f953c6,#b91d73)","linear-gradient(135deg,#ff416c,#ff4b2b)","linear-gradient(135deg,#f5af19,#f12711)","linear-gradient(135deg,#d31027,#ea384d)","linear-gradient(135deg,#eb5757,#000000)","linear-gradient(135deg,#e96c1e,#f7b733)","linear-gradient(135deg,#c94b4b,#4b134f)","linear-gradient(135deg,#f7971e,#ffd200)"],
    };
    const grads = typeGradients[opp.type] || typeGradients["Hackathon"];
    const idHash = opp.id.split("").reduce((a,c) => a + c.charCodeAt(0), 0);
    const grad = grads[idHash % grads.length];
    const emoji = opp.type==="Hackathon"?"⚡":opp.type==="Internship"?"💼":opp.type==="Scholarship"?"🎓":"🏆";

    card.innerHTML = `
      <div style="height:110px;overflow:hidden;flex-shrink:0;background:${grad};display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;z-index:1;">
          <span style="font-size:2.8rem;line-height:1;">${emoji}</span>
          <span style="font-size:0.7rem;font-weight:700;color:rgba(255,255,255,0.8);letter-spacing:1px;text-transform:uppercase;">${opp.type}</span>
        </div>
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.25));"></div>
      </div>
      <div class="opp-card-inner">
        <div class="opp-card-top">
          <img src="${opp.logo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(opp.company) + "&background=8b5cf6&color=fff"}"
            class="opp-logo" alt="${opp.company}"
            onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(opp.company)}&background=8b5cf6&color=fff'"/>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            <span class="opp-badge ${badgeClass}">${opp.type}</span>
            ${opp.status ? `<span style="font-size:0.68rem;font-weight:700;padding:0.15rem 0.55rem;border-radius:99px;${statusColor}">${opp.status}</span>` : ""}
          </div>
        </div>
        ${forYouBadge}
        <div class="opp-match"><i class='bx bx-check-shield'></i> ${opp.matchScore || "95%"} Match</div>
        <h4 class="opp-title">${opp.title}</h4>
        <p class="opp-company">${opp.company}</p>
        <div class="opp-tags">${tagsHtml}</div>
        <div class="opp-meta">
          ${opp.prize    ? `<span class="prize"><i class='bx bx-trophy'></i> ${opp.prize}</span>` : ""}
          ${deadlineStr  ? `<span><i class='bx bx-calendar'></i> ${deadlineStr}</span>` : ""}
          ${opp.mode     ? `<span><i class='bx bx-map-pin'></i> ${opp.mode}</span>` : ""}
        </div>
        <div class="opp-footer">
          <button class="apply-btn" onclick="handleApplyClick('${opp.id}','${opp.applyUrl}')">Apply Now</button>
          <button class="view-btn" onclick="viewContent('${opp.id}')"><i class='bx bx-info-circle'></i> View</button>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

// ── Modal ──────────────────────────────────────────────────────
window.viewContent = function(id) {
  const modal = document.getElementById("content-modal");
  if (!modal || !window.opportunitiesData) return;
  const opp = window.opportunitiesData.find(o => String(o.id) === String(id));
  if (!opp) return;
  document.getElementById("modal-title").innerText       = opp.title;
  document.getElementById("modal-description").innerText = opp.description || "";
  document.getElementById("modal-banner").src = opp.banner || "";
  const companyEl = document.getElementById("modal-company");
  if (companyEl) companyEl.innerText = opp.company;
  const typeBadge = document.getElementById("modal-type-badge");
  if (typeBadge) {
    typeBadge.innerText   = opp.type;
    typeBadge.className   = "modal-type-badge";
    if (opp.type === "Hackathon")   typeBadge.classList.add("badge-hackathon");
    else if (opp.type === "Internship")  typeBadge.classList.add("badge-internship");
    else if (opp.type === "Scholarship") typeBadge.classList.add("badge-scholarship");
    else typeBadge.classList.add("badge-competitions");
  }
  const metaRow = document.getElementById("modal-meta-row");
  if (metaRow) {
    metaRow.innerHTML = "";
    [
      opp.prize    ? { icon:"bx-trophy",   label: opp.prize } : null,
      opp.teamSize ? { icon:"bx-group",    label: "Team: " + opp.teamSize } : null,
      opp.mode     ? { icon:"bx-map-pin",  label: opp.mode } : null,
      opp.deadline ? { icon:"bx-calendar", label: "Deadline: " + new Date(opp.deadline).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) } : null,
    ].filter(Boolean).forEach(m => {
      const chip = document.createElement("span");
      chip.className = "modal-meta-chip";
      chip.innerHTML = `<i class='bx ${m.icon}'></i> ${m.label}`;
      metaRow.appendChild(chip);
    });
  }
  const tagsEl = document.getElementById("modal-tags");
  if (tagsEl) {
    tagsEl.innerHTML = "";
    (opp.tags || []).forEach(tag => {
      const t = document.createElement("span");
      t.className   = "modal-tag";
      t.textContent = "#" + tag;
      tagsEl.appendChild(t);
    });
  }
  const whyEl = document.getElementById("modal-why-apply");
  if (whyEl) whyEl.innerText = opp.whyApply || "Join us and fast-track your professional career.";
  const applyBtn = document.querySelector(".modal-apply");
  if (applyBtn) applyBtn.onclick = () => opp.applyUrl && window.open(opp.applyUrl, "_blank", "noopener,noreferrer");
  modal.classList.remove("hidden");
};

window.handleModalBackdropClick = function(e) {
  if (e.target === document.getElementById("content-modal"))
    document.getElementById("content-modal").classList.add("hidden");
};

async function sendMessage(message) {
  const res = await fetch(BASE_URL + "/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      userName:  userProfile.name      || "",
      skills:    userProfile.skills    || [],
      interests: userProfile.interests || [],
    })
  });
  return await res.json();
}

// ── Profile Modal ──────────────────────────────────────────────
window.openProfileModal = window._openProfileModal = function openProfileModal() {
  const existing = document.getElementById("profile-modal");
  if (existing) existing.remove();

  const p = userProfile || {};
  const displayName = p.name || "User";
  const avatarUrl   = "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName) + "&background=8b5cf6&color=fff&size=80";
  const roleText    = p.branch ? p.branch + (p.year ? " • Year " + p.year : "") : "Complete your profile below";

  const S = "width:100%;padding:0.75rem 1rem;border-radius:10px;background:var(--bg-card);border:1px solid var(--border);color:var(--text-main);outline:none;font-size:0.9rem;font-family:'Outfit',sans-serif;";
  const L = "font-size:0.82rem;color:var(--text-muted);display:block;margin-bottom:5px;font-weight:500;";

  const modal = document.createElement("div");
  modal.id = "profile-modal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:3000;display:flex;justify-content:center;align-items:center;padding:1rem;";

  const card = document.createElement("div");
  card.style.cssText = "background:var(--glass);backdrop-filter:blur(24px);border:1px solid var(--border);border-radius:24px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 30px 70px rgba(0,0,0,0.5);";

  card.innerHTML =
    '<div style="padding:1.5rem 1.8rem 0;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">' +
      '<div><h2 style="font-size:1.4rem;font-weight:800;margin-bottom:3px;">My Profile</h2>' +
      '<p style="font-size:0.83rem;color:var(--text-muted);">Fill in your details for personalized recommendations</p></div>' +
      '<button id="close-profile-modal" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);border-radius:50%;width:34px;height:34px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>' +
    '</div>' +
    '<div style="padding:0 1.8rem;margin-bottom:1.2rem;display:flex;align-items:center;gap:1rem;">' +
      '<img src="' + avatarUrl + '" style="width:60px;height:60px;border-radius:50%;border:3px solid var(--border);" alt="avatar"/>' +
      '<div><div style="font-size:1rem;font-weight:700;">' + displayName + '</div>' +
      '<div style="font-size:0.82rem;color:var(--text-muted);">' + roleText + '</div></div>' +
    '</div>' +
    '<div style="height:1px;background:var(--border);margin:0 1.8rem 1.5rem;"></div>' +
    '<form id="profile-form" style="padding:0 1.8rem 1.8rem;display:flex;flex-direction:column;gap:1.1rem;">' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">' +
        '<div><label style="' + L + '">College / University</label><input id="p-college" placeholder="e.g. VIT Vellore" style="' + S + '"></div>' +
        '<div><label style="' + L + '">Branch / Stream</label><input id="p-branch" placeholder="e.g. CSE, ECE" style="' + S + '"></div>' +
      '</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">' +
        '<div><label style="' + L + '">Year of Study</label>' +
          '<select id="p-year" style="' + S + '">' +
            '<option value="">Select year</option>' +
            '<option value="1">1st Year</option><option value="2">2nd Year</option>' +
            '<option value="3">3rd Year</option><option value="4">4th Year</option>' +
            '<option value="PG">Postgraduate</option>' +
          '</select></div>' +
        '<div><label style="' + L + '">Gender</label>' +
          '<select id="p-gender" style="' + S + '">' +
            '<option value="">Prefer not to say</option>' +
            '<option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>' +
          '</select></div>' +
      '</div>' +
      '<div><label style="' + L + '">Technical Skills <span style="opacity:0.5;font-weight:400;">(comma separated)</span></label>' +
        '<input id="p-skills" placeholder="e.g. React, Python, Machine Learning, Node.js, SQL" style="' + S + '"></div>' +
      '<div><label style="' + L + '">Interests / Domains <span style="opacity:0.5;font-weight:400;">(comma separated)</span></label>' +
        '<input id="p-interests" placeholder="e.g. AI/ML, Web Dev, Blockchain, Data Science, DevOps" style="' + S + '"></div>' +
      '<div><label style="' + L + '">Preferred Opportunity Type</label>' +
        '<select id="p-opptype" style="' + S + '">' +
          '<option value="">Select preference</option>' +
          '<option value="Internship">Internships</option>' +
          '<option value="Hackathon">Hackathons</option>' +
          '<option value="Scholarship">Scholarships</option>' +
          '<option value="Competitions">Competitions</option>' +
          '<option value="All">All types</option>' +
        '</select></div>' +
      '<div><label style="' + L + '">Preferred Mode</label>' +
        '<select id="p-mode" style="' + S + '">' +
          '<option value="">No preference</option>' +
          '<option value="Remote">Remote / Online</option>' +
          '<option value="Hybrid">Hybrid</option>' +
          '<option value="Onsite">Onsite / Offline</option>' +
        '</select></div>' +
      '<div><label style="' + L + '">Career Goal</label>' +
        '<select id="p-goal" style="' + S + '">' +
          '<option value="">Select goal</option>' +
          '<option value="FAANG">FAANG / Big Tech</option>' +
          '<option value="Startup">Startup / Product Company</option>' +
          '<option value="Research">Research / Academia</option>' +
          '<option value="Finance">Finance / Consulting</option>' +
          '<option value="Entrepreneurship">Entrepreneurship / Startup Founder</option>' +
          '<option value="Government">Government / PSU</option>' +
        '</select></div>' +
      '<div><label style="' + L + '">LinkedIn URL <span style="opacity:0.5;font-weight:400;">(optional)</span></label>' +
        '<input id="p-linkedin" placeholder="https://linkedin.com/in/yourname" style="' + S + '"></div>' +
      '<div><label style="' + L + '">GitHub URL <span style="opacity:0.5;font-weight:400;">(optional)</span></label>' +
        '<input id="p-github" placeholder="https://github.com/yourusername" style="' + S + '"></div>' +
      '<div><label style="' + L + '">About You <span style="opacity:0.5;font-weight:400;">(optional)</span></label>' +
        '<textarea id="p-bio" placeholder="Your goals and what you are looking for..." style="' + S + 'height:75px;resize:vertical;"></textarea></div>' +
      '<button type="submit" id="profile-save-btn" style="background:linear-gradient(135deg,#8b5cf6,#3b82f6);color:white;border:none;padding:0.9rem;border-radius:12px;font-size:0.95rem;font-weight:700;cursor:pointer;">' +
        'Save &amp; Update Recommendations' +
      '</button>' +
    '</form>';

  modal.appendChild(card);
  document.body.appendChild(modal);

  // Pre-fill existing data
  if (p.college)                     document.getElementById("p-college").value   = p.college;
  if (p.branch)                      document.getElementById("p-branch").value    = p.branch;
  if (p.year)                        document.getElementById("p-year").value      = p.year;
  if (p.skills && p.skills.length)   document.getElementById("p-skills").value   = p.skills.join(", ");
  if (p.interests && p.interests.length) document.getElementById("p-interests").value = p.interests.join(", ");
  if (p.linkedin)          document.getElementById("p-linkedin").value  = p.linkedin;
  if (p.github)            document.getElementById("p-github").value    = p.github;
  if (p.bio)               document.getElementById("p-bio").value       = p.bio;

  document.getElementById("close-profile-modal").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); return; }
    const btn = document.getElementById("profile-save-btn");
    btn.textContent = "Saving...";
    btn.disabled = true;
    const oppTypeEl = document.getElementById("p-opptype");
    const modeEl    = document.getElementById("p-mode");
    const goalEl    = document.getElementById("p-goal");

    // Merge career goal and mode into interests for better matching
    const extraInterests = [];
    if (goalEl && goalEl.value) extraInterests.push(goalEl.value);
    if (modeEl && modeEl.value) extraInterests.push(modeEl.value);

    const payload = {
      skills:    document.getElementById("p-skills").value.split(",").map(s => s.trim()).filter(Boolean),
      interests: [...document.getElementById("p-interests").value.split(",").map(s => s.trim()).filter(Boolean), ...extraInterests],
      branch:    document.getElementById("p-branch").value.trim(),
      year:      document.getElementById("p-year").value,
      college:   document.getElementById("p-college").value.trim(),
      linkedin:  document.getElementById("p-linkedin").value.trim(),
      github:    document.getElementById("p-github").value.trim(),
      bio:       document.getElementById("p-bio").value.trim(),
    };    try {
      const res = await fetch(BASE_URL + "/profile/" + userId, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        userProfile = await res.json();
        updateUIWithProfile(userProfile);
        modal.remove();
        loadOpportunities("All");
      } else {
        alert("Failed to save ❌");
        btn.textContent = "Save & Update Recommendations";
        btn.disabled = false;
      }
    } catch(err) {
      alert("Server error ❌");
      btn.textContent = "Save & Update Recommendations";
      btn.disabled = false;
    }
  });
}

// ── Notifications (global) ─────────────────────────────────────
window._toggleNotifications = function(e) {
  e.stopPropagation();
  const existing = document.getElementById("notif-panel");
  if (existing) { existing.remove(); return; }

  const notifs = [
    { icon:"bx-time-five", color:"#f87171", title:"Google SWE Intern deadline in 2 days!", time:"Just now",     dot:true  },
    { icon:"bx-trophy",    color:"#fbbf24", title:"New: ETHIndia 2025 Hackathon is live",  time:"1 hour ago",  dot:true  },
    { icon:"bx-bookmark",  color:"#a78bfa", title:"Saved opportunity closes this week",    time:"3 hours ago", dot:true  },
    { icon:"bx-briefcase", color:"#60a5fa", title:"Netflix Frontend Intern — Apply now",   time:"5 hours ago", dot:false },
    { icon:"bx-bell",      color:"#34d399", title:"Profile updated — recommendations refreshed", time:"Yesterday", dot:false },
  ];

  const panel = document.createElement("div");
  panel.id = "notif-panel";
  panel.style.cssText = "position:fixed;top:72px;right:1.2rem;width:330px;background:var(--glass);backdrop-filter:blur(24px);border:1px solid var(--border);border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,0.45);z-index:5000;overflow:hidden;animation:fadeInDown 0.2s ease;";

  panel.innerHTML =
    "<div style='padding:1rem 1.2rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;'>" +
      "<span style='font-weight:700;font-size:0.95rem;'>Notifications</span>" +
      "<span style='font-size:0.72rem;background:var(--purple);color:#fff;padding:0.2rem 0.6rem;border-radius:99px;font-weight:600;'>3 new</span>" +
    "</div>" +
    notifs.map(n =>
      "<div style='padding:0.85rem 1.2rem;display:flex;gap:0.8rem;align-items:flex-start;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s;' " +
        "onmouseover=\"this.style.background='var(--bg-card-hover)'\" onmouseout=\"this.style.background=''\">" +
        "<div style='width:36px;height:36px;border-radius:10px;background:rgba(139,92,246,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;'>" +
          "<i class='bx " + n.icon + "' style='color:" + n.color + ";font-size:1.1rem;'></i>" +
          (n.dot ? "<span style='position:absolute;top:2px;right:2px;width:7px;height:7px;background:#e50914;border-radius:50%;'></span>" : "") +
        "</div>" +
        "<div style='flex:1;min-width:0;'>" +
          "<p style='font-size:0.84rem;font-weight:500;margin-bottom:3px;line-height:1.3;'>" + n.title + "</p>" +
          "<span style='font-size:0.73rem;color:var(--text-muted);'>" + n.time + "</span>" +
        "</div>" +
      "</div>"
    ).join("") +
    "<div style='padding:0.85rem;text-align:center;cursor:pointer;font-size:0.82rem;color:var(--purple);font-weight:600;' onclick=\"document.getElementById('notif-panel').remove()\">View all notifications</div>";

  document.body.appendChild(panel);

  // hide badge
  const badge = document.getElementById("notif-badge");
  if (badge) badge.style.display = "none";

  setTimeout(() => {
    document.addEventListener("click", function handler(ev) {
      if (!panel.contains(ev.target)) { panel.remove(); document.removeEventListener("click", handler); }
    });
  }, 100);
};

// ── Filter tabs init (called after login) ─────────────────────
let currentType   = "All";
let currentStatus = "all";

function initFilterTabs() {
  const filterTabs = document.querySelectorAll(".filter-tab");
  const statusTabs = document.getElementById("status-tabs");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentType   = tab.dataset.type || "All";
      currentStatus = "all";

      document.querySelectorAll(".status-tab").forEach(s => s.classList.remove("active"));
      const allTab = document.querySelector(".status-tab[data-status='all']");
      if (allTab) allTab.classList.add("active");

      const hero    = document.querySelector(".hero-section");
      const deadSec = document.querySelector(".deadlines-section");
      const grid    = document.querySelector(".dashboard-grid");

      if (currentType === "All") {
        if (hero)       hero.style.display    = "flex";
        if (deadSec)    deadSec.style.display = "block";
        if (grid)       grid.style.gridTemplateColumns = "1fr 320px";
        if (statusTabs) statusTabs.classList.add("hidden");
      } else {
        if (hero)       hero.style.display    = "none";
        if (deadSec)    deadSec.style.display = "none";
        if (grid)       grid.style.gridTemplateColumns = "1fr";
        if (statusTabs) statusTabs.classList.remove("hidden");
      }
      loadOpportunities(currentType, "", "all");
    });
  });

  document.querySelectorAll(".status-tab").forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.stopPropagation();
      document.querySelectorAll(".status-tab").forEach(s => s.classList.remove("active"));
      tab.classList.add("active");
      currentStatus = tab.dataset.status;
      loadOpportunities(currentType, "", currentStatus);
    });
  });

  document.querySelectorAll(".chip[data-search]").forEach(chip => {
    chip.addEventListener("click", (e) => {
      e.preventDefault();
      const search = chip.dataset.search;
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      filterTabs.forEach(t => t.classList.remove("active"));
      const allFilterTab = document.querySelector(".filter-tab[data-type='All']");
      if (allFilterTab) allFilterTab.classList.add("active");
      currentType = "All"; currentStatus = "all";
      if (statusTabs) statusTabs.classList.add("hidden");
      const hero    = document.querySelector(".hero-section");
      const deadSec = document.querySelector(".deadlines-section");
      const grid    = document.querySelector(".dashboard-grid");
      if (hero)    hero.style.display    = "none";
      if (deadSec) deadSec.style.display = "none";
      if (grid)    grid.style.gridTemplateColumns = "1fr";
      loadOpportunities("All", search, "all");
    });
  });
}

// ── Dynamic navbar badge updates ───────────────────────────────
async function updateNavBadges() {
  const userId = localStorage.getItem("userId");

  // Build profile params for personalized counts
  const profileParams = [];
  if (userProfile.skills && userProfile.skills.length)       profileParams.push("skills="    + userProfile.skills.join(","));
  if (userProfile.interests && userProfile.interests.length) profileParams.push("interests=" + userProfile.interests.join(","));
  const pq = profileParams.length ? "&" + profileParams.join("&") : "";

  // Update opportunity counts — filtered by profile match (show only 70%+ match)
  try {
    const [hackRes, intRes, schRes, compRes] = await Promise.all([
      fetch(BASE_URL + "/opportunities?type=Hackathon"    + pq),
      fetch(BASE_URL + "/opportunities?type=Internship"   + pq),
      fetch(BASE_URL + "/opportunities?type=Scholarship"  + pq),
      fetch(BASE_URL + "/opportunities?type=Competitions" + pq),
    ]);
    const [hacks, ints, schs, comps] = await Promise.all([
      hackRes.json(), intRes.json(), schRes.json(), compRes.json()
    ]);

    // If profile exists, show only relevant matches; else show total
    const hasProfile = userProfile.skills?.length || userProfile.interests?.length;
    const filterRelevant = (arr) => hasProfile ? arr.filter(o => parseInt(o.matchScore||"0") >= 70) : arr;

    const bh = document.getElementById("badge-hackathons");
    const bi = document.getElementById("badge-internships");
    const bs = document.getElementById("badge-scholarships");
    const bc = document.getElementById("badge-competitions");
    if (bh) bh.textContent = filterRelevant(hacks).length;
    if (bi) bi.textContent = filterRelevant(ints).length;
    if (bs) bs.textContent = filterRelevant(schs).length;
    if (bc) bc.textContent = filterRelevant(comps).length;
  } catch(e) { console.log("Badge update failed", e); }

  // Update saved/applied counts
  if (userId) {
    try {
      const res  = await fetch(BASE_URL + "/applications/" + userId);
      const apps = await res.json();
      const savedCount   = apps.filter(a => a.status === "saved").length;
      const appliedCount = apps.filter(a => a.status === "applied").length;

      const bSaved   = document.getElementById("badge-saved");
      const bApplied = document.getElementById("badge-applied");
      if (bSaved)   bSaved.textContent   = savedCount;
      if (bApplied) bApplied.textContent = appliedCount;

      const heroSaved   = document.querySelector(".stat-card:nth-child(1) .stat-info h3");
      const heroApplied = document.querySelector(".stat-card:nth-child(2) .stat-info h3");
      if (heroSaved)   heroSaved.textContent   = savedCount;
      if (heroApplied) heroApplied.textContent = appliedCount;

      window._savedCount   = savedCount;
      window._appliedCount = appliedCount;
    } catch(e) { console.log("App count failed", e); }
  }
}
window.updateNavBadges = updateNavBadges;

// ── Show All Notifications modal ──────────────────────────────
window._showAllNotifs = function() {
  const existing = document.getElementById("all-notif-modal");
  if (existing) existing.remove();
  const allNotifs = [
    { icon:"bx-time-five", color:"#f87171", title:"Google SWE Intern deadline in 2 days!", desc:"Don't miss the application deadline for Google STEP internship.", time:"Just now", dot:true, tag:"Deadline" },
    { icon:"bx-trophy",    color:"#fbbf24", title:"New: ETHIndia 2025 Hackathon is live", desc:"Asia's biggest Ethereum hackathon is now open for registrations.", time:"1 hour ago", dot:true, tag:"Hackathon" },
    { icon:"bx-bookmark",  color:"#a78bfa", title:"Saved opportunity closes this week", desc:"Microsoft Scholarship for Women in STEM closes in 5 days.", time:"3 hours ago", dot:true, tag:"Saved" },
    { icon:"bx-briefcase", color:"#60a5fa", title:"Netflix Frontend Intern — Apply now", desc:"New internship listing matching your React and JavaScript skills.", time:"5 hours ago", dot:false, tag:"Internship" },
    { icon:"bx-bell",      color:"#34d399", title:"Profile updated — recommendations refreshed", desc:"Your personalized feed has been updated based on your new skills.", time:"Yesterday", dot:false, tag:"System" },
    { icon:"bx-star",      color:"#fbbf24", title:"Smart India Hackathon 2025 is ongoing", desc:"Registration is open. Team size: 6. Prize: ₹1,00,000.", time:"2 days ago", dot:false, tag:"Hackathon" },
    { icon:"bx-graduation",color:"#a78bfa", title:"Google Generation Scholarship — Apply", desc:"Scholarship for underrepresented students. Deadline: Dec 1, 2025.", time:"3 days ago", dot:false, tag:"Scholarship" },
    { icon:"bx-code-block",color:"#60a5fa", title:"New competition: ICPC Asia Regional 2025", desc:"Register your team of 3 for the world's most prestigious CP contest.", time:"4 days ago", dot:false, tag:"Competition" },
  ];
  const tagColors = { "Deadline":"rgba(248,113,113,0.15);color:#f87171","Hackathon":"rgba(139,92,246,0.15);color:#a78bfa","Saved":"rgba(139,92,246,0.15);color:#a78bfa","Internship":"rgba(59,130,246,0.15);color:#60a5fa","System":"rgba(16,185,129,0.15);color:#34d399","Scholarship":"rgba(16,185,129,0.15);color:#34d399","Competition":"rgba(245,158,11,0.15);color:#fbbf24" };
  const modal = document.createElement("div");
  modal.id = "all-notif-modal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.75);backdrop-filter:blur(8px);z-index:9999;display:flex;justify-content:center;align-items:center;padding:1rem;";
  const card = document.createElement("div");
  card.style.cssText = "background:#13121f;border:1px solid rgba(255,255,255,0.1);border-radius:24px;width:100%;max-width:580px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 70px rgba(0,0,0,0.6);";
  card.innerHTML = `
    <div style="padding:1.3rem 1.5rem;border-bottom:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <div><h2 style="font-size:1.2rem;font-weight:800;color:#f0f0f5;margin-bottom:2px;">All Notifications</h2><p style="font-size:0.8rem;color:#8b8b9e;">3 unread notifications</p></div>
      <button id="close-all-notif" style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);color:#f0f0f5;border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>
    <div style="overflow-y:auto;flex:1;">
      ${allNotifs.map(n => `
        <div style="padding:1rem 1.5rem;display:flex;gap:1rem;align-items:flex-start;border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;" onmouseover="this.style.background='rgba(255,255,255,0.04)'" onmouseout="this.style.background=''">
          <div style="width:42px;height:42px;border-radius:12px;background:rgba(139,92,246,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;position:relative;">
            <i class="bx ${n.icon}" style="color:${n.color};font-size:1.2rem;"></i>
            ${n.dot ? `<span style="position:absolute;top:2px;right:2px;width:8px;height:8px;background:#e50914;border-radius:50%;"></span>` : ""}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;margin-bottom:4px;">
              <p style="font-size:0.88rem;font-weight:600;color:#f0f0f5;line-height:1.3;">${n.title}</p>
              <span style="font-size:0.68rem;padding:0.15rem 0.55rem;border-radius:99px;white-space:nowrap;flex-shrink:0;background:${tagColors[n.tag]||"rgba(139,92,246,0.15)"};font-weight:600;">${n.tag}</span>
            </div>
            <p style="font-size:0.8rem;color:#8b8b9e;margin-bottom:4px;line-height:1.4;">${n.desc}</p>
            <span style="font-size:0.73rem;color:#555568;">${n.time}</span>
          </div>
        </div>`).join("")}
    </div>
    <div style="padding:1rem 1.5rem;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
      <span style="font-size:0.82rem;color:#8b8b9e;">Showing all ${allNotifs.length} notifications</span>
      <button id="done-all-notif" style="background:linear-gradient(135deg,#8b5cf6,#3b82f6);color:#fff;border:none;padding:0.5rem 1.2rem;border-radius:10px;font-size:0.85rem;font-weight:600;cursor:pointer;">Done</button>
    </div>`;
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("close-all-notif").onclick = () => modal.remove();
  document.getElementById("done-all-notif").onclick   = () => modal.remove();
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
};
window.handleApplyClick = async function(oppId, applyUrl) {
  if (applyUrl) window.open(applyUrl, "_blank", "noopener,noreferrer");
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  try {
    await fetch(BASE_URL + "/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, opportunityId: oppId, status: "applied" })
    });
    // Update badge
    const badge = document.getElementById("badge-applied");
    if (badge) badge.textContent = parseInt(badge.textContent || "0") + 1;
    const heroApplied = document.querySelector(".stat-card:nth-child(2) .stat-info h3");
    if (heroApplied) heroApplied.textContent = parseInt(heroApplied.textContent || "0") + 1;
  } catch(e) { /* silent */ }
};

// ── MY SPACE functions (window globals) ───────────────────────
window.showDashboard = function() {
  const saved   = parseInt(document.getElementById("badge-saved")?.textContent  || "0");
  const applied = parseInt(document.getElementById("badge-applied")?.textContent || "0");
  _showMySpaceModalJS("Dashboard", `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
      <div style="background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);border-radius:14px;padding:1.2rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#a78bfa;">${saved}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Saved</div>
      </div>
      <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);border-radius:14px;padding:1.2rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#34d399;">${applied}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Applied</div>
      </div>
      <div style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:14px;padding:1.2rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#60a5fa;">3</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Deadlines Soon</div>
      </div>
      <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.2);border-radius:14px;padding:1.2rem;text-align:center;">
        <div style="font-size:2rem;font-weight:800;color:#fbbf24;">12</div>
        <div style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">New Matches</div>
      </div>
    </div>
    <p style="font-size:0.85rem;color:var(--text-muted);text-align:center;">Keep applying! Your profile is getting stronger every day 🚀</p>
  `);
};

window.showSaved = async function() {
  const userId = localStorage.getItem("userId");
  if (!userId) { alert("Please login first"); return; }
  _showMySpaceModalJS("Saved Opportunities", '<div style="text-align:center;padding:2rem;color:var(--text-muted);">Loading...</div>');
  try {
    const res  = await fetch(BASE_URL + "/applications/" + userId);
    const apps = await res.json();
    const saved = apps.filter(a => a.status === "saved");
    const badge = document.getElementById("badge-saved");
    if (badge) badge.textContent = saved.length;
    const content = saved.length === 0
      ? '<div style="text-align:center;padding:2rem;"><div style="font-size:3rem;margin-bottom:1rem;">🔖</div><p style="color:var(--text-muted);font-size:0.9rem;">No saved opportunities yet.<br>Click <strong>Save</strong> on any opportunity!</p></div>'
      : '<div>' + saved.map((a,i) => {
          const opp = (typeof a.opportunityId === "object" && a.opportunityId) ? a.opportunityId : {};
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem 0;border-bottom:1px solid var(--border);">
            <div><p style="font-weight:600;font-size:0.9rem;margin-bottom:2px;">${opp.title||"Saved Opportunity #"+(i+1)}</p>
            <p style="font-size:0.78rem;color:var(--text-muted);">${opp.company||""}${opp.type?" • "+opp.type:""}</p></div>
            <span style="font-size:0.72rem;background:rgba(139,92,246,0.12);color:#a78bfa;padding:0.2rem 0.7rem;border-radius:99px;">🔖 Saved</span>
          </div>`;
        }).join("") + '</div>';
    const el = document.querySelector("#myspace-modal-js .modal-body-content");
    if (el) el.innerHTML = content;
  } catch(e) {
    const el = document.querySelector("#myspace-modal-js .modal-body-content");
    if (el) el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Could not load saved items.</p>';
  }
};

window.showApplied = async function() {
  const userId = localStorage.getItem("userId");
  if (!userId) { alert("Please login first"); return; }
  _showMySpaceModalJS("Applied Opportunities", '<div style="text-align:center;padding:2rem;color:var(--text-muted);">Loading...</div>');
  try {
    const res  = await fetch(BASE_URL + "/applications/" + userId);
    const apps = await res.json();
    const applied = apps.filter(a => a.status === "applied");
    const badge = document.getElementById("badge-applied");
    if (badge) badge.textContent = applied.length;
    const content = applied.length === 0
      ? '<div style="text-align:center;padding:2rem;"><div style="font-size:3rem;margin-bottom:1rem;">🚀</div><p style="color:var(--text-muted);font-size:0.9rem;">No applications yet.<br>Click <strong>Apply Now</strong> to track here!</p></div>'
      : '<div>' + applied.map((a,i) => {
          const opp = (typeof a.opportunityId === "object" && a.opportunityId) ? a.opportunityId : {};
          const date = a.createdAt ? new Date(a.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "";
          return `<div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem 0;border-bottom:1px solid var(--border);">
            <div><p style="font-weight:600;font-size:0.9rem;margin-bottom:2px;">${opp.title||"Application #"+(i+1)}</p>
            <p style="font-size:0.78rem;color:var(--text-muted);">${opp.company||""}${opp.type?" • "+opp.type:""}${date?" • "+date:""}</p></div>
            <span style="font-size:0.72rem;background:rgba(16,185,129,0.12);color:#34d399;padding:0.2rem 0.7rem;border-radius:99px;">✅ Applied</span>
          </div>`;
        }).join("") + '</div>';
    const el = document.querySelector("#myspace-modal-js .modal-body-content");
    if (el) el.innerHTML = content;
  } catch(e) {
    const el = document.querySelector("#myspace-modal-js .modal-body-content");
    if (el) el.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;">Could not load applications.</p>';
  }
};

window.showAlerts = function() {
  _showMySpaceModalJS("Deadline Alerts", `
    <div style="display:flex;flex-direction:column;gap:0.8rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem 1rem;background:rgba(229,9,20,0.08);border:1px solid rgba(229,9,20,0.2);border-radius:12px;border-left:3px solid #e50914;">
        <div><p style="font-weight:600;font-size:0.9rem;">Google SWE Intern</p><p style="font-size:0.78rem;color:var(--text-muted);">Google</p></div>
        <span style="font-size:0.78rem;font-weight:700;color:#f87171;background:rgba(248,113,113,0.1);padding:0.3rem 0.7rem;border-radius:99px;">⏰ 2 Days</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem 1rem;background:rgba(251,191,36,0.08);border:1px solid rgba(251,191,36,0.2);border-radius:12px;border-left:3px solid #fbbf24;">
        <div><p style="font-weight:600;font-size:0.9rem;">Global AI Hackathon</p><p style="font-size:0.78rem;color:var(--text-muted);">Devpost</p></div>
        <span style="font-size:0.78rem;font-weight:700;color:#fbbf24;background:rgba(251,191,36,0.1);padding:0.3rem 0.7rem;border-radius:99px;">⏰ 5 Days</span>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0.9rem 1rem;background:rgba(251,191,36,0.05);border:1px solid rgba(251,191,36,0.15);border-radius:12px;border-left:3px solid #fbbf24;">
        <div><p style="font-weight:600;font-size:0.9rem;">Microsoft Learn Ambassador</p><p style="font-size:0.78rem;color:var(--text-muted);">Microsoft</p></div>
        <span style="font-size:0.78rem;font-weight:700;color:#fbbf24;background:rgba(251,191,36,0.1);padding:0.3rem 0.7rem;border-radius:99px;">⏰ 12 Days</span>
      </div>
    </div>
    <p style="font-size:0.82rem;color:var(--text-muted);margin-top:1rem;text-align:center;">Save opportunities to get deadline alerts 🔔</p>
  `);
};

function _showMySpaceModalJS(title, content) {
  const existing = document.getElementById("myspace-modal-js");
  if (existing) existing.remove();
  const modal = document.createElement("div");
  modal.id = "myspace-modal-js";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:3000;display:flex;justify-content:center;align-items:center;padding:1rem;";
  modal.innerHTML = `
    <div style="background:var(--glass);backdrop-filter:blur(24px);border:1px solid var(--border);border-radius:24px;width:100%;max-width:500px;max-height:85vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 30px 70px rgba(0,0,0,0.5);">
      <div style="padding:1.3rem 1.5rem;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;flex-shrink:0;">
        <h2 style="font-size:1.2rem;font-weight:800;">${title}</h2>
        <button onclick="document.getElementById('myspace-modal-js').remove()" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);border-radius:50%;width:32px;height:32px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
      </div>
      <div class="modal-body-content" style="padding:1.2rem 1.5rem;overflow-y:auto;flex:1;">${content}</div>
    </div>`;
  document.body.appendChild(modal);
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
}

// ── Settings Modal ─────────────────────────────────────────────
window._openSettingsModal = window.openSettingsModal = function() {  const existing = document.getElementById("settings-modal");
  if (existing) existing.remove();
  const isDark = !document.documentElement.classList.contains("light-mode");
  const modal = document.createElement("div");
  modal.id = "settings-modal";
  modal.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:3000;display:flex;justify-content:center;align-items:center;padding:1rem;";
  const ROW = "display:flex;justify-content:space-between;align-items:center;padding:1rem 0;border-bottom:1px solid var(--border);";
  const card = document.createElement("div");
  card.style.cssText = "background:var(--glass);backdrop-filter:blur(24px);border:1px solid var(--border);border-radius:24px;width:100%;max-width:480px;max-height:88vh;overflow-y:auto;box-shadow:0 30px 70px rgba(0,0,0,0.5);";
  card.innerHTML = `
    <div style="padding:1.5rem 1.8rem 0;display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
      <div><h2 style="font-size:1.4rem;font-weight:800;margin-bottom:3px;">Settings</h2>
      <p style="font-size:0.83rem;color:var(--text-muted);">Customize your OpportunityOS experience</p></div>
      <button id="close-settings" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text-muted);border-radius:50%;width:34px;height:34px;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>
    <div style="padding:0 1.8rem 1.8rem;">
      <p style="font-size:0.72rem;font-weight:700;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:0.5rem;">APPEARANCE</p>
      <div style="${ROW}">
        <div><p style="font-weight:600;font-size:0.9rem;">Dark Mode</p><p style="font-size:0.78rem;color:var(--text-muted);">Toggle between dark and light theme</p></div>
        <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer;">
          <input type="checkbox" id="setting-darkmode" ${isDark ? "checked" : ""} style="opacity:0;width:0;height:0;">
          <span id="dm-track" style="position:absolute;inset:0;background:${isDark ? "#8b5cf6" : "#ccc"};border-radius:99px;transition:0.3s;">
            <span id="dm-thumb" style="position:absolute;top:3px;left:${isDark ? "25px" : "3px"};width:20px;height:20px;background:#fff;border-radius:50%;transition:0.3s;"></span>
          </span>
        </label>
      </div>
      <p style="font-size:0.72rem;font-weight:700;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase;margin:1rem 0 0.5rem;">NOTIFICATIONS</p>
      <div style="${ROW}">
        <div><p style="font-weight:600;font-size:0.9rem;">Deadline Alerts</p><p style="font-size:0.78rem;color:var(--text-muted);">Get notified before opportunities close</p></div>
        <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer;">
          <input type="checkbox" id="setting-alerts" ${localStorage.getItem("notif-alerts") !== "false" ? "checked" : ""} style="opacity:0;width:0;height:0;">
          <span id="al-track" style="position:absolute;inset:0;background:${localStorage.getItem("notif-alerts") !== "false" ? "#8b5cf6" : "#ccc"};border-radius:99px;transition:0.3s;">
            <span id="al-thumb" style="position:absolute;top:3px;left:${localStorage.getItem("notif-alerts") !== "false" ? "25px" : "3px"};width:20px;height:20px;background:#fff;border-radius:50%;transition:0.3s;"></span>
          </span>
        </label>
      </div>
      <div style="${ROW}">
        <div><p style="font-weight:600;font-size:0.9rem;">New Opportunities</p><p style="font-size:0.78rem;color:var(--text-muted);">Notify when new matching opportunities are added</p></div>
        <label style="position:relative;display:inline-block;width:48px;height:26px;cursor:pointer;">
          <input type="checkbox" id="setting-newopps" checked style="opacity:0;width:0;height:0;">
          <span style="position:absolute;inset:0;background:#8b5cf6;border-radius:99px;"><span style="position:absolute;top:3px;left:25px;width:20px;height:20px;background:#fff;border-radius:50%;"></span></span>
        </label>
      </div>
      <p style="font-size:0.72rem;font-weight:700;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase;margin:1rem 0 0.5rem;">RECOMMENDATIONS</p>
      <div style="${ROW}">
        <div><p style="font-weight:600;font-size:0.9rem;">Minimum Match Score</p><p style="font-size:0.78rem;color:var(--text-muted);">Only show opportunities above this match %</p></div>
        <select id="setting-minscore" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text-main);padding:0.4rem 0.8rem;border-radius:8px;font-size:0.85rem;cursor:pointer;outline:none;">
          <option value="0">All</option>
          <option value="70" ${(localStorage.getItem("minMatchScore")||"70")==="70"?"selected":""}>70%+</option>
          <option value="80" ${localStorage.getItem("minMatchScore")==="80"?"selected":""}>80%+</option>
          <option value="90" ${localStorage.getItem("minMatchScore")==="90"?"selected":""}>90%+</option>
        </select>
      </div>
      <div style="${ROW}">
        <div><p style="font-weight:600;font-size:0.9rem;">Default Status Filter</p><p style="font-size:0.78rem;color:var(--text-muted);">Which tab to show first when browsing</p></div>
        <select id="setting-defaultstatus" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text-main);padding:0.4rem 0.8rem;border-radius:8px;font-size:0.85rem;cursor:pointer;outline:none;">
          <option value="Ongoing" ${(localStorage.getItem("defaultStatus")||"Ongoing")==="Ongoing"?"selected":""}>Live Now</option>
          <option value="Upcoming" ${localStorage.getItem("defaultStatus")==="Upcoming"?"selected":""}>Upcoming</option>
          <option value="all" ${localStorage.getItem("defaultStatus")==="all"?"selected":""}>All</option>
        </select>
      </div>
      <p style="font-size:0.72rem;font-weight:700;color:var(--text-muted);letter-spacing:1.5px;text-transform:uppercase;margin:1rem 0 0.5rem;">ACCOUNT</p>
      <div style="${ROW}">
        <div><p style="font-weight:600;font-size:0.9rem;">Logged in as</p>
        <p style="font-size:0.78rem;color:var(--text-muted);">${userProfile.name || "User"}</p></div>
        <span style="font-size:0.75rem;background:rgba(16,185,129,0.12);color:#34d399;padding:0.2rem 0.7rem;border-radius:99px;font-weight:600;">Active</span>
      </div>
      <div style="display:flex;gap:0.8rem;margin-top:1.5rem;">
        <button id="settings-save" style="flex:1;background:linear-gradient(135deg,#8b5cf6,#3b82f6);color:#fff;border:none;padding:0.85rem;border-radius:12px;font-size:0.95rem;font-weight:700;cursor:pointer;">Save Settings</button>
        <button id="settings-logout" style="background:rgba(229,9,20,0.1);color:#f87171;border:1px solid rgba(229,9,20,0.2);padding:0.85rem 1.2rem;border-radius:12px;font-size:0.9rem;font-weight:600;cursor:pointer;">Log Out</button>
      </div>
    </div>`;
  modal.appendChild(card);
  document.body.appendChild(modal);
  document.getElementById("close-settings").onclick = () => modal.remove();
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
  // Dark mode toggle
  document.getElementById("setting-darkmode").addEventListener("change", function() {
    document.documentElement.classList.toggle("light-mode", !this.checked);
    localStorage.setItem("theme", this.checked ? "dark" : "light");
    document.getElementById("dm-track").style.background = this.checked ? "#8b5cf6" : "#ccc";
    document.getElementById("dm-thumb").style.left = this.checked ? "25px" : "3px";
    const icon = document.querySelector("#theme-toggle i");
    if (icon) icon.className = this.checked ? "bx bx-sun" : "bx bx-moon";
  });
  // Alerts toggle
  document.getElementById("setting-alerts").addEventListener("change", function() {
    localStorage.setItem("notif-alerts", this.checked ? "true" : "false");
    document.getElementById("al-track").style.background = this.checked ? "#8b5cf6" : "#ccc";
    document.getElementById("al-thumb").style.left = this.checked ? "25px" : "3px";
  });
  // Save
  document.getElementById("settings-save").onclick = () => {
    const minScore  = document.getElementById("setting-minscore").value;
    const defStatus = document.getElementById("setting-defaultstatus").value;
    localStorage.setItem("minMatchScore", minScore);
    localStorage.setItem("defaultStatus", defStatus);
    modal.remove();
    const activeFilter = document.querySelector(".filter-tab.active");
    const type = activeFilter ? (activeFilter.dataset.type || "All") : "All";
    if (window.loadOpportunities) loadOpportunities(type, "", defStatus);
  };
  // Logout
  document.getElementById("settings-logout").onclick = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("minMatchScore");
      localStorage.removeItem("defaultStatus");
      location.reload();
    }
  };
};
