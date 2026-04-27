import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import oppRoutes from "./routes/opportunity.js";
import appRoutes from "./routes/application.js";
import profileRoutes from "./routes/profile.js";
import cors from "cors";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", oppRoutes);
app.use("/api/applications", appRoutes);
app.use("/api/profile", profileRoutes);

mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => { console.log("MongoDB Error ❌", err.message); process.exit(1); });

app.get("/", (req, res) => res.send("Backend is working 🚀"));
app.listen(5000, () => console.log("Server running on port 5000"));

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

app.post("/api/chat", async (req, res) => {
  const raw = (req.body.message || "").trim();
  const msg = raw.toLowerCase();
  const name = (req.body.userName || "").split(" ")[0];
  const g = name ? name + ", " : "";
  const skills = req.body.skills || [];

  try {
    const ml = await axios.post("http://127.0.0.1:8000/api/ml/chat", { message: msg }, { timeout: 3000 });
    if (ml.data && ml.data.reply) return res.json({ reply: ml.data.reply });
  } catch (e) {}

  if (/^(hi+|hello+|hey+|hii+|namaste|sup|yo|good morning|good evening|howdy|hiya|heya|greetings)[\s!]*$/.test(msg)) {
    return res.json({ reply: pick([
      "Hey " + g + "welcome to OpportunityOS! I am your AI career guide. Looking for internships, hackathons, or scholarships?",
      "Hi " + g + "great to see you! I can help you discover opportunities matched to your skills. What are you looking for?",
      "Hello " + g + "! Ready to find your next big opportunity? Tell me what you need!",
      "Hey there " + g + "! I am here to help you land amazing opportunities. What is on your mind today?",
      "Welcome " + g + "! OpportunityOS has 120+ opportunities waiting for you. What would you like to explore?",
    ])});
  }

  if (msg.includes("how are you") || msg.includes("how r u") || msg.includes("whats up") || msg.includes("what's up")) {
    return res.json({ reply: pick([
      "I am doing great " + g + "thanks! Busy finding amazing opportunities for students like you. What can I help with?",
      "All good! Ready to help you find your dream internship or hackathon. What are you looking for?",
      "Fantastic! Always ready to help students like you find great opportunities. What are you looking for?",
    ])});
  }

  if (msg.includes("thank") || msg.includes("thx") || msg === "ty") {
    return res.json({ reply: pick([
      "You are welcome " + g + "! Best of luck with your applications! Feel free to ask anytime.",
      "Happy to help! Go get that opportunity, you have got this!",
      "Anytime " + g + "! That is what I am here for.",
      "My pleasure! Do not forget to fill your profile for better recommendations!",
    ])});
  }

  if (/^(bye|goodbye|see you|cya|later|exit|quit|bb|ttyl|see ya|good night|goodnight|farewell|take care)[\s!.]*$/.test(msg)) {
    return res.json({ reply: pick([
      "Goodbye " + g + "! Best of luck with your applications. Come back anytime!",
      "See you later! Keep applying, your dream opportunity is out there!",
      "Bye " + g + "! Do not forget to check the Live Now opportunities before you go!",
      "Take care " + g + "! Remember to fill your profile for personalized recommendations!",
    ])});
  }

  const acks = ["ok","okay","sure","cool","got it","nice","great","good","alright","fine","noted","understood","wow","amazing","awesome","perfect","sounds good","yep","yup","yes","nope","nah","lol","haha","hmm","done","finished","clear","makes sense","i see","that helps","helpful","interesting","wonderful","fantastic","excellent","brilliant","all good","all set","sounds great","no problem","np","k","kk","right","correct","exactly","indeed","absolutely","definitely","of course","sure thing","superb","splendid","noted thanks","ok noted","done thanks","ok thanks","okay thanks","got it thanks","perfect thanks","great thanks","awesome thanks","cool thanks","nice one","good one","very helpful","very useful","very good","very nice","very cool","very interesting","very clear","so helpful","so useful","so good","so nice","so cool","so interesting","so clear"];
  if (msg.length < 25 && acks.some(w => msg === w || msg === w + "!" || msg === w + "." || msg.startsWith(w + " ") || msg.endsWith(" " + w))) {
    return res.json({ reply: pick([
      "Got it! What would you like to explore? Internships, hackathons, scholarships, or competitions?",
      "Sure thing! What can I help you with? Ask me about any opportunity or company!",
      "Awesome! Tell me what you are looking for and I will find the best matches for you!",
      "Great! Want personalized recommendations? Say show internships or show hackathons!",
      "Cool! I can help you find opportunities based on your skills. What are you interested in?",
      "Perfect! Is there a specific company or type of opportunity you are looking for?",
      "Noted! What else can I help you with? Internships, hackathons, scholarships, or competitions?",
      "Understood! Ready to help. What are you looking for today?",
    ])});
  }

  if (msg.includes("show internship") || msg === "internships") return res.json({ reply: "Showing internships matched to your profile! Check the cards on the right. Filter by Live Now, Upcoming, or Closed.", action: { type: "filter", category: "Internship", status: "Ongoing" } });
  if (msg.includes("show hackathon") || msg === "hackathons") return res.json({ reply: "Showing hackathons matched to your profile! Check the cards. Filter by Live Now, Upcoming, or Closed.", action: { type: "filter", category: "Hackathon", status: "Ongoing" } });
  if (msg.includes("show scholarship") || msg === "scholarships") return res.json({ reply: "Showing scholarships matched to your profile! Check the cards.", action: { type: "filter", category: "Scholarship", status: "Ongoing" } });
  if (msg.includes("show competition") || msg === "competitions") return res.json({ reply: "Showing competitions matched to your profile! Check the cards.", action: { type: "filter", category: "Competitions", status: "Ongoing" } });
  if (msg.includes("show all") || msg === "home") return res.json({ reply: "Showing all opportunities! Your personalized feed is ready.", action: { type: "filter", category: "All", status: "all" } });
  if (msg.includes("live now") || msg.includes("currently open")) return res.json({ reply: "Showing Live Now opportunities! These are currently open for applications.", action: { type: "status", status: "Ongoing" } });
  if (msg.includes("upcoming") || msg.includes("coming soon")) return res.json({ reply: "Showing Upcoming opportunities! Register early to be prepared.", action: { type: "status", status: "Upcoming" } });

  if (msg.includes("internship") || msg.includes("intern")) {
    if (msg.includes("google")) return res.json({ reply: pick(["Google STEP Internship is live! Deadline: Dec 1, 2025. Hybrid. Perfect for 1st/2nd year students. Tags: Python, Java, Distributed Systems. Click Internships in sidebar!", "Google STEP is one of the most prestigious early-career internships! Frequently converts to a full SWE role. Deadline Dec 2025. Go check Internships!"]) });
    if (msg.includes("microsoft")) return res.json({ reply: pick(["Microsoft SWE Intern is live! Work on Azure, Office 365, or Xbox. Hybrid, 70% return offer rate. Deadline: Nov 15, 2025. Check Internships!", "Microsoft is hiring interns! Tags: Azure, C#, .NET, Cloud. Great stipend + housing. Go to Internships!"]) });
    if (msg.includes("amazon")) return res.json({ reply: pick(["Amazon has TWO live internships: Data Science Intern and SDE Intern for Alexa! Both hybrid. Deadline: Oct 31, 2025. Check Internships!", "Amazon internships are amazing for scale! " + (skills.includes("python") ? "Your Python skills match perfectly! " : "") + "Deadline: Oct 31, 2025. Go check it out!"]) });
    if (msg.includes("netflix")) return res.json({ reply: "Netflix Frontend Engineer Intern is upcoming! Perfect for React/JavaScript developers. Remote. Deadline: Nov 20, 2025. Check Internships!" });
    if (msg.includes("apple")) return res.json({ reply: "Apple iOS Developer Intern is upcoming! Work with Swift, SwiftUI on apps used by 1B+ people. Onsite. Deadline: Oct 1, 2025." });
    if (msg.includes("meta") || msg.includes("facebook")) return res.json({ reply: "Meta AI Research Intern is live! Work on NLP, Computer Vision, Reinforcement Learning. Hybrid. Deadline: Nov 1, 2025." });
    if (msg.includes("nvidia")) return res.json({ reply: "NVIDIA ML Engineer Intern is live! Work on CUDA, Deep Learning, GPU computing. Hybrid. Deadline: Dec 15, 2025." });
    if (msg.includes("remote") || msg.includes("wfh")) return res.json({ reply: "Remote internships: Netflix (Frontend/React), Atlassian (DevOps), Cloudflare (Cloud/Rust), Polygon (Blockchain). All 100% remote! Filter by Internships!" });
    if (msg.includes("apply") || msg.includes("how to")) return res.json({ reply: "Applying is easy! 1. Click Internships in sidebar 2. Choose Live Now/Upcoming 3. Click Apply Now. Fill your profile for better match scores!" });
    if (msg.includes("best") || msg.includes("top") || msg.includes("recommend")) {
      const note = skills.length > 0 ? "Based on your skills (" + skills.slice(0,3).join(", ") + "), " : "Top picks: ";
      return res.json({ reply: note + "I recommend Google STEP, Netflix Frontend, Meta AI Research, and Amazon Data Science! Check Internships!" });
    }
    return res.json({ reply: pick(["We have 30 internships from Google, Microsoft, Netflix, Amazon, NVIDIA, Meta, Apple, Tesla and more! Click Internships in sidebar. Your profile skills determine the match % on each card!", "Internship season is on! 30 opportunities across tech, finance, and research. Click Internships and filter by Live Now, Upcoming, or Closed!", "Looking for internships? We have roles at Google, Microsoft, Netflix, Amazon, NVIDIA. Fill your profile to see which ones match your skills best!"]) });
  }

  if (msg.includes("hackathon") || msg.includes("hack")) {
    if (msg.includes("sih") || msg.includes("smart india")) return res.json({ reply: pick(["Smart India Hackathon 2025 is LIVE! Prize: Rs 1,00,000. Team of 6. Deadline: Aug 30, 2025. Click Hackathons in sidebar!", "SIH 2025 is ongoing! Recognized by every top Indian company. Winning gives Rs 1 lakh + government recognition. Go to Hackathons!"]) });
    if (msg.includes("google")) return res.json({ reply: "Google Solution Challenge 2025 is ongoing! Build solutions for UN SDGs using Google tech. Prize: $3,000 Cloud Credits + Google HQ Trip!" });
    if (msg.includes("eth") || msg.includes("blockchain") || msg.includes("web3")) return res.json({ reply: "ETHIndia 2025 is upcoming! Asia biggest Ethereum hackathon. Prize: $300,000+. Dec 2025. Check Hackathons!" });
    if (msg.includes("beginner") || msg.includes("first time") || msg.includes("starter")) return res.json({ reply: pick(["Perfect for beginners: MLH Global Hack Week (online, beginner-friendly) and Hack This Fall 2025 (hybrid, Rs 1 lakh prize)! Check Hackathons!", "Starting out? Try MLH Global Hack Week, gold standard for student hackathons with workshops and mentors! Also Hack This Fall 2025. Both beginner-friendly!"]) });
    if (msg.includes("prize") || msg.includes("money") || msg.includes("cash")) return res.json({ reply: pick(["Best prizes: ETHIndia ($300,000+), Flipkart Grid (PPO + Rs 75,000), NASSCOM AI (Rs 5 lakh + incubation), Google Solution Challenge ($3,000 + HQ trip)! Check Hackathons!", "Top prize hackathons: ETHIndia 2025 ($300K+), Microsoft Imagine Cup ($100K), Flipkart Grid (PPO + Rs 75K). Go to Hackathons!"]) });
    if (msg.includes("online") || msg.includes("virtual")) return res.json({ reply: "Online hackathons: MLH Global Hack Week, Google Solution Challenge, HackWithInfy, Devpost Global AI Hackathon. All 100% online! Check Hackathons!" });
    return res.json({ reply: pick(["We have 30 hackathons including SIH, Google Solution Challenge, ETHIndia, Flipkart Grid, NASA Space Apps and more! Click Hackathons in sidebar!", "Hackathon season is always on! 30 events for every skill level. Click Hackathons and filter by Live Now, Upcoming, or Closed!", "Ready to hack? From beginner-friendly MLH to advanced ETHIndia. Click Hackathons in the sidebar!"]) });
  }

  if (msg.includes("scholarship") || msg.includes("fellowship") || msg.includes("fund") || msg.includes("financial aid") || msg.includes("stipend")) {
    if (msg.includes("abroad") || msg.includes("international") || msg.includes("usa") || msg.includes("uk") || msg.includes("europe") || msg.includes("foreign")) return res.json({ reply: pick(["International scholarships: Fulbright-Nehru (USA), Chevening (UK), DAAD (Germany), Erasmus Mundus (Europe), Japan MEXT, Gates Cambridge (Oxford), Rhodes Scholarship. Check Scholarships!", "Want to study abroad? Chevening (UK), Fulbright (USA), DAAD (Germany), Erasmus (Europe), all fully funded! Go to Scholarships!"]) });
    if (msg.includes("women") || msg.includes("girl") || msg.includes("female")) return res.json({ reply: "Microsoft Scholarship for Women in STEM is LIVE! $5,000 + mentorship + priority for Microsoft internships. Check Scholarships!" });
    if (msg.includes("india") || msg.includes("indian") || msg.includes("domestic")) return res.json({ reply: pick(["Indian scholarships: KVPY (Rs 5-7K/month), Aditya Birla (Rs 65K/year for IIT/IIM), Reliance Foundation (Rs 2L/year), INSPIRE-DST (Rs 80K/year). Check Scholarships!", "Top Indian scholarships: KVPY, Aditya Birla, Reliance Foundation, INSPIRE-DST, ONGC, Infosys Foundation. Go to Scholarships!"]) });
    if (msg.includes("google")) return res.json({ reply: "Google Generation Scholarship: $10,000 + Google Scholars Retreat. For underrepresented students. Deadline: Dec 2025. Check Scholarships!" });
    if (msg.includes("tata")) return res.json({ reply: "Tata Scholarship for Cornell University: Full tuition + living expenses for Indian students. Deadline: Jan 2026. Check Scholarships!" });
    return res.json({ reply: pick(["We have 30 scholarships from Google, Microsoft, Tata, Fulbright, Chevening, DAAD and more! Click Scholarships in sidebar!", "Scholarship hunting? From KVPY (Rs 7K/month) to full Oxford funding (Rhodes Scholarship)! Click Scholarships to explore!", "30 scholarships covering India and abroad! From Aditya Birla to Gates Cambridge. Click Scholarships and filter by status!"]) });
  }

  if (msg.includes("competition") || msg.includes("contest") || msg.includes("compete") || msg.includes("quiz") || msg.includes("olympiad")) {
    if (msg.includes("coding") || msg.includes("programming") || msg.includes("dsa") || msg.includes("algorithm") || msg.includes("cp")) return res.json({ reply: pick(["Coding competitions: ICPC Asia Regional (world most prestigious CP), LeetCode Weekly (FAANG recruiters watch!), CodeChef Long Challenge, Codeforces Div.2. Check Competitions!", "For competitive programming: ICPC, LeetCode Weekly, CodeChef, Codeforces. Directly monitored by Google, Meta, Amazon recruiters! Check Competitions!"]) });
    if (msg.includes("business") || msg.includes("case") || msg.includes("mba") || msg.includes("consulting")) return res.json({ reply: "Business competitions: Unstop Igniters (PPI + Rs 1L), Tata Imagination Challenge (Rs 3L + internship), Mahindra War Room (Rs 5L), Deloitte Case Competition (PPO). Check Competitions!" });
    if (msg.includes("ml") || msg.includes("ai") || msg.includes("machine learning") || msg.includes("data science") || msg.includes("kaggle")) return res.json({ reply: "AI/ML competitions: Amazon ML Challenge (PPO + Rs 5L), Kaggle Playground ($10K), NASSCOM AI Gamechangers (Rs 5L + incubation). Check Competitions!" });
    return res.json({ reply: pick(["30 competitions including ICPC, Google Code Jam, Amazon ML Challenge, Kaggle, Techfest IIT Bombay! Click Competitions in sidebar!", "Competitions are great for getting noticed by recruiters! Coding, business, ML, and innovation competitions. Click Competitions!"]) });
  }

  if (msg.includes("profile") || msg.includes("personali") || msg.includes("recommend") || msg.includes("match") || msg.includes("my skills") || msg.includes("my interest")) {
    return res.json({ reply: pick(["Fill your profile for personalized recommendations! Click Profile in sidebar, add skills (React, Python, ML etc.) and interests (AI/ML, Web Dev etc.), then Save. Cards reorder by match score!", "Want better recommendations? Add specific skills like React, Node.js, Python and interests like Web Dev, AI/ML in your profile. Match scores jump to 90%+ for relevant opportunities!", "Personalization tip: The more specific your skills and interests, the better your matches! Click Profile in the sidebar to update anytime."]) });
  }

  if (msg.includes("deadline") || msg.includes("closing") || msg.includes("last date") || msg.includes("expire") || msg.includes("due date")) {
    return res.json({ reply: pick(["Upcoming deadlines: Google SWE Intern Dec 1 2025, Netflix Frontend Intern Nov 20 2025, Microsoft SWE Intern Nov 15 2025, ETHIndia 2025 Dec 10 2025. Click Alerts in sidebar for your saved deadlines!", "Do not miss these! SIH 2025 Aug 30 2025 (LIVE), Amazon Data Science Intern Oct 31 2025, Apple iOS Intern Oct 1 2025, Chevening Scholarship Nov 5 2025."]) });
  }

  if (msg.includes("tip") || msg.includes("advice") || msg.includes("how to get") || msg.includes("prepare") || msg.includes("crack") || msg.includes("career")) {
    return res.json({ reply: pick(["Career tips: 1. Fill your profile for better matches 2. Apply to Live Now first, they close soon! 3. Build a GitHub portfolio 4. Participate in 2-3 hackathons per year 5. Track applications in Applied section", "Pro tips: Start with beginner hackathons (MLH, Hack This Fall). Apply to 5+ internships simultaneously. Competitive programming boosts FAANG chances. Scholarships are often underutilized, apply to all you qualify for!", "Want to stand out? 1. Competitive programming (LeetCode, Codeforces) for FAANG 2. Open source contributions for tech companies 3. Hackathon wins for startups 4. Scholarships show academic excellence. OpportunityOS tracks all of these for you!"]) });
  }

  if (msg.includes("help") || msg.includes("how to use") || msg.includes("guide") || msg.includes("tutorial") || msg.includes("how does") || msg.includes("how do i")) {
    return res.json({ reply: pick(["OpportunityOS guide: 1. Fill Profile with skills and interests 2. Browse by category (Internships/Hackathons/Scholarships/Competitions) 3. Filter: Live Now / Upcoming / Closed 4. Click Apply Now 5. Track in Applied section", "Quick start: Profile adds skills for personalized matches. Sidebar tabs browse by category. Status tabs show Live Now / Upcoming / Closed. Search bar finds by company or skill. Trending tags are quick filters. Ask me anything!"]) });
  }

  if (msg.includes("what is") || msg.includes("about") || msg.includes("opportunityos") || msg.includes("this platform") || msg.includes("this app") || msg.includes("this website")) {
    return res.json({ reply: pick(["OpportunityOS is your all-in-one student opportunity platform! We aggregate 120+ internships, hackathons, scholarships, and competitions with AI-powered personalized recommendations based on your profile.", "Think of OpportunityOS as your personal career navigator! We collect opportunities from top companies and rank them based on YOUR skills and interests. Fill your profile and let us do the work!"]) });
  }

  if (msg.includes("saved") || msg.includes("bookmark") || msg.includes("save")) return res.json({ reply: "Click the Save button on any opportunity card to bookmark it! Then click Saved in the sidebar to see all your saved opportunities and track deadlines." });
  if (msg.includes("applied") || msg.includes("application") || msg.includes("track")) return res.json({ reply: "Click Apply Now on any card to track your application! Then click Applied in the sidebar to see all your applications with status and dates." });
  if (msg.includes("search") || msg.includes("find") || msg.includes("look for")) return res.json({ reply: "Use the search bar at the top to search by company name, skill, or keyword! Or use the trending tags (#AI/ML, #WebDev, etc.) to filter instantly. Or just tell me what you are looking for!" });
  if (msg.includes("what can you") || msg.includes("what do you") || msg.includes("your features") || msg.includes("capabilities")) return res.json({ reply: "Here is what I can do for you " + g + "! Find internships by company or skill. Discover hackathons from beginner to advanced. Search scholarships for India and abroad. Explore competitions. Check upcoming deadlines. Update your profile for better matches. Give career tips. Just ask me anything!" });

  return res.json({ reply: pick(["Hmm, I am not sure I understood that! Try asking: Google internships, Hackathons for beginners, Scholarships abroad, or How to improve my recommendations.", "I did not quite catch that! I can help with internships, hackathons, scholarships, competitions, deadlines, and career tips. What are you looking for?", "Let me help you better! Try: React internships, Online hackathons, Indian scholarships, Coding competitions, or Career tips.", "Not sure what you mean, but I am here to help! Ask me about specific companies, skills, or opportunity types. Or say help for a quick guide!"]) });
});

