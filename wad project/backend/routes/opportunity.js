import express from "express";
const router = express.Router();

// status: "Ongoing" | "Upcoming" | "Closed"

const MOCK_OPPORTUNITIES = [

  // ══════════════════════════════════════════
  //  HACKATHONS  (30)
  // ══════════════════════════════════════════
  {
    id:"h1", type:"Hackathon", status:"Ongoing",
    title:"Smart India Hackathon 2025",
    company:"Govt. of India / AICTE",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    description:"India's biggest national-level hackathon. Solve real problem statements from central ministries and PSUs across health, agriculture, education, and smart cities.",
    whyApply:"SIH is recognized by every top Indian company. Winning gives government recognition, ₹1 lakh prize, and a massive resume boost.",
    matchScore:"96%", deadline:"2025-08-30", prize:"₹1,00,000", teamSize:"6", mode:"Offline",
    tags:["GovTech","Social Impact","Full Stack","IoT"],
    applyUrl:"https://www.sih.gov.in"
  },
  {
    id:"h2", type:"Hackathon", status:"Upcoming",
    title:"HackWithInfy 2025",
    company:"Infosys",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    banner:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    description:"Infosys flagship hackathon for engineering students. Build innovative solutions in cloud, cybersecurity, and digital transformation.",
    whyApply:"Top performers receive PPO, cash prizes up to ₹50,000, and direct recognition from Infosys leadership.",
    matchScore:"90%", deadline:"2025-09-15", prize:"PPO + ₹50,000", teamSize:"1-3", mode:"Online",
    tags:["Cloud","Cybersecurity","Digital Transformation"],
    applyUrl:"https://unstop.com/hackathons/hackwithinfy-infosys"
  },
  {
    id:"h3", type:"Hackathon", status:"Upcoming",
    title:"NASA Space Apps Challenge 2025",
    company:"NASA",
    logo:"https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg",
    banner:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    description:"World's largest global hackathon. Use NASA open data to solve challenges related to space exploration, climate change, and Earth observation.",
    whyApply:"Winners get featured on NASA's website, receive exclusive swag, and are invited to NASA facilities.",
    matchScore:"87%", deadline:"2025-10-05", prize:"NASA Recognition + Facility Tour", teamSize:"1-6", mode:"Hybrid",
    tags:["Space","Data Science","Climate","Open Data"],
    applyUrl:"https://www.spaceappschallenge.org"
  },
  {
    id:"h4", type:"Hackathon", status:"Ongoing",
    title:"Google Solution Challenge 2025",
    company:"Google Developer Student Clubs",
    logo:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    banner:"https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&q=80&w=800",
    description:"Build a solution to one of the UN's 17 SDGs using Google technologies. Top 100 teams get mentored by Googlers.",
    whyApply:"Winners get flown to Google HQ, receive $3,000 in Cloud credits, and direct mentorship from Google engineers.",
    matchScore:"94%", deadline:"2025-03-31", prize:"$3,000 Cloud Credits + Google HQ Trip", teamSize:"2-4", mode:"Online",
    tags:["SDGs","Google Cloud","Flutter","Firebase"],
    applyUrl:"https://developers.google.com/community/gdsc-solution-challenge"
  },
  {
    id:"h5", type:"Hackathon", status:"Upcoming",
    title:"Flipkart Grid 7.0",
    company:"Flipkart",
    logo:"https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Flipkart's premier engineering challenge. Solve problems in e-commerce, supply chain, robotics, and AI.",
    whyApply:"Finalists receive PPO offers, ₹75,000 prize money, and direct exposure to Flipkart engineering leadership.",
    matchScore:"91%", deadline:"2025-07-30", prize:"PPO + ₹75,000", teamSize:"2-3", mode:"Hybrid",
    tags:["E-commerce","Supply Chain","Robotics","AI"],
    applyUrl:"https://unstop.com/hackathons/flipkart-grid"
  },
  {
    id:"h6", type:"Hackathon", status:"Ongoing",
    title:"MLH Global Hack Week 2025",
    company:"Major League Hacking",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    description:"A week-long series of mini-hackathons and workshops. Each day focuses on a different theme — AI, open source, game dev, and more.",
    whyApply:"MLH is the gold standard for student hackathons. Build your portfolio, earn digital badges, and connect with developers from 100+ countries.",
    matchScore:"93%", deadline:"2025-07-20", prize:"Swag + Badges + Internship Referrals", teamSize:"1-4", mode:"Online",
    tags:["Open Source","Game Dev","AI","Beginner Friendly"],
    applyUrl:"https://ghw.mlh.io"
  },
  {
    id:"h7", type:"Hackathon", status:"Upcoming",
    title:"ETHIndia 2025",
    company:"Devfolio",
    logo:"https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg",
    banner:"https://images.unsplash.com/photo-1639762681485-074b7f43db16?auto=format&fit=crop&q=80&w=800",
    description:"Asia's biggest Ethereum hackathon. Build DeFi, NFT, DAO, and Layer 2 solutions over 36 hours.",
    whyApply:"ETHIndia is the launchpad for India's top Web3 startups. Winners receive grants and VC introductions.",
    matchScore:"88%", deadline:"2025-12-10", prize:"$300,000+ in prizes", teamSize:"2-5", mode:"Offline",
    tags:["Blockchain","Solidity","DeFi","Web3"],
    applyUrl:"https://ethindia.co"
  },
  {
    id:"h8", type:"Hackathon", status:"Closed",
    title:"Codeforces Round Div. 2 — #950",
    company:"Codeforces",
    logo:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Codeforces_logo.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Competitive programming contest for Div. 2 participants. Rated contest that affects your global Codeforces rating.",
    whyApply:"Codeforces rating is recognized by Google, Meta, and all top tech companies during hiring.",
    matchScore:"85%", deadline:"2025-04-10", prize:"Rating Points + Global Ranking", teamSize:"1", mode:"Online",
    tags:["DSA","Algorithms","Competitive Programming"],
    applyUrl:"https://codeforces.com/contests"
  },
  {
    id:"h9", type:"Hackathon", status:"Upcoming",
    title:"Microsoft Imagine Cup 2025",
    company:"Microsoft",
    logo:"https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    banner:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    description:"Global student technology competition. Build AI-powered solutions that address the world's greatest challenges.",
    whyApply:"Winners receive $100,000, Azure credits, and a mentoring session with Microsoft CEO Satya Nadella.",
    matchScore:"92%", deadline:"2025-09-01", prize:"$100,000 + Azure Credits", teamSize:"1-3", mode:"Online",
    tags:["AI","Azure","Social Impact","Innovation"],
    applyUrl:"https://imaginecup.microsoft.com"
  },
  {
    id:"h10", type:"Hackathon", status:"Ongoing",
    title:"HackBout 2025 — IIT Bombay",
    company:"IIT Bombay",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"IIT Bombay's flagship 36-hour hackathon. Open to all college students across India. Themes include FinTech, HealthTech, and EdTech.",
    whyApply:"Network with IIT students, get mentored by industry experts, and win cash prizes plus internship opportunities.",
    matchScore:"89%", deadline:"2025-05-15", prize:"₹2,00,000 total prize pool", teamSize:"2-4", mode:"Offline",
    tags:["FinTech","HealthTech","EdTech","Innovation"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h11", type:"Hackathon", status:"Upcoming",
    title:"Hack the North 2025",
    company:"University of Waterloo",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Canada's biggest hackathon. 1000+ hackers, 36 hours, unlimited possibilities. Travel reimbursements available.",
    whyApply:"Top recruiters from Google, Facebook, Shopify attend. Past winners have launched successful startups.",
    matchScore:"86%", deadline:"2025-09-20", prize:"Prizes + Recruiter Access", teamSize:"1-4", mode:"Offline",
    tags:["Full Stack","AI","Mobile","Open Innovation"],
    applyUrl:"https://hackthenorth.com"
  },
  {
    id:"h12", type:"Hackathon", status:"Closed",
    title:"Myntra HackerRamp 2024",
    company:"Myntra",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Myntra's fashion-tech hackathon for students. Build innovative solutions for fashion discovery, personalization, and sustainability.",
    whyApply:"Winners receive PPO at Myntra, cash prizes, and featured placement on Myntra's platform.",
    matchScore:"84%", deadline:"2024-12-01", prize:"PPO + ₹1,00,000", teamSize:"2-4", mode:"Online",
    tags:["Fashion Tech","ML","Personalization","Sustainability"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h13", type:"Hackathon", status:"Upcoming",
    title:"Bosch Future Mobility Challenge 2025",
    company:"Bosch",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    description:"Build autonomous driving and smart mobility solutions using Bosch hardware and software platforms.",
    whyApply:"Work with real Bosch hardware, win €10,000, and get fast-tracked into Bosch's graduate program.",
    matchScore:"87%", deadline:"2025-10-30", prize:"€10,000 + Graduate Program", teamSize:"3-5", mode:"Hybrid",
    tags:["Autonomous Driving","IoT","Embedded Systems","AI"],
    applyUrl:"https://www.bosch.com/careers"
  },
  {
    id:"h14", type:"Hackathon", status:"Ongoing",
    title:"PayTM Build for India Hackathon",
    company:"PayTM",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Build FinTech solutions for India's next billion users. Focus on payments, lending, insurance, and financial inclusion.",
    whyApply:"Winners get PPO at PayTM, ₹5 lakh prize pool, and direct mentorship from PayTM's CTO.",
    matchScore:"88%", deadline:"2025-06-30", prize:"₹5,00,000 + PPO", teamSize:"2-4", mode:"Online",
    tags:["FinTech","Payments","Financial Inclusion","Mobile"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h15", type:"Hackathon", status:"Upcoming",
    title:"HackMIT 2025",
    company:"MIT",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"MIT's annual hackathon bringing together 1000+ students from around the world for 24 hours of building.",
    whyApply:"Network with MIT students and top tech recruiters. Past participants have gone on to found billion-dollar companies.",
    matchScore:"91%", deadline:"2025-09-13", prize:"$10,000 + Internship Offers", teamSize:"1-4", mode:"Offline",
    tags:["AI","Robotics","Web3","Open Innovation"],
    applyUrl:"https://hackmit.org"
  },
  {
    id:"h16", type:"Hackathon", status:"Closed",
    title:"Walmart Sparkathon 2024",
    company:"Walmart",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Walmart's tech hackathon focused on retail innovation, supply chain optimization, and customer experience.",
    whyApply:"Winners receive PPO at Walmart Global Tech India, ₹3 lakh prize, and direct interview fast-track.",
    matchScore:"86%", deadline:"2024-11-30", prize:"PPO + ₹3,00,000", teamSize:"2-4", mode:"Hybrid",
    tags:["Retail Tech","Supply Chain","AI","Customer Experience"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h17", type:"Hackathon", status:"Upcoming",
    title:"Devpost Global AI Hackathon 2025",
    company:"Devpost",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Build AI-powered applications using the latest LLMs, computer vision, and generative AI tools.",
    whyApply:"$50,000 prize pool, global exposure, and direct partnerships with leading AI companies.",
    matchScore:"93%", deadline:"2025-08-15", prize:"$50,000 total prizes", teamSize:"1-4", mode:"Online",
    tags:["AI","LLM","Generative AI","Computer Vision"],
    applyUrl:"https://devpost.com/hackathons"
  },
  {
    id:"h18", type:"Hackathon", status:"Ongoing",
    title:"Accenture Innovation Challenge 2025",
    company:"Accenture",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Solve real business problems for Accenture's Fortune 500 clients using emerging technologies.",
    whyApply:"Winners receive PPO at Accenture, ₹2 lakh prize, and global project exposure.",
    matchScore:"87%", deadline:"2025-06-15", prize:"PPO + ₹2,00,000", teamSize:"2-5", mode:"Online",
    tags:["Consulting","Digital Transformation","AI","Cloud"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h19", type:"Hackathon", status:"Upcoming",
    title:"TreeHacks 2025 — Stanford",
    company:"Stanford University",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Stanford's annual hackathon with a focus on social impact. 36 hours, world-class mentors, and amazing prizes.",
    whyApply:"Access to Stanford's network, top-tier mentors from Silicon Valley, and $15,000 in prizes.",
    matchScore:"89%", deadline:"2025-02-15", prize:"$15,000 + Mentorship", teamSize:"1-4", mode:"Offline",
    tags:["Social Impact","AI","Health","Education"],
    applyUrl:"https://treehacks.com"
  },
  {
    id:"h20", type:"Hackathon", status:"Closed",
    title:"Zomato HackFest 2024",
    company:"Zomato",
    logo:"https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    banner:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    description:"Zomato's internal hackathon open to students. Build solutions for food delivery, restaurant discovery, and logistics.",
    whyApply:"Winners get PPO at Zomato, ₹2 lakh prize, and their solution potentially shipped to millions of users.",
    matchScore:"85%", deadline:"2024-10-31", prize:"PPO + ₹2,00,000", teamSize:"2-3", mode:"Online",
    tags:["Food Tech","Logistics","Mobile","AI"],
    applyUrl:"https://www.zomato.com/careers"
  },
  {
    id:"h21", type:"Hackathon", status:"Upcoming",
    title:"HackCBS 8.0 — Delhi University",
    company:"Delhi University",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"One of Delhi's biggest student-run hackathons. 24 hours, 500+ participants, multiple tracks.",
    whyApply:"Great networking opportunity, ₹1 lakh prize pool, and direct recruiter access from top startups.",
    matchScore:"83%", deadline:"2025-11-10", prize:"₹1,00,000 total", teamSize:"2-4", mode:"Offline",
    tags:["Open Innovation","Web Dev","AI","Mobile"],
    applyUrl:"https://hackcbs.tech"
  },
  {
    id:"h22", type:"Hackathon", status:"Ongoing",
    title:"Deloitte Hackathon 2025",
    company:"Deloitte",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Deloitte's national hackathon for students. Solve real consulting and technology challenges faced by Deloitte's clients.",
    whyApply:"Winners receive PPO at Deloitte, ₹1.5 lakh prize, and fast-track to Deloitte's graduate program.",
    matchScore:"86%", deadline:"2025-07-01", prize:"PPO + ₹1,50,000", teamSize:"2-4", mode:"Hybrid",
    tags:["Consulting","Data Analytics","Cloud","Strategy"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h23", type:"Hackathon", status:"Upcoming",
    title:"Open Source Hack — GitHub",
    company:"GitHub",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"GitHub's global open source hackathon. Contribute to open source projects or build new ones during this 48-hour event.",
    whyApply:"Get GitHub swag, recognition on GitHub's official blog, and connect with the global open source community.",
    matchScore:"90%", deadline:"2025-10-01", prize:"GitHub Swag + Recognition", teamSize:"1-5", mode:"Online",
    tags:["Open Source","Git","Community","Collaboration"],
    applyUrl:"https://github.com"
  },
  {
    id:"h24", type:"Hackathon", status:"Closed",
    title:"Bajaj Finserv Hackathon 2024",
    company:"Bajaj Finserv",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"FinTech hackathon focused on lending, insurance, and wealth management solutions for India.",
    whyApply:"Winners receive PPO at Bajaj Finserv, ₹3 lakh prize, and direct mentorship from CXOs.",
    matchScore:"84%", deadline:"2024-09-30", prize:"PPO + ₹3,00,000", teamSize:"2-4", mode:"Hybrid",
    tags:["FinTech","Insurance","Lending","Mobile"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h25", type:"Hackathon", status:"Upcoming",
    title:"Hack36 — NIT Agartala",
    company:"NIT Agartala",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"36-hour hackathon at NIT Agartala. Tracks include AI/ML, Web3, IoT, and Social Impact.",
    whyApply:"₹80,000 prize pool, mentorship from industry experts, and networking with NIT students.",
    matchScore:"82%", deadline:"2025-08-20", prize:"₹80,000 total", teamSize:"2-4", mode:"Offline",
    tags:["AI/ML","Web3","IoT","Social Impact"],
    applyUrl:"https://hack36.com"
  },
  {
    id:"h26", type:"Hackathon", status:"Ongoing",
    title:"Swiggy Hunger Hack 2025",
    company:"Swiggy",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    description:"Swiggy's student hackathon. Build solutions for hyperlocal delivery, restaurant tech, and customer experience.",
    whyApply:"Winners get PPO at Swiggy, ₹2 lakh prize, and their solution potentially deployed to 50M+ users.",
    matchScore:"87%", deadline:"2025-06-20", prize:"PPO + ₹2,00,000", teamSize:"2-3", mode:"Online",
    tags:["Food Tech","Hyperlocal","Logistics","AI"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h27", type:"Hackathon", status:"Upcoming",
    title:"HackJNU 2025",
    company:"JNU Delhi",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"JNU's annual hackathon with focus on social impact, governance, and public policy tech solutions.",
    whyApply:"Unique opportunity to build tech for social good, ₹50,000 prize, and NGO partnership opportunities.",
    matchScore:"80%", deadline:"2025-09-05", prize:"₹50,000 + NGO Partnerships", teamSize:"2-4", mode:"Offline",
    tags:["Social Impact","GovTech","Policy","Open Data"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"h28", type:"Hackathon", status:"Closed",
    title:"Razorpay FTX Hackathon 2024",
    company:"Razorpay",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Razorpay's payments hackathon. Build innovative payment solutions, checkout experiences, and financial APIs.",
    whyApply:"Winners receive PPO at Razorpay, ₹2.5 lakh prize, and their API potentially integrated into Razorpay's platform.",
    matchScore:"88%", deadline:"2024-08-31", prize:"PPO + ₹2,50,000", teamSize:"2-4", mode:"Online",
    tags:["Payments","FinTech","API","Developer Tools"],
    applyUrl:"https://razorpay.com/careers"
  },
  {
    id:"h29", type:"Hackathon", status:"Upcoming",
    title:"Hack This Fall 2025",
    company:"Hack This Fall",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    description:"India's most inclusive hackathon. Beginner-friendly with mentors, workshops, and multiple tracks.",
    whyApply:"Perfect for first-time hackers. ₹1 lakh prize pool, amazing swag, and a supportive community.",
    matchScore:"85%", deadline:"2025-10-25", prize:"₹1,00,000 + Swag", teamSize:"1-4", mode:"Hybrid",
    tags:["Beginner Friendly","Open Innovation","Community","Learning"],
    applyUrl:"https://hackthisfall.tech"
  },
  {
    id:"h30", type:"Hackathon", status:"Ongoing",
    title:"NASSCOM AI Gamechangers 2025",
    company:"NASSCOM",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"NASSCOM's national AI hackathon. Build AI solutions for healthcare, agriculture, education, and governance.",
    whyApply:"Winners get ₹5 lakh prize, incubation support from NASSCOM, and media coverage across India.",
    matchScore:"91%", deadline:"2025-07-15", prize:"₹5,00,000 + Incubation", teamSize:"2-5", mode:"Online",
    tags:["AI","Healthcare","Agriculture","Governance"],
    applyUrl:"https://nasscom.in"
  },

  // ══════════════════════════════════════════
  //  INTERNSHIPS  (30)
  // ══════════════════════════════════════════
  {
    id:"i1", type:"Internship", status:"Ongoing",
    title:"Software Engineering Intern (STEP)",
    company:"Google",
    logo:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    banner:"https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    description:"Google's STEP internship for first and second year undergrads. Work on real Google products with a dedicated mentor.",
    whyApply:"Google STEP frequently converts to a full SWE internship the following year and then a full-time offer.",
    matchScore:"98%", deadline:"2025-12-01", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Backend","Distributed Systems","Python","Java"],
    applyUrl:"https://careers.google.com/jobs/results/?category=INTERNSHIP"
  },
  {
    id:"i2", type:"Internship", status:"Ongoing",
    title:"Software Engineer Intern",
    company:"Microsoft",
    logo:"https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    banner:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    description:"Join Microsoft as a Software Engineer Intern and work on Azure, Office 365, Xbox, or Bing. Own a real project and ship code to production.",
    whyApply:"Microsoft internships are fully paid with housing stipends and offer return offer rates above 70%.",
    matchScore:"95%", deadline:"2025-11-15", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Azure","C#",".NET","Cloud"],
    applyUrl:"https://careers.microsoft.com/students/us/en/usuniversityinternship"
  },
  {
    id:"i3", type:"Internship", status:"Upcoming",
    title:"Frontend Engineer Intern",
    company:"Netflix",
    logo:"https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    banner:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
    description:"Build the UI that 260 million subscribers interact with daily. Work on Netflix's React-based frontend and A/B testing infrastructure.",
    whyApply:"Netflix has one of the best engineering cultures in the world. You'll be responsible for screens viewed by millions every day.",
    matchScore:"99%", deadline:"2025-11-20", prize:null, teamSize:null, mode:"Remote",
    tags:["React","UI/UX","JavaScript","Performance"],
    applyUrl:"https://jobs.netflix.com/search?q=intern"
  },
  {
    id:"i4", type:"Internship", status:"Ongoing",
    title:"Data Science Intern",
    company:"Amazon",
    logo:"https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    banner:"https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=800",
    description:"Work with Amazon's massive datasets to build ML models that power product recommendations, fraud detection, and supply chain optimization.",
    whyApply:"Amazon's scale is unmatched — your models will impact millions of customers with a high return offer rate.",
    matchScore:"93%", deadline:"2025-10-31", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Python","ML","AWS","Data Science"],
    applyUrl:"https://www.amazon.jobs/en/search?base_query=intern"
  },
  {
    id:"i5", type:"Internship", status:"Upcoming",
    title:"Product Management Intern",
    company:"Flipkart",
    logo:"https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Emblem.png",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Drive product strategy for one of India's largest e-commerce platforms. Work with engineering, design, and business teams.",
    whyApply:"Flipkart's PM internship is one of the most sought-after in India with real ownership and a strong shot at PPO.",
    matchScore:"89%", deadline:"2025-09-30", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Product","Strategy","Analytics","E-commerce"],
    applyUrl:"https://unstop.com/internships/flipkart"
  },
  {
    id:"i6", type:"Internship", status:"Ongoing",
    title:"ML Engineer Intern",
    company:"NVIDIA",
    logo:"https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Work on deep learning frameworks, GPU-accelerated computing, and AI model optimization at NVIDIA.",
    whyApply:"NVIDIA is at the center of the AI revolution. This internship puts you at the frontier of GPU computing.",
    matchScore:"91%", deadline:"2025-12-15", prize:null, teamSize:null, mode:"Hybrid",
    tags:["CUDA","Deep Learning","Python","C++"],
    applyUrl:"https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite"
  },
  {
    id:"i7", type:"Internship", status:"Closed",
    title:"Android Developer Intern",
    company:"Zomato",
    logo:"https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
    banner:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    description:"Build features for Zomato's Android app used by 80 million+ users using Kotlin and Jetpack Compose.",
    whyApply:"You'll ship code to millions of users within weeks and have a real shot at a PPO.",
    matchScore:"87%", deadline:"2025-04-15", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Android","Kotlin","Jetpack Compose","Mobile"],
    applyUrl:"https://www.zomato.com/careers"
  },
  {
    id:"i8", type:"Internship", status:"Upcoming",
    title:"Backend Engineer Intern",
    company:"Razorpay",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Build scalable payment infrastructure handling millions of transactions daily. Work with Go, Java, and distributed systems.",
    whyApply:"Razorpay processes $60B+ annually. Your code will directly impact India's payment ecosystem.",
    matchScore:"92%", deadline:"2025-08-01", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Go","Java","Distributed Systems","Payments"],
    applyUrl:"https://razorpay.com/careers"
  },
  {
    id:"i9", type:"Internship", status:"Ongoing",
    title:"AI Research Intern",
    company:"Meta",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Work on cutting-edge AI research at Meta AI. Projects span NLP, computer vision, and reinforcement learning.",
    whyApply:"Meta AI is home to some of the world's best AI researchers. Your work could be published at top conferences like NeurIPS or ICML.",
    matchScore:"94%", deadline:"2025-11-01", prize:null, teamSize:null, mode:"Hybrid",
    tags:["AI Research","NLP","Computer Vision","PyTorch"],
    applyUrl:"https://www.metacareers.com/jobs"
  },
  {
    id:"i10", type:"Internship", status:"Upcoming",
    title:"iOS Developer Intern",
    company:"Apple",
    logo:"https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    banner:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    description:"Build features for iOS apps used by over a billion people. Work with Swift, SwiftUI, and Apple's latest frameworks.",
    whyApply:"Apple internships are among the most prestigious in tech. You'll work on products that define the industry.",
    matchScore:"96%", deadline:"2025-10-01", prize:null, teamSize:null, mode:"Onsite",
    tags:["Swift","SwiftUI","iOS","Mobile"],
    applyUrl:"https://jobs.apple.com/en-us/search?team=internships"
  },
  {
    id:"i11", type:"Internship", status:"Ongoing",
    title:"DevOps Intern",
    company:"Atlassian",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Work on CI/CD pipelines, Kubernetes clusters, and cloud infrastructure for Jira, Confluence, and Bitbucket.",
    whyApply:"Atlassian's remote-first culture and world-class engineering team make this one of the best DevOps internships available.",
    matchScore:"88%", deadline:"2025-09-15", prize:null, teamSize:null, mode:"Remote",
    tags:["DevOps","Kubernetes","CI/CD","AWS"],
    applyUrl:"https://www.atlassian.com/company/careers"
  },
  {
    id:"i12", type:"Internship", status:"Closed",
    title:"Cybersecurity Intern",
    company:"Palo Alto Networks",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Work on threat detection, vulnerability research, and security automation at one of the world's leading cybersecurity companies.",
    whyApply:"Palo Alto Networks is the #1 cybersecurity company. This internship opens doors to the most in-demand security roles.",
    matchScore:"89%", deadline:"2025-03-31", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Cybersecurity","Threat Detection","Python","Security"],
    applyUrl:"https://www.paloaltonetworks.com/company/careers"
  },
  {
    id:"i13", type:"Internship", status:"Upcoming",
    title:"Full Stack Developer Intern",
    company:"Swiggy",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    description:"Build features for Swiggy's web and mobile platforms serving 50M+ users. Work with React, Node.js, and microservices.",
    whyApply:"Swiggy's fast-paced engineering culture means you'll ship real features to millions of users within your first month.",
    matchScore:"90%", deadline:"2025-08-15", prize:null, teamSize:null, mode:"Hybrid",
    tags:["React","Node.js","Microservices","Full Stack"],
    applyUrl:"https://careers.swiggy.com"
  },
  {
    id:"i14", type:"Internship", status:"Ongoing",
    title:"Blockchain Developer Intern",
    company:"Polygon",
    logo:"https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg",
    banner:"https://images.unsplash.com/photo-1639762681485-074b7f43db16?auto=format&fit=crop&q=80&w=800",
    description:"Build on Polygon's Layer 2 blockchain infrastructure. Work on smart contracts, DeFi protocols, and Web3 tooling.",
    whyApply:"Polygon is one of the most used blockchains globally. This internship puts you at the forefront of Web3 development.",
    matchScore:"86%", deadline:"2025-07-31", prize:null, teamSize:null, mode:"Remote",
    tags:["Blockchain","Solidity","Web3","DeFi"],
    applyUrl:"https://polygon.technology/careers"
  },
  {
    id:"i15", type:"Internship", status:"Upcoming",
    title:"Data Engineering Intern",
    company:"Uber",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    description:"Build data pipelines processing billions of trips. Work with Apache Spark, Kafka, and Uber's internal data platform.",
    whyApply:"Uber's data scale is unmatched. You'll work on infrastructure that powers real-time decisions for millions of rides.",
    matchScore:"91%", deadline:"2025-10-15", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Data Engineering","Spark","Kafka","Python"],
    applyUrl:"https://www.uber.com/us/en/careers"
  },
  {
    id:"i16", type:"Internship", status:"Closed",
    title:"UX Design Intern",
    company:"Adobe",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    description:"Design user experiences for Adobe's Creative Cloud products used by 30M+ creatives worldwide.",
    whyApply:"Adobe is the gold standard for design tools. This internship gives you direct access to world-class design mentors.",
    matchScore:"87%", deadline:"2025-02-28", prize:null, teamSize:null, mode:"Hybrid",
    tags:["UX Design","Figma","User Research","Prototyping"],
    applyUrl:"https://www.adobe.com/careers.html"
  },
  {
    id:"i17", type:"Internship", status:"Upcoming",
    title:"Quant Research Intern",
    company:"Goldman Sachs",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Work on quantitative models for trading, risk management, and portfolio optimization at Goldman Sachs.",
    whyApply:"Goldman Sachs is the pinnacle of finance. This internship opens doors to the most lucrative careers in quantitative finance.",
    matchScore:"88%", deadline:"2025-11-30", prize:null, teamSize:null, mode:"Onsite",
    tags:["Quant Finance","Python","Statistics","ML"],
    applyUrl:"https://www.goldmansachs.com/careers"
  },
  {
    id:"i18", type:"Internship", status:"Ongoing",
    title:"Cloud Infrastructure Intern",
    company:"Cloudflare",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Work on Cloudflare's global network infrastructure serving 20% of the internet. Build edge computing solutions.",
    whyApply:"Cloudflare's infrastructure powers the internet. Your work will directly impact billions of web requests daily.",
    matchScore:"90%", deadline:"2025-08-31", prize:null, teamSize:null, mode:"Remote",
    tags:["Cloud","Edge Computing","Rust","Networking"],
    applyUrl:"https://www.cloudflare.com/careers"
  },
  {
    id:"i19", type:"Internship", status:"Upcoming",
    title:"SDE Intern",
    company:"Paytm",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Build features for Paytm's super app serving 350M+ users. Work on payments, banking, and commerce features.",
    whyApply:"Paytm is India's largest fintech. You'll work on products used by hundreds of millions of Indians daily.",
    matchScore:"86%", deadline:"2025-09-01", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Java","Spring Boot","Payments","Mobile"],
    applyUrl:"https://paytm.com/careers"
  },
  {
    id:"i20", type:"Internship", status:"Closed",
    title:"Research Intern — NLP",
    company:"OpenAI",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Work on large language models, alignment research, and AI safety at OpenAI. Contribute to the future of AI.",
    whyApply:"OpenAI is defining the future of AI. This is one of the most competitive and impactful internships in the world.",
    matchScore:"97%", deadline:"2025-01-31", prize:null, teamSize:null, mode:"Onsite",
    tags:["NLP","LLM","AI Safety","Python"],
    applyUrl:"https://openai.com/careers"
  },
  {
    id:"i21", type:"Internship", status:"Upcoming",
    title:"Hardware Engineering Intern",
    company:"Tesla",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    description:"Work on Tesla's electric vehicle hardware, battery systems, and Autopilot hardware at Tesla's Gigafactory.",
    whyApply:"Tesla is revolutionizing transportation. This internship gives you hands-on experience with cutting-edge EV technology.",
    matchScore:"89%", deadline:"2025-10-20", prize:null, teamSize:null, mode:"Onsite",
    tags:["Hardware","EV","Embedded Systems","C++"],
    applyUrl:"https://www.tesla.com/careers"
  },
  {
    id:"i22", type:"Internship", status:"Ongoing",
    title:"Growth & Analytics Intern",
    company:"CRED",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Drive growth experiments and analytics for CRED's premium credit card platform. Work with SQL, Python, and A/B testing.",
    whyApply:"CRED is India's fastest-growing fintech. You'll run experiments that directly impact millions of premium users.",
    matchScore:"85%", deadline:"2025-07-15", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Analytics","SQL","Python","Growth"],
    applyUrl:"https://careers.cred.club"
  },
  {
    id:"i23", type:"Internship", status:"Upcoming",
    title:"Embedded Systems Intern",
    company:"Qualcomm",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Work on Snapdragon chip firmware, 5G modem software, and AI accelerator drivers at Qualcomm.",
    whyApply:"Qualcomm powers billions of devices. This internship gives you deep expertise in the chips that run the world.",
    matchScore:"88%", deadline:"2025-11-01", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Embedded Systems","C","5G","RTOS"],
    applyUrl:"https://www.qualcomm.com/company/careers"
  },
  {
    id:"i24", type:"Internship", status:"Closed",
    title:"Marketing Tech Intern",
    company:"HubSpot",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Build marketing automation tools and CRM integrations at HubSpot. Work with JavaScript, Python, and HubSpot APIs.",
    whyApply:"HubSpot is the leader in inbound marketing. This internship gives you expertise in the fastest-growing area of tech.",
    matchScore:"83%", deadline:"2025-03-15", prize:null, teamSize:null, mode:"Remote",
    tags:["Marketing Tech","JavaScript","CRM","APIs"],
    applyUrl:"https://www.hubspot.com/careers"
  },
  {
    id:"i25", type:"Internship", status:"Upcoming",
    title:"Space Systems Intern",
    company:"ISRO",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
    description:"Work on satellite systems, launch vehicle software, and space mission planning at India's premier space agency.",
    whyApply:"ISRO is India's pride. This internship gives you unparalleled experience in space technology and national service.",
    matchScore:"90%", deadline:"2025-08-01", prize:null, teamSize:null, mode:"Onsite",
    tags:["Space Tech","Embedded Systems","MATLAB","Aerospace"],
    applyUrl:"https://www.isro.gov.in/careers"
  },
  {
    id:"i26", type:"Internship", status:"Ongoing",
    title:"SDE Intern — Alexa",
    company:"Amazon",
    logo:"https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    banner:"https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=800",
    description:"Build features for Alexa, the world's most popular voice assistant. Work on NLP, voice UX, and smart home integrations.",
    whyApply:"Alexa has 500M+ users. Your features will be used by hundreds of millions of people around the world.",
    matchScore:"92%", deadline:"2025-10-01", prize:null, teamSize:null, mode:"Hybrid",
    tags:["NLP","Voice AI","Python","AWS"],
    applyUrl:"https://www.amazon.jobs/en/search?base_query=alexa+intern"
  },
  {
    id:"i27", type:"Internship", status:"Upcoming",
    title:"Robotics Software Intern",
    company:"Boston Dynamics",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Work on motion planning, perception, and control systems for Spot and Atlas robots at Boston Dynamics.",
    whyApply:"Boston Dynamics is the world leader in advanced robotics. This is one of the most exciting internships in engineering.",
    matchScore:"91%", deadline:"2025-09-30", prize:null, teamSize:null, mode:"Onsite",
    tags:["Robotics","ROS","C++","Motion Planning"],
    applyUrl:"https://www.bostondynamics.com/careers"
  },
  {
    id:"i28", type:"Internship", status:"Closed",
    title:"Finance Intern",
    company:"JP Morgan",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Work on investment banking, trading, or technology teams at JP Morgan. Gain exposure to global financial markets.",
    whyApply:"JP Morgan is the world's largest bank. This internship is a gateway to the most prestigious careers in finance.",
    matchScore:"86%", deadline:"2025-04-30", prize:null, teamSize:null, mode:"Onsite",
    tags:["Finance","Investment Banking","Python","Excel"],
    applyUrl:"https://careers.jpmorgan.com/us/en/students/programs"
  },
  {
    id:"i29", type:"Internship", status:"Upcoming",
    title:"AR/VR Developer Intern",
    company:"Snap Inc.",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    description:"Build augmented reality lenses and experiences for Snapchat's 400M+ daily users using Lens Studio.",
    whyApply:"Snap is the leader in AR. Your lenses could be used by hundreds of millions of people around the world.",
    matchScore:"87%", deadline:"2025-10-10", prize:null, teamSize:null, mode:"Hybrid",
    tags:["AR/VR","Lens Studio","3D","JavaScript"],
    applyUrl:"https://careers.snap.com"
  },
  {
    id:"i30", type:"Internship", status:"Ongoing",
    title:"SDE Intern — Payments",
    company:"PhonePe",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Build payment features for PhonePe's UPI platform serving 500M+ users. Work on high-scale distributed systems.",
    whyApply:"PhonePe processes $1 trillion+ in transactions. Your code will directly power India's digital payment revolution.",
    matchScore:"89%", deadline:"2025-07-31", prize:null, teamSize:null, mode:"Hybrid",
    tags:["Java","Distributed Systems","UPI","Payments"],
    applyUrl:"https://www.phonepe.com/careers"
  },

  // ══════════════════════════════════════════
  //  SCHOLARSHIPS  (30)
  // ══════════════════════════════════════════
  {
    id:"s1", type:"Scholarship", status:"Ongoing",
    title:"Microsoft Scholarship for Women in STEM",
    company:"Microsoft",
    logo:"https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    banner:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    description:"Microsoft's scholarship supporting women pursuing undergraduate degrees in CS, engineering, or related STEM fields.",
    whyApply:"Beyond financial support, Microsoft provides direct mentorship and priority consideration for Microsoft internships.",
    matchScore:"85%", deadline:"2025-10-31", prize:"$5,000 + Mentorship", teamSize:null, mode:null,
    tags:["Women in Tech","STEM","CS","Undergraduate"],
    applyUrl:"https://careers.microsoft.com/students/us/en/scholarships"
  },
  {
    id:"s2", type:"Scholarship", status:"Upcoming",
    title:"Google Generation Scholarship",
    company:"Google",
    logo:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    banner:"https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    description:"Google's scholarship for students from underrepresented groups in tech. Includes financial award and Google Scholars' Retreat.",
    whyApply:"The Google Scholars' Retreat is an exclusive networking event at Google's campus with direct career guidance.",
    matchScore:"88%", deadline:"2025-12-01", prize:"$10,000 + Google Retreat", teamSize:null, mode:null,
    tags:["Diversity","Underrepresented","CS","Undergraduate"],
    applyUrl:"https://buildyourfuture.withgoogle.com/scholarships"
  },
  {
    id:"s3", type:"Scholarship", status:"Upcoming",
    title:"Tata Scholarship for Cornell University",
    company:"Tata Education & Development Trust",
    logo:"https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Full financial aid for Indian students admitted to Cornell University's undergraduate programs.",
    whyApply:"One of the most generous scholarships for Indian students for US education — covers 100% of demonstrated financial need.",
    matchScore:"82%", deadline:"2026-01-02", prize:"Full Tuition + Living Expenses", teamSize:null, mode:null,
    tags:["International","Ivy League","Full Funding","India"],
    applyUrl:"https://sfs.cornell.edu/aid-available/scholarships-and-grants/tata-scholarship"
  },
  {
    id:"s4", type:"Scholarship", status:"Closed",
    title:"Aditya Birla Scholarship",
    company:"Aditya Birla Group",
    logo:"https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Prestigious scholarship for top-ranking students at IITs, IIMs, BITS Pilani, and other premier institutions.",
    whyApply:"One of India's most prestigious awards with a strong alumni network and priority hiring consideration.",
    matchScore:"86%", deadline:"2025-04-15", prize:"₹65,000/year + Stipend", teamSize:null, mode:null,
    tags:["IIT","IIM","BITS","Merit-based"],
    applyUrl:"https://adityabirlascholars.net"
  },
  {
    id:"s5", type:"Scholarship", status:"Upcoming",
    title:"KVPY Fellowship",
    company:"Dept. of Science & Technology, Govt. of India",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"National fellowship to encourage students with aptitude for research in basic sciences.",
    whyApply:"KVPY opens doors to IISc, IISERs, and top research labs. The fellowship continues through your PhD.",
    matchScore:"80%", deadline:"2025-11-30", prize:"₹5,000–7,000/month Fellowship", teamSize:null, mode:null,
    tags:["Science","Research","Fellowship","Undergraduate"],
    applyUrl:"https://kvpy.iisc.ac.in"
  },
  {
    id:"s6", type:"Scholarship", status:"Ongoing",
    title:"Reliance Foundation Undergraduate Scholarship",
    company:"Reliance Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for meritorious undergraduate students from economically disadvantaged backgrounds pursuing STEM or humanities.",
    whyApply:"₹2 lakh per year, mentorship from Reliance leaders, and networking with India's top business community.",
    matchScore:"84%", deadline:"2025-07-31", prize:"₹2,00,000/year", teamSize:null, mode:null,
    tags:["Merit-based","Need-based","STEM","Undergraduate"],
    applyUrl:"https://www.reliancefoundation.org/scholarships"
  },
  {
    id:"s7", type:"Scholarship", status:"Upcoming",
    title:"Fulbright-Nehru Master's Fellowship",
    company:"US-India Educational Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Prestigious fellowship for Indian students to pursue a Master's degree at a US university. Covers tuition, living, and travel.",
    whyApply:"Fulbright is the most prestigious US government scholarship. It opens doors to the best US universities and global networks.",
    matchScore:"83%", deadline:"2025-10-15", prize:"Full Funding + Stipend", teamSize:null, mode:null,
    tags:["International","Masters","US Education","Research"],
    applyUrl:"https://www.usief.org.in/Fellowships/Fulbright-Nehru-Master-s-Fellowships.aspx"
  },
  {
    id:"s8", type:"Scholarship", status:"Closed",
    title:"HDFC Bank Parivartan Scholarship",
    company:"HDFC Bank",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for meritorious students from economically weaker sections pursuing professional courses.",
    whyApply:"₹75,000 per year with no bond or service obligation. One of India's most accessible merit-cum-means scholarships.",
    matchScore:"81%", deadline:"2025-03-31", prize:"₹75,000/year", teamSize:null, mode:null,
    tags:["Need-based","Merit-based","Professional Courses","India"],
    applyUrl:"https://www.hdfcbank.com/content/bbp/repositories/723fb80a-2dde-42a3-9793-7ae1be57c87f/?folderPath=/OtherDocuments/CSR/Parivartan/Scholarship"
  },
  {
    id:"s9", type:"Scholarship", status:"Upcoming",
    title:"Inlaks Shivdasani Foundation Scholarship",
    company:"Inlaks Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for exceptional Indian students to pursue postgraduate studies at top universities in the US, UK, or Europe.",
    whyApply:"Covers full tuition, living expenses, and travel. One of the most competitive and prestigious scholarships for Indian students.",
    matchScore:"82%", deadline:"2025-04-01", prize:"Full Funding up to $100,000", teamSize:null, mode:null,
    tags:["International","Postgraduate","US","UK"],
    applyUrl:"https://www.inlaksfoundation.org/scholarships"
  },
  {
    id:"s10", type:"Scholarship", status:"Ongoing",
    title:"National Talent Search Examination (NTSE)",
    company:"NCERT",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"India's most prestigious scholarship exam for Class 10 students. Provides monthly stipend throughout undergraduate and postgraduate studies.",
    whyApply:"NTSE scholarship is recognized by all Indian universities and provides financial support throughout your academic career.",
    matchScore:"78%", deadline:"2025-09-01", prize:"₹1,250–2,000/month", teamSize:null, mode:null,
    tags:["Class 10","Merit-based","Science","Mathematics"],
    applyUrl:"https://ncert.nic.in/national-talent-examination.php"
  },
  {
    id:"s11", type:"Scholarship", status:"Upcoming",
    title:"Chevening Scholarship",
    company:"UK Government",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"UK government's global scholarship for future leaders. Fully funded Master's degree at any UK university.",
    whyApply:"Chevening is the UK's most prestigious scholarship. Join a global network of 50,000+ Chevening alumni in 160+ countries.",
    matchScore:"84%", deadline:"2025-11-05", prize:"Full Funding + Living Allowance", teamSize:null, mode:null,
    tags:["UK","Masters","Leadership","International"],
    applyUrl:"https://www.chevening.org/scholarships"
  },
  {
    id:"s12", type:"Scholarship", status:"Closed",
    title:"ONGC Scholarship",
    company:"ONGC",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"ONGC's scholarship for SC/ST and OBC students pursuing professional courses in engineering, medicine, and MBA.",
    whyApply:"₹48,000 per year with no bond. One of India's most accessible scholarships for students from reserved categories.",
    matchScore:"79%", deadline:"2025-05-31", prize:"₹48,000/year", teamSize:null, mode:null,
    tags:["SC/ST","OBC","Engineering","Need-based"],
    applyUrl:"https://ongcscholar.org"
  },
  {
    id:"s13", type:"Scholarship", status:"Upcoming",
    title:"DAAD Scholarship — Germany",
    company:"DAAD",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"German Academic Exchange Service scholarship for Indian students to pursue Master's or PhD in Germany.",
    whyApply:"Germany offers tuition-free education at world-class universities. DAAD covers living expenses and travel costs.",
    matchScore:"81%", deadline:"2025-10-31", prize:"€934/month + Travel", teamSize:null, mode:null,
    tags:["Germany","Masters","PhD","Research"],
    applyUrl:"https://www.daad.in/en/scholarships"
  },
  {
    id:"s14", type:"Scholarship", status:"Ongoing",
    title:"Sitaram Jindal Foundation Scholarship",
    company:"Sitaram Jindal Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for meritorious students from economically weaker sections pursuing professional courses across India.",
    whyApply:"Up to ₹2,000/month with no bond. Available for engineering, medical, and management students.",
    matchScore:"80%", deadline:"2025-08-31", prize:"Up to ₹2,000/month", teamSize:null, mode:null,
    tags:["Need-based","Engineering","Medical","India"],
    applyUrl:"https://sitaramjindalfoundation.org/scholarship"
  },
  {
    id:"s15", type:"Scholarship", status:"Upcoming",
    title:"Rhodes Scholarship",
    company:"Rhodes Trust",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"The world's oldest and most prestigious international scholarship. Study at Oxford University, fully funded.",
    whyApply:"Rhodes Scholars include US Presidents, Nobel laureates, and global leaders. The most transformative scholarship in the world.",
    matchScore:"85%", deadline:"2025-09-30", prize:"Full Oxford Funding", teamSize:null, mode:null,
    tags:["Oxford","Leadership","International","Postgraduate"],
    applyUrl:"https://www.rhodeshouse.ox.ac.uk/scholarships"
  },
  {
    id:"s16", type:"Scholarship", status:"Closed",
    title:"Wipro Cares Scholarship",
    company:"Wipro",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Wipro's CSR scholarship for meritorious students from economically disadvantaged backgrounds pursuing engineering.",
    whyApply:"₹30,000 per year with mentorship from Wipro employees and priority consideration for Wipro internships.",
    matchScore:"78%", deadline:"2025-06-30", prize:"₹30,000/year + Mentorship", teamSize:null, mode:null,
    tags:["Engineering","Need-based","CSR","India"],
    applyUrl:"https://www.wipro.com/sustainability/wipro-cares"
  },
  {
    id:"s17", type:"Scholarship", status:"Upcoming",
    title:"Commonwealth Scholarship",
    company:"Commonwealth Scholarship Commission",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Fully funded scholarship for students from Commonwealth countries to pursue Master's or PhD in the UK.",
    whyApply:"Covers tuition, living allowance, and airfare. Join a network of 25,000+ Commonwealth Scholars worldwide.",
    matchScore:"82%", deadline:"2025-12-15", prize:"Full UK Funding", teamSize:null, mode:null,
    tags:["UK","Masters","PhD","Commonwealth"],
    applyUrl:"https://cscuk.fcdo.gov.uk/scholarships"
  },
  {
    id:"s18", type:"Scholarship", status:"Ongoing",
    title:"Inspire Scholarship — DST",
    company:"Dept. of Science & Technology",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for students pursuing natural and basic sciences at undergraduate and postgraduate levels.",
    whyApply:"₹80,000 per year for 5 years. One of India's most generous science scholarships with summer research attachments.",
    matchScore:"81%", deadline:"2025-09-30", prize:"₹80,000/year for 5 years", teamSize:null, mode:null,
    tags:["Science","Research","Undergraduate","Postgraduate"],
    applyUrl:"https://online-inspire.gov.in"
  },
  {
    id:"s19", type:"Scholarship", status:"Upcoming",
    title:"Erasmus Mundus Scholarship",
    company:"European Commission",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Study at multiple European universities with full funding. One of the most prestigious EU scholarships.",
    whyApply:"Study in 2-3 European countries, receive €1,400/month, and join a global network of Erasmus alumni.",
    matchScore:"83%", deadline:"2026-01-15", prize:"€1,400/month + Tuition", teamSize:null, mode:null,
    tags:["Europe","Masters","International","Research"],
    applyUrl:"https://erasmus-plus.ec.europa.eu/opportunities/individuals/students/erasmus-mundus-joint-masters"
  },
  {
    id:"s20", type:"Scholarship", status:"Closed",
    title:"Infosys Foundation Scholarship",
    company:"Infosys Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for meritorious students from rural and semi-urban areas pursuing engineering and technology courses.",
    whyApply:"₹1.5 lakh per year with mentorship from Infosys employees and priority consideration for Infosys campus hiring.",
    matchScore:"80%", deadline:"2025-05-15", prize:"₹1,50,000/year", teamSize:null, mode:null,
    tags:["Engineering","Rural","Merit-based","India"],
    applyUrl:"https://www.infosys.com/infosys-foundation"
  },
  {
    id:"s21", type:"Scholarship", status:"Upcoming",
    title:"Gates Cambridge Scholarship",
    company:"Gates Cambridge Trust",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Full-cost scholarship to pursue any subject at Cambridge University. One of the most competitive scholarships globally.",
    whyApply:"Gates Cambridge Scholars are among the world's brightest minds. Join a community of leaders changing the world.",
    matchScore:"86%", deadline:"2025-10-12", prize:"Full Cambridge Funding", teamSize:null, mode:null,
    tags:["Cambridge","PhD","Masters","Leadership"],
    applyUrl:"https://www.gatescambridge.org/apply"
  },
  {
    id:"s22", type:"Scholarship", status:"Ongoing",
    title:"Swami Vivekananda Merit-cum-Means Scholarship",
    company:"Govt. of West Bengal",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for meritorious students from West Bengal pursuing higher education in recognized institutions.",
    whyApply:"Up to ₹60,000 per year for students from West Bengal. One of the most accessible state government scholarships.",
    matchScore:"77%", deadline:"2025-08-15", prize:"Up to ₹60,000/year", teamSize:null, mode:null,
    tags:["West Bengal","Merit-based","Need-based","State Scholarship"],
    applyUrl:"https://svmcm.wbhed.gov.in"
  },
  {
    id:"s23", type:"Scholarship", status:"Upcoming",
    title:"Narotam Sekhsaria Scholarship",
    company:"Narotam Sekhsaria Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for Indian students pursuing postgraduate studies at top global universities in any discipline.",
    whyApply:"Up to ₹20 lakh as an interest-free loan-scholarship. One of the most generous scholarships for Indian students going abroad.",
    matchScore:"83%", deadline:"2025-05-31", prize:"Up to ₹20,00,000", teamSize:null, mode:null,
    tags:["International","Postgraduate","Any Discipline","India"],
    applyUrl:"https://www.nsf.org.in/scholarships"
  },
  {
    id:"s24", type:"Scholarship", status:"Closed",
    title:"TCS iON National Qualifier Test Scholarship",
    company:"TCS",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for students who qualify TCS iON NQT. Top scorers receive scholarships and fast-track to TCS hiring.",
    whyApply:"Direct pathway to TCS employment, ₹50,000 scholarship, and recognition from India's largest IT company.",
    matchScore:"82%", deadline:"2025-04-30", prize:"₹50,000 + TCS Fast-track", teamSize:null, mode:null,
    tags:["TCS","IT","Engineering","Merit-based"],
    applyUrl:"https://www.tcs.com/careers/tcs-ion"
  },
  {
    id:"s25", type:"Scholarship", status:"Upcoming",
    title:"Maulana Azad National Fellowship",
    company:"Ministry of Minority Affairs",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"Fellowship for minority community students pursuing M.Phil and PhD in Indian universities.",
    whyApply:"₹25,000–28,000 per month for PhD students. One of India's most generous research fellowships for minority students.",
    matchScore:"79%", deadline:"2025-09-15", prize:"₹25,000–28,000/month", teamSize:null, mode:null,
    tags:["Minority","PhD","Research","Fellowship"],
    applyUrl:"https://www.minorityaffairs.gov.in/fellowships"
  },
  {
    id:"s26", type:"Scholarship", status:"Ongoing",
    title:"Pratibha Scholarship — Govt. of India",
    company:"Ministry of Education",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Central government scholarship for meritorious students from economically weaker sections pursuing higher education.",
    whyApply:"₹10,000–20,000 per year. Available for students at central universities and institutions of national importance.",
    matchScore:"78%", deadline:"2025-10-31", prize:"₹10,000–20,000/year", teamSize:null, mode:null,
    tags:["Central Government","Merit-based","Need-based","Higher Education"],
    applyUrl:"https://scholarships.gov.in"
  },
  {
    id:"s27", type:"Scholarship", status:"Upcoming",
    title:"Japan MEXT Scholarship",
    company:"Japanese Government",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Japanese government scholarship for international students to study at Japanese universities at undergraduate or postgraduate level.",
    whyApply:"Full funding including tuition, living allowance, and airfare. Japan is a global leader in technology and research.",
    matchScore:"80%", deadline:"2025-06-30", prize:"Full Funding + ¥117,000/month", teamSize:null, mode:null,
    tags:["Japan","Undergraduate","Masters","PhD"],
    applyUrl:"https://www.studyinjapan.go.jp/en/smap_stopj-applications_mext.html"
  },
  {
    id:"s28", type:"Scholarship", status:"Closed",
    title:"Cognizant Foundation Scholarship",
    company:"Cognizant",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for meritorious students from economically disadvantaged backgrounds pursuing engineering and technology.",
    whyApply:"₹1 lakh per year with mentorship and priority consideration for Cognizant campus hiring.",
    matchScore:"79%", deadline:"2025-07-31", prize:"₹1,00,000/year", teamSize:null, mode:null,
    tags:["Engineering","Need-based","IT","India"],
    applyUrl:"https://www.cognizant.com/us/en/about-cognizant/corporate-responsibility"
  },
  {
    id:"s29", type:"Scholarship", status:"Upcoming",
    title:"Australia Awards Scholarship",
    company:"Australian Government",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    description:"Australian government scholarship for students from developing countries to pursue undergraduate or postgraduate studies in Australia.",
    whyApply:"Full funding including tuition, living allowance, and airfare. Australia has world-class universities and research facilities.",
    matchScore:"81%", deadline:"2025-04-30", prize:"Full Australia Funding", teamSize:null, mode:null,
    tags:["Australia","Masters","PhD","International"],
    applyUrl:"https://www.australiaawards.gov.au"
  },
  {
    id:"s30", type:"Scholarship", status:"Ongoing",
    title:"PM Scholarship Scheme for Central Armed Police Forces",
    company:"Ministry of Home Affairs",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800",
    description:"Scholarship for wards and widows of Central Armed Police Forces personnel pursuing professional courses.",
    whyApply:"₹2,500–3,000 per month. One of India's most accessible scholarships for children of armed forces personnel.",
    matchScore:"76%", deadline:"2025-10-15", prize:"₹2,500–3,000/month", teamSize:null, mode:null,
    tags:["Armed Forces","Professional Courses","Need-based","India"],
    applyUrl:"https://ksb.gov.in/pm-scholarship.htm"
  },

  // ══════════════════════════════════════════
  //  COMPETITIONS  (30)
  // ══════════════════════════════════════════
  {
    id:"c1", type:"Competitions", status:"Ongoing",
    title:"Unstop Igniters — Case Study Challenge",
    company:"Unstop",
    logo:"https://d8it4huxumps7.cloudfront.net/uploads/images/unstop/svg/unstop-logo.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Solve real-world business problems presented by Fortune 500 companies. Compete in rounds of case analysis and strategy.",
    whyApply:"Often leads directly to PPIs at Fortune 500 companies. Past winners hired by McKinsey, BCG, and Goldman Sachs.",
    matchScore:"95%", deadline:"2025-11-05", prize:"PPI + ₹1,00,000", teamSize:"1-3", mode:"Online",
    tags:["Business","Strategy","Case Study","Consulting"],
    applyUrl:"https://unstop.com/competitions"
  },
  {
    id:"c2", type:"Competitions", status:"Upcoming",
    title:"ICPC Asia Regional Contest 2025",
    company:"ICPC Foundation",
    logo:"https://upload.wikimedia.org/wikipedia/commons/b/b1/Codeforces_logo.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"The International Collegiate Programming Contest — the world's most prestigious competitive programming competition.",
    whyApply:"ICPC is the Olympics of competitive programming. Advancing to World Finals is recognized by every top tech company.",
    matchScore:"90%", deadline:"2025-10-20", prize:"World Finals Qualification + Medals", teamSize:"3", mode:"Offline",
    tags:["Competitive Programming","Algorithms","DSA","Team"],
    applyUrl:"https://icpc.global"
  },
  {
    id:"c3", type:"Competitions", status:"Ongoing",
    title:"HackerEarth University Challenge",
    company:"HackerEarth",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    description:"Monthly coding challenges targeting university students. Problems span DSA, ML, and system design.",
    whyApply:"HackerEarth challenges are monitored by recruiters from Amazon, Walmart, and other top firms.",
    matchScore:"88%", deadline:"2025-12-31", prize:"Cash Prizes + Interview Calls", teamSize:"1", mode:"Online",
    tags:["Coding","DSA","ML","System Design"],
    applyUrl:"https://www.hackerearth.com/challenges"
  },
  {
    id:"c4", type:"Competitions", status:"Closed",
    title:"Tata Imagination Challenge 2024",
    company:"Tata Group",
    logo:"https://upload.wikimedia.org/wikipedia/commons/8/8e/Tata_logo.svg",
    banner:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800",
    description:"Tata's national-level innovation challenge. Propose bold solutions to real business and social challenges.",
    whyApply:"Winners present to Tata Group's top leadership, receive cash prizes, and are fast-tracked for Tata internships.",
    matchScore:"87%", deadline:"2025-04-01", prize:"₹3,00,000 + Tata Internship", teamSize:"1-4", mode:"Online",
    tags:["Innovation","Business","Social Impact","Strategy"],
    applyUrl:"https://www.tata.com/careers/tata-imagination-challenge"
  },
  {
    id:"c5", type:"Competitions", status:"Upcoming",
    title:"Google Code Jam 2025",
    company:"Google",
    logo:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    banner:"https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
    description:"Google's global algorithmic programming competition. Multiple rounds leading to an onsite final at Google HQ.",
    whyApply:"Top performers get fast-tracked to Google interviews. The competition is recognized by every top tech company globally.",
    matchScore:"92%", deadline:"2025-08-01", prize:"$15,000 + Google Interview Fast-track", teamSize:"1", mode:"Online",
    tags:["Algorithms","Competitive Programming","DSA","Google"],
    applyUrl:"https://codingcompetitions.withgoogle.com/codejam"
  },
  {
    id:"c6", type:"Competitions", status:"Ongoing",
    title:"Facebook Hacker Cup 2025",
    company:"Meta",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Meta's annual algorithmic programming competition. Open to all programmers worldwide.",
    whyApply:"Top performers get fast-tracked to Meta interviews. Great for building competitive programming credentials.",
    matchScore:"89%", deadline:"2025-09-30", prize:"$20,000 + Meta Interview Fast-track", teamSize:"1", mode:"Online",
    tags:["Algorithms","Competitive Programming","Meta","DSA"],
    applyUrl:"https://www.facebook.com/hackercup"
  },
  {
    id:"c7", type:"Competitions", status:"Upcoming",
    title:"Amazon ML Challenge 2025",
    company:"Amazon",
    logo:"https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    banner:"https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&q=80&w=800",
    description:"Amazon's machine learning competition for students. Build ML models to solve real Amazon business problems.",
    whyApply:"Winners receive PPO at Amazon, ₹5 lakh prize, and direct mentorship from Amazon scientists.",
    matchScore:"91%", deadline:"2025-09-15", prize:"PPO + ₹5,00,000", teamSize:"1-3", mode:"Online",
    tags:["ML","Data Science","Python","Amazon"],
    applyUrl:"https://unstop.com/competitions/amazon-ml-challenge"
  },
  {
    id:"c8", type:"Competitions", status:"Closed",
    title:"Deloitte Consulting Case Competition 2024",
    company:"Deloitte",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"National case competition where students solve real consulting challenges for Deloitte's clients.",
    whyApply:"Winners receive PPO at Deloitte, ₹2 lakh prize, and direct entry into Deloitte's graduate program.",
    matchScore:"86%", deadline:"2025-03-15", prize:"PPO + ₹2,00,000", teamSize:"2-4", mode:"Hybrid",
    tags:["Consulting","Strategy","Business","Case Study"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"c9", type:"Competitions", status:"Upcoming",
    title:"Kaggle Competition — Tabular Playground",
    company:"Kaggle / Google",
    logo:"https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg",
    banner:"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    description:"Monthly Kaggle competitions focused on tabular data. Great for building ML skills and Kaggle ranking.",
    whyApply:"Kaggle rankings are recognized by top data science teams. Top performers get direct interview calls from Google and Meta.",
    matchScore:"90%", deadline:"2025-08-31", prize:"$10,000 + Kaggle Ranking", teamSize:"1-5", mode:"Online",
    tags:["ML","Data Science","Python","Kaggle"],
    applyUrl:"https://www.kaggle.com/competitions"
  },
  {
    id:"c10", type:"Competitions", status:"Ongoing",
    title:"Cisco ThingQbator Innovation Challenge",
    company:"Cisco",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Cisco's IoT and networking innovation challenge for students. Build connected solutions using Cisco technologies.",
    whyApply:"Winners receive ₹3 lakh prize, Cisco certification vouchers, and fast-track to Cisco internships.",
    matchScore:"85%", deadline:"2025-07-31", prize:"₹3,00,000 + Cisco Certs", teamSize:"2-4", mode:"Online",
    tags:["IoT","Networking","Innovation","Cisco"],
    applyUrl:"https://thingqbator.nasscom.in"
  },
  {
    id:"c11", type:"Competitions", status:"Upcoming",
    title:"IIM Ahmedabad L'Attitude Business Quiz",
    company:"IIM Ahmedabad",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"India's most prestigious business quiz organized by IIM Ahmedabad. Tests knowledge of business, economics, and current affairs.",
    whyApply:"Winning IIM A's quiz is a massive credential. ₹1 lakh prize and recognition from India's top business school.",
    matchScore:"83%", deadline:"2025-10-10", prize:"₹1,00,000 + IIM A Recognition", teamSize:"2", mode:"Offline",
    tags:["Business Quiz","Economics","Current Affairs","Strategy"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"c12", type:"Competitions", status:"Closed",
    title:"Wipro Earthian Sustainability Challenge",
    company:"Wipro",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"Wipro's sustainability competition for students. Propose innovative solutions for environmental and social challenges.",
    whyApply:"Winners receive ₹1.5 lakh prize, Wipro mentorship, and their solution potentially implemented by Wipro.",
    matchScore:"82%", deadline:"2025-05-31", prize:"₹1,50,000 + Mentorship", teamSize:"2-5", mode:"Online",
    tags:["Sustainability","Environment","Social Impact","Innovation"],
    applyUrl:"https://www.wipro.com/sustainability/earthian"
  },
  {
    id:"c13", type:"Competitions", status:"Upcoming",
    title:"Leetcode Weekly Contest",
    company:"LeetCode",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"Weekly competitive programming contests on LeetCode. 4 problems, 90 minutes, global leaderboard.",
    whyApply:"LeetCode ranking is checked by FAANG recruiters. Consistent top performance leads to direct interview invitations.",
    matchScore:"91%", deadline:"2025-12-31", prize:"LeetCode Coins + Global Ranking", teamSize:"1", mode:"Online",
    tags:["DSA","Competitive Programming","Algorithms","FAANG"],
    applyUrl:"https://leetcode.com/contest"
  },
  {
    id:"c14", type:"Competitions", status:"Ongoing",
    title:"HCL TechBee Innovation Challenge",
    company:"HCL Technologies",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"HCL's national innovation challenge for students. Build tech solutions for enterprise, healthcare, and smart cities.",
    whyApply:"Winners receive PPO at HCL, ₹2 lakh prize, and direct mentorship from HCL's CTO office.",
    matchScore:"84%", deadline:"2025-08-15", prize:"PPO + ₹2,00,000", teamSize:"2-4", mode:"Online",
    tags:["Enterprise Tech","Healthcare","Smart Cities","Innovation"],
    applyUrl:"https://www.hcltech.com/careers"
  },
  {
    id:"c15", type:"Competitions", status:"Upcoming",
    title:"Morgan Stanley Code to Give 2025",
    company:"Morgan Stanley",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Morgan Stanley's hackathon for social good. Build tech solutions for NGOs and non-profit organizations.",
    whyApply:"Winners receive ₹1 lakh prize, Morgan Stanley internship fast-track, and their solution deployed for real NGOs.",
    matchScore:"86%", deadline:"2025-09-20", prize:"₹1,00,000 + Internship Fast-track", teamSize:"3-5", mode:"Hybrid",
    tags:["Social Good","NGO","Full Stack","Finance Tech"],
    applyUrl:"https://www.morganstanley.com/people-opportunities/students-graduates/programs/technology/code-to-give"
  },
  {
    id:"c16", type:"Competitions", status:"Closed",
    title:"Mahindra War Room 2024",
    company:"Mahindra Group",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Mahindra's flagship business strategy competition. Solve real strategic challenges faced by Mahindra Group companies.",
    whyApply:"Winners present to Mahindra's board, receive ₹5 lakh prize, and are fast-tracked for Mahindra's management program.",
    matchScore:"85%", deadline:"2025-02-28", prize:"₹5,00,000 + Management Fast-track", teamSize:"2-4", mode:"Hybrid",
    tags:["Business Strategy","Automotive","Consulting","Leadership"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"c17", type:"Competitions", status:"Upcoming",
    title:"Atmos — BITS Pilani Tech Fest",
    company:"BITS Pilani",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"BITS Pilani's annual technical festival with competitions in coding, robotics, design, and innovation.",
    whyApply:"₹10 lakh total prize pool, networking with BITS students, and direct recruiter access from top companies.",
    matchScore:"87%", deadline:"2025-10-25", prize:"₹10,00,000 total prize pool", teamSize:"1-5", mode:"Offline",
    tags:["Tech Fest","Robotics","Coding","Innovation"],
    applyUrl:"https://www.bits-atmos.org"
  },
  {
    id:"c18", type:"Competitions", status:"Ongoing",
    title:"Techfest — IIT Bombay",
    company:"IIT Bombay",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"Asia's largest science and technology festival. Competitions in robotics, coding, design, and innovation.",
    whyApply:"₹1 crore+ total prize pool, global participation, and direct exposure to IIT Bombay's world-class faculty.",
    matchScore:"89%", deadline:"2025-12-20", prize:"₹1,00,00,000+ total", teamSize:"1-5", mode:"Offline",
    tags:["Tech Fest","Robotics","AI","Innovation"],
    applyUrl:"https://techfest.org"
  },
  {
    id:"c19", type:"Competitions", status:"Upcoming",
    title:"Shaastra — IIT Madras",
    company:"IIT Madras",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"IIT Madras's annual technical festival. Competitions in coding, robotics, design, and entrepreneurship.",
    whyApply:"₹50 lakh total prize pool, networking with IIT Madras students, and direct recruiter access.",
    matchScore:"86%", deadline:"2026-01-10", prize:"₹50,00,000 total", teamSize:"1-5", mode:"Offline",
    tags:["Tech Fest","Coding","Robotics","Entrepreneurship"],
    applyUrl:"https://shaastra.org"
  },
  {
    id:"c20", type:"Competitions", status:"Closed",
    title:"Accenture Ingenious 2024",
    company:"Accenture",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"Accenture's national innovation competition. Solve real business challenges using emerging technologies.",
    whyApply:"Winners receive PPO at Accenture, ₹3 lakh prize, and global project exposure.",
    matchScore:"85%", deadline:"2025-03-31", prize:"PPO + ₹3,00,000", teamSize:"2-4", mode:"Online",
    tags:["Innovation","Digital Transformation","AI","Consulting"],
    applyUrl:"https://unstop.com"
  },
  {
    id:"c21", type:"Competitions", status:"Upcoming",
    title:"Codechef Long Challenge",
    company:"CodeChef",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    description:"CodeChef's monthly 10-day long challenge. Solve algorithmic problems at your own pace. Rated contest.",
    whyApply:"CodeChef rating is recognized by Indian tech companies. Top performers get direct interview calls from TCS, Infosys, and startups.",
    matchScore:"87%", deadline:"2025-08-31", prize:"CodeChef Rating + Cash Prizes", teamSize:"1", mode:"Online",
    tags:["Competitive Programming","DSA","Algorithms","Rated"],
    applyUrl:"https://www.codechef.com/contests"
  },
  {
    id:"c22", type:"Competitions", status:"Ongoing",
    title:"Niti Aayog AIM Innovation Challenge",
    company:"Niti Aayog",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"Niti Aayog's Atal Innovation Mission challenge for students. Build innovative solutions for India's development goals.",
    whyApply:"Winners receive ₹10 lakh grant, incubation support from AIM, and direct mentorship from government officials.",
    matchScore:"83%", deadline:"2025-07-15", prize:"₹10,00,000 Grant + Incubation", teamSize:"2-5", mode:"Online",
    tags:["Innovation","Social Impact","GovTech","Startup"],
    applyUrl:"https://aim.gov.in"
  },
  {
    id:"c23", type:"Competitions", status:"Upcoming",
    title:"E-Cell IIT Bombay Business Plan Competition",
    company:"IIT Bombay E-Cell",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"India's most prestigious business plan competition organized by IIT Bombay's Entrepreneurship Cell.",
    whyApply:"Winners receive ₹5 lakh prize, VC introductions, and incubation support from IIT Bombay's SINE incubator.",
    matchScore:"88%", deadline:"2025-11-30", prize:"₹5,00,000 + VC Introductions", teamSize:"2-5", mode:"Hybrid",
    tags:["Entrepreneurship","Business Plan","Startup","Innovation"],
    applyUrl:"https://ecell.in"
  },
  {
    id:"c24", type:"Competitions", status:"Closed",
    title:"Schneider Electric Go Green 2024",
    company:"Schneider Electric",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"Global sustainability competition. Propose innovative solutions for energy efficiency and sustainable development.",
    whyApply:"Winners get flown to Paris for the global finale, receive €10,000 prize, and internship opportunities at Schneider Electric.",
    matchScore:"84%", deadline:"2025-02-15", prize:"€10,000 + Paris Trip", teamSize:"2-3", mode:"Online",
    tags:["Sustainability","Energy","Innovation","Global"],
    applyUrl:"https://www.se.com/ww/en/work/campaign/go-green-in-the-city"
  },
  {
    id:"c25", type:"Competitions", status:"Upcoming",
    title:"Toycathon — Ministry of Education",
    company:"Ministry of Education",
    logo:"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg",
    banner:"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800",
    description:"India's national toy design competition. Design innovative, educational, and culturally rooted toys for Indian children.",
    whyApply:"Winners receive ₹50 lakh grant, manufacturing support, and direct partnership with Indian toy manufacturers.",
    matchScore:"79%", deadline:"2025-09-30", prize:"₹50,00,000 Grant + Manufacturing Support", teamSize:"1-5", mode:"Online",
    tags:["Design","Innovation","Education","Manufacturing"],
    applyUrl:"https://toycathon.mic.gov.in"
  },
  {
    id:"c26", type:"Competitions", status:"Ongoing",
    title:"Byju's National Olympiad",
    company:"BYJU'S",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1532094349884-543559c5f185?auto=format&fit=crop&q=80&w=800",
    description:"National-level olympiad for students in Math, Science, and English. Multiple rounds with national finals.",
    whyApply:"₹1 crore+ in scholarships, national recognition, and BYJU'S premium subscription for all participants.",
    matchScore:"80%", deadline:"2025-08-31", prize:"₹1,00,00,000+ in Scholarships", teamSize:"1", mode:"Online",
    tags:["Olympiad","Mathematics","Science","National"],
    applyUrl:"https://byjus.com/olympiad"
  },
  {
    id:"c27", type:"Competitions", status:"Upcoming",
    title:"Siemens Ingenuity for Life Challenge",
    company:"Siemens",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800",
    description:"Siemens' global innovation challenge. Build solutions for smart infrastructure, industrial automation, and digitalization.",
    whyApply:"Winners receive €15,000 prize, Siemens internship, and their solution potentially implemented in Siemens products.",
    matchScore:"85%", deadline:"2025-10-15", prize:"€15,000 + Siemens Internship", teamSize:"2-4", mode:"Online",
    tags:["Industrial Tech","Automation","Smart Infrastructure","IoT"],
    applyUrl:"https://www.siemens.com/global/en/company/jobs/students-graduates.html"
  },
  {
    id:"c28", type:"Competitions", status:"Closed",
    title:"L'Oreal Brandstorm 2024",
    company:"L'Oreal",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"L'Oreal's global marketing and innovation competition. Create the next big beauty innovation for L'Oreal's brands.",
    whyApply:"Winners get flown to Paris for the global finale, receive €10,000 prize, and internship offers at L'Oreal.",
    matchScore:"81%", deadline:"2025-03-01", prize:"€10,000 + Paris Trip + Internship", teamSize:"3", mode:"Online",
    tags:["Marketing","Innovation","Beauty","Brand Strategy"],
    applyUrl:"https://brandstorm.loreal.com"
  },
  {
    id:"c29", type:"Competitions", status:"Upcoming",
    title:"Procter & Gamble CEO Challenge",
    company:"P&G",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800",
    description:"P&G's global business challenge. Solve real business problems faced by P&G's brands across marketing, supply chain, and innovation.",
    whyApply:"Winners receive ₹2 lakh prize, P&G internship offer, and direct mentorship from P&G's global leadership team.",
    matchScore:"84%", deadline:"2025-11-15", prize:"₹2,00,000 + P&G Internship", teamSize:"2-4", mode:"Online",
    tags:["FMCG","Marketing","Supply Chain","Business Strategy"],
    applyUrl:"https://www.pgcareers.com/global/en/students"
  },
  {
    id:"c30", type:"Competitions", status:"Ongoing",
    title:"Cognizant Hackathon — GenC Next",
    company:"Cognizant",
    logo:"https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
    banner:"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800",
    description:"Cognizant's national coding and innovation competition for final year students. Build solutions using AI, cloud, and digital technologies.",
    whyApply:"Winners receive PPO at Cognizant, ₹1.5 lakh prize, and direct entry into Cognizant's elite GenC Next program.",
    matchScore:"86%", deadline:"2025-07-31", prize:"PPO + ₹1,50,000", teamSize:"2-4", mode:"Online",
    tags:["AI","Cloud","Digital","Innovation"],
    applyUrl:"https://www.cognizant.com/us/en/careers/students"
  },

];

router.get("/", (req, res) => {
  const typeQuery   = req.query.type;
  const searchQuery = req.query.search?.toLowerCase() || "";
  const skills      = req.query.skills    ? req.query.skills.split(",").map(s => s.toLowerCase().trim())    : [];
  const interests   = req.query.interests ? req.query.interests.split(",").map(s => s.toLowerCase().trim()) : [];

  let results = [...MOCK_OPPORTUNITIES].map(item => ({ ...item, banner: null })); // strip banners — use gradients

  if (typeQuery && typeQuery !== "All") {
    results = results.filter(item => item.type.toLowerCase() === typeQuery.toLowerCase());
  }

  const statusQuery = req.query.status;
  if (statusQuery && statusQuery !== "all") {
    results = results.filter(item => item.status === statusQuery);
  }

  if (searchQuery) {
    results = results.filter(item =>
      item.title.toLowerCase().includes(searchQuery) ||
      item.company.toLowerCase().includes(searchQuery) ||
      (item.tags || []).some(t => t.toLowerCase().includes(searchQuery))
    );
  }

  if (skills.length > 0 || interests.length > 0) {
    const userKeywords = [...skills, ...interests];
    results = results.map(item => {
      const itemKeywords = [
        ...(item.tags || []).map(t => t.toLowerCase()),
        item.type.toLowerCase(),
        item.title.toLowerCase(),
        item.company.toLowerCase(),
      ];
      // Count how many user keywords match item keywords
      const matchCount = userKeywords.filter(k =>
        itemKeywords.some(ik => ik.includes(k) || k.includes(ik))
      ).length;
      const matchRatio = matchCount / Math.max(userKeywords.length, 1);
      // Score: 70 base + up to 29 bonus = max 99%
      const score = Math.min(99, Math.round(70 + matchRatio * 29));
      return { ...item, matchScore: score + "%" };
    });
    // Sort by score descending — highest match first
    results.sort((a, b) => parseInt(b.matchScore) - parseInt(a.matchScore));
  }

  res.json(results);
});

export default router;
