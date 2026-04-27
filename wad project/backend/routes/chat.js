// ── OpportunityOS AI Chat Training Data ───────────────────────
export const trainingData = [
  // Greetings
  { patterns: ["hi","hello","hey","hii","helo","namaste","sup","yo","good morning","good evening","good afternoon","howdy","greetings","what's up","whats up","wassup","hiya","heya"], type: "greeting" },
  // Acknowledgements
  { patterns: ["ok","okay","sure","cool","got it","nice","great","good","alright","fine","noted","understood","wow","amazing","awesome","perfect","sounds good","yep","yup","yes","nope","nah","lol","haha","hmm","done","finished","clear","makes sense","i see","that helps","helpful","interesting","wonderful","fantastic","excellent","brilliant","all good","all set","sounds great","no problem","np","k","kk","right","correct","exactly","indeed","absolutely","definitely","of course","sure thing","that's great","thats great","that's good","thats good","that's cool","thats cool","that's awesome","thats awesome","that's perfect","thats perfect","superb","splendid","noted thanks","ok noted","done thanks","ok thanks","okay thanks","got it thanks","perfect thanks","great thanks","awesome thanks","cool thanks","nice one","good one","very helpful","very useful","very good","very nice","very cool","very interesting","very informative","very clear","so helpful","so useful","so good","so nice","so cool","so interesting","so informative","so clear","i understand","i got it","makes sense","that makes sense","i see now","now i understand","now i get it","i get it","got it now","understood now","clear now","all clear","crystal clear","loud and clear","roger that","copy that","10-4","affirmative","negative","no worries","no problem","not a problem","don't worry","its fine","it's fine","that's fine","thats fine","that's okay","thats okay","that's alright","thats alright","fair enough","fair point","good point","valid point","true","true that","that's true","thats true","exactly right","spot on","bang on","you're right","youre right","you are right","absolutely right","totally right","completely right","100%","100 percent","totally","completely","definitely","certainly","of course","naturally","obviously","clearly","evidently","apparently","seemingly","supposedly","presumably","allegedly","reportedly","supposedly","apparently","seemingly","presumably","allegedly","reportedly"], type: "ack" },
  // Thanks
  { patterns: ["thank you","thanks","thank u","thx","ty","thank","many thanks","thanks a lot","thanks a ton","thanks so much","thank you so much","thank you very much","thanks very much","much appreciated","greatly appreciated","really appreciate it","appreciate it","appreciate that","appreciate your help","appreciate the help","appreciate the info","appreciate the information","appreciate the advice","appreciate the guidance","appreciate the support","appreciate the assistance","appreciate the response","appreciate the reply","appreciate the answer","appreciate the explanation","appreciate the clarification","appreciate the details","appreciate the update","appreciate the feedback","appreciate the suggestion","appreciate the recommendation","appreciate the tip","appreciate the tips","appreciate the advice","appreciate the guidance","appreciate the support","appreciate the assistance"], type: "thanks" },
  // Bye
  { patterns: ["bye","goodbye","see you","cya","later","exit","close","quit","bb","ttyl","see ya","good night","goodnight","farewell","take care","catch you later","catch ya later","peace","peace out","signing off","logging off","gotta go","got to go","have to go","need to go","i'm leaving","im leaving","i am leaving","i'll be back","ill be back","i will be back","see you soon","see you later","see you around","see you next time","see you tomorrow","see you next week","see you next month","see you next year","see you soon","see you later","see you around","see you next time","see you tomorrow","see you next week","see you next month","see you next year"], type: "bye" },
];

export const responses = {
  greeting: [
    (g) => `Hey ${g}welcome to OpportunityOS! 🚀 I'm your AI career guide. Looking for internships, hackathons, or scholarships today?`,
    (g) => `Hi ${g}great to see you! 👋 I can help you discover opportunities matched to your skills. What are you looking for?`,
    (g) => `Hello ${g}! 😊 Ready to find your next big opportunity? Tell me — internships, hackathons, scholarships, or competitions?`,
    (g) => `Hey there ${g}! 🌟 I'm here to help you land amazing opportunities. What's on your mind today?`,
    (g) => `Welcome ${g}! 🎯 OpportunityOS has 120+ opportunities waiting for you. What would you like to explore?`,
  ],
  ack: [
    () => `Got it! 😊 What would you like to explore? Internships, hackathons, scholarships, or competitions?`,
    () => `Sure thing! 🚀 What can I help you with? Ask me about any opportunity or company!`,
    () => `Awesome! 🌟 Tell me what you're looking for and I'll find the best matches for you!`,
    () => `Great! 💪 Want personalized recommendations? Say "show internships" or "show hackathons"!`,
    () => `Cool! 😄 I can help you find opportunities based on your skills. What are you interested in?`,
    () => `Perfect! 🎯 Is there a specific company or type of opportunity you're looking for?`,
    () => `Noted! 📝 What else can I help you with? Internships, hackathons, scholarships, or competitions?`,
    () => `Understood! 🤝 Ready to help. What are you looking for today?`,
    () => `Sounds good! 🎉 What would you like to explore on OpportunityOS?`,
    () => `Excellent! 🌟 What's next? I can help you find internships, hackathons, scholarships, or competitions!`,
  ],
  thanks: [
    (g) => `You're welcome ${g}! 😊 Best of luck with your applications! Feel free to ask anytime.`,
    (g) => `Happy to help! 🌟 Go get that opportunity — you've got this! 💪`,
    (g) => `Anytime ${g}! That's what I'm here for. 🚀`,
    (g) => `My pleasure ${g}! 😄 Don't forget to fill your profile for better recommendations!`,
    (g) => `Glad I could help! 🎯 Best of luck with your applications. You've got this! 💪`,
    (g) => `No problem at all ${g}! 🌟 Come back anytime you need help finding opportunities!`,
  ],
  bye: [
    (g) => `Goodbye ${g}! 👋 Best of luck with your applications. Come back anytime!`,
    (g) => `See you later! 🌟 Keep applying — your dream opportunity is out there! 💪`,
    (g) => `Bye ${g}! 😊 Don't forget to check the Live Now opportunities before you go!`,
    (g) => `Take care ${g}! 🎯 Remember to fill your profile for personalized recommendations!`,
    (g) => `Farewell ${g}! 🚀 Keep hustling — your dream opportunity is just around the corner!`,
  ],
};
