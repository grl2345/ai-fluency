// AI Fluency Test - Six Dimension Competency Model
export const dimensions = [
  {
    id: "tool-use",
    name: "Tool Proficiency",
    description: "Ability to navigate and leverage AI tools effectively",
    icon: "Wrench",
  },
  {
    id: "prompt-design",
    name: "Prompt Engineering",
    description: "Skill in crafting clear, effective AI instructions",
    icon: "MessageSquare",
  },
  {
    id: "output-judgment",
    name: "Critical Evaluation",
    description: "Capacity to assess AI output quality and reliability",
    icon: "CheckCircle",
  },
  {
    id: "workflow-integration",
    name: "Workflow Integration",
    description: "Ability to incorporate AI into daily processes",
    icon: "GitMerge",
  },
  {
    id: "ethics-safety",
    name: "Ethics & Safety",
    description: "Understanding of AI boundaries and risk management",
    icon: "Shield",
  },
  {
    id: "learning-adaptation",
    name: "Adaptability",
    description: "Capacity to learn and adapt to new AI technologies",
    icon: "TrendingUp",
  },
];

// Level Definitions
export const levels = [
  {
    level: 1,
    name: "Novice",
    nameEn: "AI Novice",
    description: "Beginning your AI journey with foundational awareness",
    minScore: 0,
    maxScore: 20,
    color: "bg-slate-500",
    badge: "L1",
  },
  {
    level: 2,
    name: "Explorer",
    nameEn: "AI Explorer",
    description: "Actively learning and experimenting with AI capabilities",
    minScore: 21,
    maxScore: 40,
    color: "bg-teal-500",
    badge: "L2",
  },
  {
    level: 3,
    name: "Practitioner",
    nameEn: "AI Practitioner",
    description: "Confidently applying AI tools to enhance productivity",
    minScore: 41,
    maxScore: 60,
    color: "bg-blue-500",
    badge: "L3",
  },
  {
    level: 4,
    name: "Expert",
    nameEn: "AI Expert",
    description: "Deep understanding of AI capabilities and strategic application",
    minScore: 61,
    maxScore: 80,
    color: "bg-amber-500",
    badge: "L4",
  },
  {
    level: 5,
    name: "Leader",
    nameEn: "AI Leader",
    description: "Driving AI adoption and innovation across organizations",
    minScore: 81,
    maxScore: 100,
    color: "bg-rose-500",
    badge: "L5",
  },
];

// Sample Questions
export const sampleQuestions = [
  {
    id: 1,
    dimension: "tool-use",
    type: "single",
    question: "When asking AI to write a formal business email, which approach is most effective?",
    options: [
      { id: "a", text: "Simply say \"write me an email\"", score: 1 },
      { id: "b", text: "Specify the purpose, recipient context, and key points to cover", score: 4 },
      { id: "c", text: "Copy and paste a previous email for AI to modify", score: 2 },
      { id: "d", text: "Ask AI to generate multiple versions and pick the best one", score: 3 },
    ],
    explanation: "Providing clear context (purpose, audience, key points) helps AI generate more relevant content.",
  },
  {
    id: 2,
    dimension: "prompt-design",
    type: "single",
    question: "You need AI to analyze a sales report. Which prompt design is optimal?",
    options: [
      { id: "a", text: "Analyze this data", score: 1 },
      { id: "b", text: "Please analyze this sales data and find trends", score: 2 },
      { id: "c", text: "As a data analyst, analyze this Q3 sales data focusing on: 1) Monthly growth trends 2) Product category performance 3) Anomalies, and provide actionable recommendations", score: 4 },
      { id: "d", text: "Help me see what's wrong with the data", score: 1 },
    ],
    explanation: "Structured prompts with role assignment, specific tasks, and expected outputs yield more precise results.",
  },
  {
    id: 3,
    dimension: "output-judgment",
    type: "single",
    question: "AI generated content about your company's history. How should you verify its accuracy?",
    options: [
      { id: "a", text: "AI should be accurate, use it directly", score: 0 },
      { id: "b", text: "Cross-check key facts, dates, and figures against official sources", score: 4 },
      { id: "c", text: "Regenerate and compare if both versions match", score: 2 },
      { id: "d", text: "If it reads well, it's good to use", score: 1 },
    ],
    explanation: "AI can hallucinate facts. Factual content must be verified against reliable sources.",
  },
  {
    id: 4,
    dimension: "workflow-integration",
    type: "single",
    question: "Your team generates weekly project reports. What's the most efficient AI approach?",
    options: [
      { id: "a", text: "Manually input all information each time", score: 2 },
      { id: "b", text: "Create standardized templates and prompts where team members only fill in variables", score: 4 },
      { id: "c", text: "Fully automate with no human review", score: 0 },
      { id: "d", text: "Don't use AI, maintain manual processes", score: 1 },
    ],
    explanation: "Reusable AI workflow templates improve efficiency while maintaining consistent output quality.",
  },
  {
    id: 5,
    dimension: "ethics-safety",
    type: "single",
    question: "A colleague wants to use AI to analyze customers' private messages for service improvement. Your advice?",
    options: [
      { id: "a", text: "Great idea, it will improve service quality", score: 0 },
      { id: "b", text: "Obtain explicit customer consent first and ensure data security", score: 4 },
      { id: "c", text: "It's fine as long as data isn't made public", score: 1 },
      { id: "d", text: "Using internal AI tools means no need to inform customers", score: 1 },
    ],
    explanation: "Processing personal data with AI requires privacy compliance and explicit consent.",
  },
  {
    id: 6,
    dimension: "learning-adaptation",
    type: "single",
    question: "A new AI tool claims to significantly boost your productivity. What's your approach?",
    options: [
      { id: "a", text: "Immediately adopt it fully, replacing existing tools", score: 1 },
      { id: "b", text: "Wait for others to try it first", score: 2 },
      { id: "c", text: "Test on small tasks, evaluate results, then decide on broader adoption", score: 4 },
      { id: "d", text: "Ignore it, current tools work fine", score: 1 },
    ],
    explanation: "An open but cautious approach with small-scale pilots validates value before full commitment.",
  },
  {
    id: 7,
    dimension: "tool-use",
    type: "single",
    question: "AI-generated product image doesn't meet expectations. What's your next step?",
    options: [
      { id: "a", text: "Abandon AI, use traditional design software", score: 1 },
      { id: "b", text: "Keep clicking regenerate until satisfied", score: 2 },
      { id: "c", text: "Analyze issues and refine prompt with specific style, color, and composition details", score: 4 },
      { id: "d", text: "Try a different AI tool", score: 2 },
    ],
    explanation: "Targeted prompt iteration is more efficient than random regeneration - a core AI skill.",
  },
  {
    id: 8,
    dimension: "prompt-design",
    type: "single",
    question: "You want AI to create a fitness plan. Which prompt will yield the most practical advice?",
    options: [
      { id: "a", text: "Give me a fitness plan", score: 1 },
      { id: "b", text: "I'm a 30-year-old office worker, can exercise 3x weekly for 1 hour each, goal is losing 20 lbs. Create an 8-week plan", score: 4 },
      { id: "c", text: "What's the most effective way to exercise?", score: 1 },
      { id: "d", text: "Help me get healthier", score: 0 },
    ],
    explanation: "Prompts with personal context, constraints, specific goals, and timeframes yield personalized, actionable advice.",
  },
  {
    id: 9,
    dimension: "output-judgment",
    type: "single",
    question: "AI cited a research report you've never heard of in an article. Your response?",
    options: [
      { id: "a", text: "If AI wrote it, it must exist", score: 0 },
      { id: "b", text: "Search to verify the report exists and validate the cited content", score: 4 },
      { id: "c", text: "Remove the citation and replace with known sources", score: 3 },
      { id: "d", text: "Keep it but add vague attribution like \"reportedly\"", score: 1 },
    ],
    explanation: "AI may fabricate citations. All references require independent verification.",
  },
  {
    id: 10,
    dimension: "workflow-integration",
    type: "single",
    question: "AI can automate a 2-hour repetitive task, but setup takes half a day. Your decision?",
    options: [
      { id: "a", text: "Not worth it, continue doing it manually", score: 1 },
      { id: "b", text: "Calculate long-term ROI - if it's a weekly task, the setup time investment pays off", score: 4 },
      { id: "c", text: "Maybe later when I have time", score: 1 },
      { id: "d", text: "Let colleagues try first", score: 2 },
    ],
    explanation: "Evaluating automation ROI requires considering task frequency and long-term time savings.",
  },
];

// Learning Resources
export const learningResources = [
  {
    dimension: "tool-use",
    resources: [
      { title: "Getting Started with ChatGPT", type: "article", duration: "15 min" },
      { title: "AI Image Tools Comparison", type: "video", duration: "20 min" },
      { title: "AI Tools for the Workplace", type: "course", duration: "2 hours" },
    ],
  },
  {
    dimension: "prompt-design",
    resources: [
      { title: "Prompt Engineering Fundamentals", type: "article", duration: "20 min" },
      { title: "Advanced Prompting Techniques", type: "video", duration: "30 min" },
      { title: "Prompt Template Library", type: "template", duration: "Ready to use" },
    ],
  },
  {
    dimension: "output-judgment",
    resources: [
      { title: "Identifying AI Hallucinations", type: "article", duration: "10 min" },
      { title: "Fact-Checking Methodology", type: "video", duration: "25 min" },
      { title: "AI Output Quality Framework", type: "course", duration: "1 hour" },
    ],
  },
  {
    dimension: "workflow-integration",
    resources: [
      { title: "AI Workflow Design Principles", type: "article", duration: "15 min" },
      { title: "Automation Tools 101", type: "video", duration: "40 min" },
      { title: "Team AI Collaboration Best Practices", type: "course", duration: "1.5 hours" },
    ],
  },
  {
    dimension: "ethics-safety",
    resources: [
      { title: "AI Ethics Fundamentals", type: "article", duration: "20 min" },
      { title: "Data Privacy & AI", type: "video", duration: "30 min" },
      { title: "Enterprise AI Governance Guide", type: "course", duration: "2 hours" },
    ],
  },
  {
    dimension: "learning-adaptation",
    resources: [
      { title: "AI Tool Updates Digest", type: "newsletter", duration: "Weekly" },
      { title: "Rapid Tool Adoption Framework", type: "video", duration: "15 min" },
      { title: "AI Learning Path Planning", type: "course", duration: "1 hour" },
    ],
  },
];
