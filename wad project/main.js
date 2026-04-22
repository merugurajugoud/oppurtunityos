const BASE_URL = "http://localhost:5000/api";
console.log("✅ main.js v2 loaded");
let userProfile = { skills: [], interests: [], branch: "", year: "", college: "" };

async function fetchUserProfile() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  try {
    const res = await fetch(`${BASE_URL}/profile/${userId}`);
    if (res.ok) { userProfile = await res.json(); updateUIWithProfile(userProfile); }
  } catch (e) { console.log("Profile fetch failed", e); }
}

function updateUIWithProfile(p) {
  const nameEl   = document.querySelector(".user-name");
  const roleEl   = document.querySelector(".user-role");
  const heroEl   = document.querySelector(".hero-text h2");
  const avatarEl = document.querySelector(".avatar");
  if (nameEl && p.name)   nameEl.textContent   = p.name.split(" ")[0] + " " + (p.name.split(" ")[1]?.[0] || "") + ".";
  if (roleEl && p.branch) roleEl.textContent   = p.branch + (p.year ? " • Year " + p.year : "");
  if (heroEl && p.name)   heroEl.textContent   = "Welcome back, " + p.name.split(" ")[0] + "! 👋";
  if (avatarEl && p.name) avatarEl.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(p.name) + "&background=8b5cf6&color=fff";
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
        localStorage.setItem("userId", data._id);
        document.getElementById("auth-container").classList.add("hidden");
        const app = document.getElementById("app");
        app.classList.remove("hidden");
        app.style.display  = "flex";
        app.style.opacity  = "1";
        await fetchUserProfile();
        renderDeadlines();
        loadOpportunities("All");
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

  chatbotFab.addEventListener("click", () => {
    chatWindow.classList.remove("hidden");
    setTimeout(() => { chatWindow.classList.add("visible"); chatInputField.focus(); }, 10);
  });
  closeChatBtn.addEventListener("click", () => {
    chatWindow.classList.remove("visible");
    setTimeout(() => { chatWindow.classList.add("hidden"); }, 300);
  });
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInputField.value.trim();
    if (!text) return;
    const userMsg = document.createElement("div");
    userMsg.className = "message msg-user";
    userMsg.textContent = text;
    chatMessages.appendChild(userMsg);
    chatInputField.value = "";
    const data = await sendMessage(text);
    const aiMsg = document.createElement("div");
    aiMsg.className = "message msg-ai";
    aiMsg.textContent = data.reply;
    chatMessages.appendChild(aiMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });

  // ── Filter tabs ────────────────────────────────────────────────
  const filterTabs = document.querySelectorAll(".filter-tab");
  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      let q = tab.textContent.trim();
      if (q === "Internships")  q = "Internship";
      if (q === "Hackathons")   q = "Hackathon";
      if (q === "Scholarships") q = "Scholarship";
      const hero      = document.querySelector(".hero-section");
      const deadSec   = document.querySelector(".deadlines-section");
      if (q === "All") {
        if (hero)    hero.style.display    = "flex";
        if (deadSec) deadSec.style.display = "block";
      } else {
        if (hero)    hero.style.display    = "none";
        if (deadSec) deadSec.style.display = "none";
      }
      loadOpportunities(q);
    });
  });

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

  // ── Sidebar nav ────────────────────────────────────────────────
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach(link => {
    if (link.id === "profile-nav-link") return; // handled separately
    link.addEventListener("click", (e) => {
      const text = link.textContent.replace(/[0-9]+|New/gi, "").trim();
      let q = text;
      if (text === "Internships")  q = "Internship";
      if (text === "Hackathons")   q = "Hackathon";
      if (text === "Scholarships") q = "Scholarship";
      if (text === "Home")         q = "All";
      const valid = ["All","Internship","Hackathon","Scholarship","Competitions"];
      if (valid.includes(q)) {
        e.preventDefault();
        navLinks.forEach(n => n.classList.remove("active"));
        link.classList.add("active");
        filterTabs.forEach(t => {
          t.classList.remove("active");
          const tt = t.textContent.trim();
          if (q === "All" && tt === "All") t.classList.add("active");
          else if (q !== "All" && tt.includes(text)) t.classList.add("active");
        });
        const hero    = document.querySelector(".hero-section");
        const deadSec = document.querySelector(".deadlines-section");
        const filters = document.querySelector(".discovery-filters");
        if (q === "All") {
          if (hero)    hero.style.display    = "flex";
          if (deadSec) deadSec.style.display = "block";
          if (filters) filters.style.display = "block";
        } else {
          if (hero)    hero.style.display    = "none";
          if (deadSec) deadSec.style.display = "none";
        }
        loadOpportunities(q);
      } else {
        // for links like Settings, Jobs, etc — just prevent default
        e.preventDefault();
      }
    });
  });

  // ── Profile link ───────────────────────────────────────────────
  const profileNavLink = document.getElementById("profile-nav-link");
  if (profileNavLink) {
    profileNavLink.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      openProfileModal();
    });
  }

  // ── Search ─────────────────────────────────────────────────────
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
async function getOpportunities(type = "All", search = "") {
  const params = new URLSearchParams({ type });
  if (search) params.set("search", search);
  if (userProfile.skills?.length)    params.set("skills",    userProfile.skills.join(","));
  if (userProfile.interests?.length) params.set("interests", userProfile.interests.join(","));
  const res = await fetch(BASE_URL + "/opportunities?" + params);
  return await res.json();
}

async function loadOpportunities(type = "All", search = "") {
  try {
    const data = await getOpportunities(type, search);
    displayOpportunities(data);
  } catch(err) { console.error("Error loading ops:", err); }
}

function displayOpportunities(data) {
  const container = document.getElementById("recommendations-container");
  if (!container) return;
  window.opportunitiesData = data;
  container.innerHTML = "";
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
    card.innerHTML = `
      <div style="height:110px;overflow:hidden;flex-shrink:0;">
        <img src="${opp.banner || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800"}"
          style="width:100%;height:100%;object-fit:cover;" loading="lazy"/>
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
          <button class="apply-btn" onclick="window.open('${opp.applyUrl}','_blank','noopener,noreferrer')">Apply Now</button>
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
  document.getElementById("modal-banner").src            = opp.banner || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800";
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
    body: JSON.stringify({ message })
  });
  return await res.json();
}

// ── Profile Modal ──────────────────────────────────────────────
window.openProfileModal = function openProfileModal() {
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
        '<input id="p-skills" placeholder="e.g. React, Python, Machine Learning" style="' + S + '"></div>' +
      '<div><label style="' + L + '">Interests / Domains <span style="opacity:0.5;font-weight:400;">(comma separated)</span></label>' +
        '<input id="p-interests" placeholder="e.g. AI/ML, Web Dev, Blockchain" style="' + S + '"></div>' +
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
  if (p.linkedin)                    document.getElementById("p-linkedin").value  = p.linkedin;
  if (p.github)                      document.getElementById("p-github").value    = p.github;
  if (p.bio)                         document.getElementById("p-bio").value       = p.bio;

  document.getElementById("close-profile-modal").addEventListener("click", () => modal.remove());
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });

  document.getElementById("profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) { alert("Please login first"); return; }
    const btn = document.getElementById("profile-save-btn");
    btn.textContent = "Saving...";
    btn.disabled = true;
    const payload = {
      skills:    document.getElementById("p-skills").value.split(",").map(s => s.trim()).filter(Boolean),
      interests: document.getElementById("p-interests").value.split(",").map(s => s.trim()).filter(Boolean),
      branch:    document.getElementById("p-branch").value.trim(),
      year:      document.getElementById("p-year").value,
      college:   document.getElementById("p-college").value.trim(),
      linkedin:  document.getElementById("p-linkedin").value.trim(),
      github:    document.getElementById("p-github").value.trim(),
      bio:       document.getElementById("p-bio").value.trim(),
    };
    try {
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
