export type Lang = 'zh' | 'en';

export interface LocalizedString {
  zh: string;
  en: string;
}

export type DimensionId =
  | 'ai-understanding'
  | 'task-decomposition'
  | 'prompt-capability'
  | 'output-evaluation'
  | 'risk-awareness'
  | 'workflow-migration';

export type QuestionType = 'profile' | 'knowledge' | 'scenario' | 'practical';

export interface QuestionOption {
  id: string;
  text: LocalizedString;
  score: number;
  tierSignal?: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  dimension?: DimensionId;
  weight: number;
  question: LocalizedString;
  note?: LocalizedString;
  options?: QuestionOption[];
  multiSelect?: boolean;
  rubric?: LocalizedString[];
}

export const dimensions = [
  {
    id: 'ai-understanding' as DimensionId,
    name: { zh: 'AI 理解', en: 'AI Understanding' },
    description: { zh: '理解大模型的工作原理与边界', en: 'Understanding how LLMs work and their limitations' },
    icon: 'Brain',
  },
  {
    id: 'task-decomposition' as DimensionId,
    name: { zh: '任务拆解', en: 'Task Decomposition' },
    description: { zh: '将复杂任务拆成 AI 可执行的步骤', en: 'Breaking complex tasks into AI-executable steps' },
    icon: 'Target',
  },
  {
    id: 'prompt-capability' as DimensionId,
    name: { zh: '提示能力', en: 'Prompt Capability' },
    description: { zh: '撰写能让 AI 给出有用结果的指令', en: 'Crafting instructions that get useful AI outputs' },
    icon: 'MessageSquare',
  },
  {
    id: 'output-evaluation' as DimensionId,
    name: { zh: '输出评估', en: 'Output Evaluation' },
    description: { zh: '判断 AI 输出的质量与可信度', en: 'Assessing the quality and reliability of AI outputs' },
    icon: 'CheckCircle',
  },
  {
    id: 'risk-awareness' as DimensionId,
    name: { zh: '风险意识', en: 'Risk Awareness' },
    description: { zh: '识别并管理 AI 使用中的信息与伦理风险', en: 'Identifying and managing information and ethical risks in AI use' },
    icon: 'Shield',
  },
  {
    id: 'workflow-migration' as DimensionId,
    name: { zh: '工作流迁移', en: 'Workflow Migration' },
    description: { zh: '将 AI 融入真实工作流程与系统', en: 'Integrating AI into real workflows and systems' },
    icon: 'GitMerge',
  },
];

export const levels = [
  {
    level: 1,
    internalTier: 1,
    name: { zh: 'AI 初学者', en: 'AI Beginner' },
    description: { zh: '刚开始了解 AI 工具，建立基础认知', en: 'Just starting out with AI tools, building foundational awareness' },
    minScore: 0,
    maxScore: 20,
    color: 'bg-slate-500',
    badge: 'L1',
  },
  {
    level: 2,
    internalTier: 2,
    name: { zh: 'AI 工具用户', en: 'AI Tool User' },
    description: { zh: '能用 AI 完成简单任务，开始探索更多可能', en: 'Using AI for simple tasks, starting to explore more possibilities' },
    minScore: 21,
    maxScore: 40,
    color: 'bg-teal-500',
    badge: 'L2',
  },
  {
    level: 3,
    internalTier: 3,
    name: { zh: 'AI 提示者', en: 'AI Prompter' },
    description: { zh: '能写出有效提示词，对输出进行批判性评估', en: 'Writing effective prompts and critically evaluating outputs' },
    minScore: 41,
    maxScore: 60,
    color: 'bg-blue-500',
    badge: 'L3',
  },
  {
    level: 4,
    internalTier: 4,
    name: { zh: 'AI 协作者', en: 'AI Collaborator' },
    description: { zh: '将 AI 深度融入工作流，具备系统级思维', en: 'Deeply integrating AI into workflows with systems-level thinking' },
    minScore: 61,
    maxScore: 80,
    color: 'bg-amber-500',
    badge: 'L4',
  },
  {
    level: 5,
    internalTier: 5,
    name: { zh: 'AI 工作流设计师', en: 'AI Workflow Designer' },
    description: { zh: '用 AI 重构工作系统，能从零构建 AI 工具', en: 'Redesigning work systems with AI, building custom AI tools' },
    minScore: 81,
    maxScore: 100,
    color: 'bg-rose-500',
    badge: 'L5',
  },
];

export const allQuestions: Question[] = [
  // Profile questions
  {
    id: 'P1',
    type: 'profile',
    weight: 0,
    question: { zh: '你目前主要的身份是？', en: 'What is your primary role?' },
    options: [
      { id: 'dev', text: { zh: '开发 / 技术', en: 'Developer / Technical' }, score: 0 },
      { id: 'design', text: { zh: '设计 / 创意', en: 'Design / Creative' }, score: 0 },
      { id: 'marketing', text: { zh: '市场 / 运营', en: 'Marketing / Operations' }, score: 0 },
      { id: 'product', text: { zh: '产品 / 管理', en: 'Product / Management' }, score: 0 },
      { id: 'student', text: { zh: '学生 / 求职', en: 'Student / Job Seeker' }, score: 0 },
      { id: 'freelance', text: { zh: '自由职业 / 创作者', en: 'Freelancer / Creator' }, score: 0 },
      { id: 'other', text: { zh: '其他', en: 'Other' }, score: 0 },
    ],
  },
  {
    id: 'P2',
    type: 'profile',
    weight: 0,
    question: { zh: '你使用 AI 工具（ChatGPT / Claude / Gemini 等）大概多久了？', en: 'How long have you been using AI tools (ChatGPT / Claude / Gemini, etc.)?' },
    options: [
      { id: 'never', text: { zh: '几乎没用过', en: 'Barely used them' }, score: 0 },
      { id: 'lt6m', text: { zh: '半年以内', en: 'Less than 6 months' }, score: 0 },
      { id: '6m2y', text: { zh: '半年到 2 年', en: '6 months to 2 years' }, score: 0 },
      { id: 'gt2y', text: { zh: '2 年以上', en: 'More than 2 years' }, score: 0 },
    ],
  },
  {
    id: 'P3',
    type: 'profile',
    weight: 0,
    multiSelect: true,
    question: { zh: '你最常拿 AI 干什么？（可多选）', en: 'What do you most often use AI for? (Select all that apply)' },
    options: [
      { id: 'research', text: { zh: '查资料 / 问答', en: 'Research / Q&A' }, score: 0 },
      { id: 'writing', text: { zh: '写东西', en: 'Writing' }, score: 0 },
      { id: 'planning', text: { zh: '做方案 / 决策', en: 'Planning / Decision-making' }, score: 0 },
      { id: 'coding', text: { zh: '编程 / 做工具', en: 'Coding / Building tools' }, score: 0 },
      { id: 'automation', text: { zh: '自动化流程', en: 'Automating workflows' }, score: 0 },
      { id: 'learning', text: { zh: '学习 / 研究', en: 'Learning / Research' }, score: 0 },
    ],
  },
  // Knowledge questions
  {
    id: 'J1',
    type: 'knowledge',
    dimension: 'ai-understanding',
    weight: 1,
    question: { zh: '下面哪种说法，最接近大模型「给出答案」的真实方式？', en: "Which statement best describes how a large language model actually 'gives an answer'?" },
    note: { zh: '理解「它在预测、不是在核实」，是判断它何时可信的地基。', en: "Understanding 'it is predicting, not verifying' is the foundation for knowing when to trust it." },
    options: [
      { id: 'a', text: { zh: '它在一个庞大数据库里检索出最匹配的那条答案', en: 'It retrieves the best-matching answer from a massive database' }, score: 1 },
      { id: 'b', text: { zh: '它根据已有文字，一个词一个词地预测最可能的下一个词', en: 'It predicts the most likely next word, one word at a time, based on existing text' }, score: 4 },
      { id: 'c', text: { zh: '它有自己的判断力，知道哪个答案是对的', en: 'It has its own judgment and knows which answer is correct' }, score: 1 },
      { id: 'd', text: { zh: '它每次都实时联网核实后再回答', en: 'It always verifies in real-time via the internet before answering' }, score: 0 },
    ],
  },
  {
    id: 'J2',
    type: 'knowledge',
    dimension: 'output-evaluation',
    weight: 1,
    question: { zh: 'AI 一本正经地编出一个不存在的事实或出处，最主要的原因是？', en: 'What is the main reason AI confidently fabricates non-existent facts or sources?' },
    note: { zh: '知道幻觉是机制的副产品而非故障，才会养成默认核实的习惯。', en: 'Knowing hallucination is a side effect of the mechanism — not a bug — is what builds the habit of default verification.' },
    options: [
      { id: 'a', text: { zh: '它在撒谎，故意骗你', en: 'It is lying and deliberately deceiving you' }, score: 1 },
      { id: 'b', text: { zh: '它被训练成给出「流畅、可信」的回答，而流畅 ≠ 真实', en: 'It is trained to give "fluent, convincing" answers — but fluency does not equal truth' }, score: 4 },
      { id: 'c', text: { zh: '它一定是被黑了或出 bug 了', en: 'It must have been hacked or has a bug' }, score: 1 },
      { id: 'd', text: { zh: '换个更贵的模型就不会再发生', en: 'Using a more expensive model will prevent this' }, score: 2 },
    ],
  },
  {
    id: 'J3',
    type: 'knowledge',
    dimension: 'ai-understanding',
    weight: 1,
    question: { zh: '你问 AI「最近一周的行业新闻」，它给了一份看起来很具体的清单。最该警惕的是？', en: "You ask AI for 'industry news from the past week' and it gives a specific-looking list. What should you be most cautious about?" },
    note: { zh: '时效性盲区是最常踩的坑——分不清「它在检索」还是「它在编」。', en: "The timeliness blind spot is the most common trap — not distinguishing between 'it is retrieving' vs 'it is generating'." },
    options: [
      { id: 'a', text: { zh: '它可能没有实时信息，这份「近期清单」可能是编的或过期的', en: 'It may lack real-time information — this "recent list" could be fabricated or outdated' }, score: 4 },
      { id: 'b', text: { zh: '没什么好警惕的，它说近期就是近期', en: 'Nothing to worry about — if it says recent, it is recent' }, score: 1 },
      { id: 'c', text: { zh: '清单太短，应该让它再多列一些', en: 'The list is too short — ask it to list more' }, score: 1 },
      { id: 'd', text: { zh: '担心它会泄露我的搜索记录', en: 'Worried it will leak my search history' }, score: 2 },
    ],
  },
  {
    id: 'J4',
    type: 'knowledge',
    dimension: 'risk-awareness',
    weight: 1,
    question: { zh: '关于把内容贴进公共 AI 工具，下面哪个理解最准确？', en: 'Which statement about pasting content into public AI tools is most accurate?' },
    note: { zh: '风险意识的底线，是知道「输入也有代价」。', en: "The baseline of risk awareness is knowing that 'input has a cost too'." },
    options: [
      { id: 'a', text: { zh: '反正没人看，随便贴', en: 'Nobody reads it anyway, so paste anything' }, score: 1 },
      { id: 'b', text: { zh: '你贴进去的内容可能被留存或用于训练，敏感信息要当心', en: 'Content you paste may be retained or used for training — sensitive information requires caution' }, score: 4 },
      { id: 'c', text: { zh: '只要不贴密码就绝对安全', en: 'As long as you do not paste passwords, it is completely safe' }, score: 2 },
      { id: 'd', text: { zh: '用付费版就 100% 没有任何数据风险', en: 'Using the paid version eliminates 100% of data risk' }, score: 2 },
    ],
  },
  {
    id: 'J5',
    type: 'knowledge',
    dimension: 'output-evaluation',
    weight: 1,
    question: { zh: '同样问一个问题，下面哪类任务的 AI 回答最该被你独立核实？', en: 'Across different types of tasks, which type of AI answer should you independently verify most?' },
    note: { zh: '高手知道 AI 在「生成型任务」上强、在「事实型任务」上需核实。', en: 'Experts know AI is strong on generative tasks but needs verification on factual claims.' },
    options: [
      { id: 'a', text: { zh: '帮我把这段话润色得更通顺', en: 'Polish this paragraph to make it flow better' }, score: 1 },
      { id: 'b', text: { zh: '给我一个具体的、可引用的数据 / 法条 / 医学结论', en: 'Give me a specific, citable statistic / legal clause / medical finding' }, score: 4 },
      { id: 'c', text: { zh: '帮我头脑风暴 10 个点子', en: 'Brainstorm 10 ideas for me' }, score: 1 },
      { id: 'd', text: { zh: '帮我把这段中文翻成英文', en: 'Translate this Chinese text to English' }, score: 1 },
    ],
  },
  // Scenario questions
  {
    id: 'S1',
    type: 'scenario',
    dimension: 'task-decomposition',
    weight: 2,
    question: { zh: '你想让 AI 帮你做一个「30 岁转行做产品经理」的学习计划。打开对话框，第一句最接近？', en: "You want AI to help you create a learning plan for 'switching to product management at 30'. What does your opening message most resemble?" },
    note: { zh: '一到二层的分水岭——你是把问题丢给 AI，还是先想清楚再调用它。', en: 'The T1→T2 dividing line: are you dumping the problem on AI, or thinking it through before engaging?' },
    options: [
      { id: 'a', text: { zh: '「帮我做一个产品经理的学习计划。」', en: '"Make me a product manager learning plan."' }, score: 1, tierSignal: 1 },
      { id: 'b', text: { zh: '「我做了 5 年市场，想转产品，每天能学 2 小时，预算有限，帮我做 3 个月计划。」', en: '"I have 5 years in marketing, want to move into product, can study 2 hours a day, limited budget — make me a 3-month plan."' }, score: 3, tierSignal: 2 },
      { id: 'c', text: { zh: '「在给我计划前，先问我 5 个问题来了解我的情况。」', en: '"Before giving me a plan, ask me 5 questions to understand my situation."' }, score: 4, tierSignal: 3 },
      { id: 'd', text: { zh: '「我先列了个草稿，你帮我看哪里不对、漏了什么。」', en: '"I drafted a plan — help me find what is wrong or missing."' }, score: 4, tierSignal: 3 },
    ],
  },
  {
    id: 'S2',
    type: 'scenario',
    dimension: 'prompt-capability',
    weight: 2,
    question: { zh: 'AI 给的第一版结果不太满意，你通常会？', en: 'The first draft from AI is not quite what you wanted. What do you typically do?' },
    note: { zh: '会「带着反馈迭代」才是提示能力的核心，而不是一次写出完美 prompt。', en: "'Iterating with feedback' is the core of prompt capability — not writing the perfect prompt on the first try." },
    options: [
      { id: 'a', text: { zh: '算了，结果就这样，自己手动改', en: 'Accept it and manually fix it yourself' }, score: 1, tierSignal: 1 },
      { id: 'b', text: { zh: '换个说法再问一遍，碰碰运气', en: 'Rephrase and ask again, hoping for better luck' }, score: 2, tierSignal: 2 },
      { id: 'c', text: { zh: '告诉它哪里不对、要什么风格和约束，让它针对性地改', en: 'Tell it what is wrong, specify the style and constraints, and ask it to revise accordingly' }, score: 4, tierSignal: 2 },
      { id: 'd', text: { zh: '先让它说「为什么这么写」，再决定怎么调', en: 'First ask it to explain why it wrote it that way, then decide how to adjust' }, score: 4, tierSignal: 3 },
    ],
  },
  {
    id: 'S3',
    type: 'scenario',
    dimension: 'workflow-migration',
    weight: 2,
    question: { zh: '让 AI 处理一个很懂行的专业问题，但通用回答总是隔靴搔痒。你会？', en: 'You want AI to handle a highly specialized professional question, but generic answers always miss the mark. What do you do?' },
    note: { zh: '三层的门槛是「调用你的信息资产」，不是换更强的模型。', en: "The T3 threshold is 'activating your information assets' — not switching to a stronger model." },
    options: [
      { id: 'a', text: { zh: '多问几次，挑一个看起来最专业的', en: 'Ask multiple times and pick whichever answer looks most professional' }, score: 1, tierSignal: 2 },
      { id: 'b', text: { zh: '接受「AI 就是不够专业」，回去自己干', en: 'Accept that "AI just is not professional enough" and do it yourself' }, score: 1, tierSignal: 1 },
      { id: 'c', text: { zh: '把自己积累的资料 / 案例 / 笔记喂给它，让它基于这些回答', en: 'Feed it your accumulated materials, cases, and notes so it can answer based on those' }, score: 4, tierSignal: 3 },
      { id: 'd', text: { zh: '直接换一个「更聪明的模型」', en: 'Just switch to a "smarter model"' }, score: 2, tierSignal: 2 },
    ],
  },
  {
    id: 'S4',
    type: 'scenario',
    dimension: 'task-decomposition',
    weight: 2,
    question: { zh: '一个复杂任务（比如做一份竞品分析），你倾向于怎么交给 AI？', en: 'For a complex task (like a competitive analysis), how do you tend to hand it to AI?' },
    note: { zh: '把大任务拆成 AI 可执行的小步，是产出质量的分水岭。', en: 'Breaking big tasks into AI-executable steps is the dividing line for output quality.' },
    options: [
      { id: 'a', text: { zh: '一句话：「帮我做一份竞品分析。」', en: 'One line: "Do a competitive analysis for me."' }, score: 1, tierSignal: 1 },
      { id: 'b', text: { zh: '把所有要求写成一大段，让它一把出完', en: 'Write all requirements in one big block and have it produce everything at once' }, score: 2, tierSignal: 2 },
      { id: 'c', text: { zh: '拆成几步：先定框架 → 再逐个竞品 → 最后汇总，分步推进', en: 'Break it into steps: define framework → analyze each competitor → summarize, advancing step by step' }, score: 4, tierSignal: 3 },
      { id: 'd', text: { zh: '让它先帮我拆解步骤，我确认后再逐步执行', en: 'Ask it to break down the steps first, confirm them, then execute step by step' }, score: 4, tierSignal: 3 },
    ],
  },
  {
    id: 'S5',
    type: 'scenario',
    dimension: 'workflow-migration',
    weight: 2,
    question: { zh: '有件事你每周都手动用 AI 做一次，有点烦。你会？', en: 'There is something you manually do with AI every week and it is getting tedious. What do you do?' },
    note: { zh: '「先手动多做几次确认稳定，再自动化」——过早自动化是四层最常见的翻车。', en: "'Do it manually a few more times to confirm stability before automating' — premature automation is the most common T4 pitfall." },
    options: [
      { id: 'a', text: { zh: '马上搭一个自动化工作流，一劳永逸', en: 'Immediately build an automation workflow to handle it once and for all' }, score: 2, tierSignal: 4 },
      { id: 'b', text: { zh: '先手动多做几次，确认流程稳定、确实会一直做，再考虑自动化', en: 'Do it manually a few more times, confirm the process is stable and recurring, then consider automating' }, score: 4, tierSignal: 4 },
      { id: 'c', text: { zh: '继续手动，没必要折腾', en: 'Keep doing it manually — not worth the hassle' }, score: 2, tierSignal: 3 },
      { id: 'd', text: { zh: '找找有没有现成工具能直接替我做', en: 'Search for an existing tool that can do it for me' }, score: 3, tierSignal: 3 },
    ],
  },
  {
    id: 'S6',
    type: 'scenario',
    dimension: 'workflow-migration',
    weight: 2,
    question: { zh: '你需要一个小工具，但市面上的要么太贵要么不顺手。第一反应是？', en: 'You need a small tool but existing ones are either too expensive or a poor fit. What is your first instinct?' },
    note: { zh: '五层的心智是「没有合适工具就自己造」，门槛已经很低了。', en: "The T5 mindset is 'if there is no suitable tool, build one yourself' — the barrier is now very low." },
    options: [
      { id: 'a', text: { zh: '凑合用现有的，或干脆手动', en: 'Make do with what exists, or just do it manually' }, score: 2, tierSignal: 3 },
      { id: 'b', text: { zh: '想着「要是有人给我做一个就好了」', en: 'Think "I wish someone would build this for me"' }, score: 1, tierSignal: 2 },
      { id: 'c', text: { zh: '试着用 AI 编程工具自己做一个够用的版本', en: 'Try using an AI coding tool to build a working version yourself' }, score: 4, tierSignal: 5 },
      { id: 'd', text: { zh: '先做个最小能跑的版本验证，好用再加功能', en: 'Build a minimal working version to validate, then add features if it works' }, score: 4, tierSignal: 5 },
    ],
  },
  {
    id: 'S7',
    type: 'scenario',
    dimension: 'output-evaluation',
    weight: 2,
    question: { zh: 'AI 给了你一段流畅、自信、还带具体数字的回答。你会最先做什么？', en: 'AI gives you a fluent, confident answer with specific numbers. What do you do first?' },
    note: { zh: '高手不是全信也不是全不信，而是能定位「哪一句在承重」。', en: "Experts neither trust everything nor reject everything — they identify 'which sentence is load-bearing'." },
    options: [
      { id: 'a', text: { zh: '看起来挺专业，直接用', en: 'Looks professional — use it directly' }, score: 0, tierSignal: 1 },
      { id: 'b', text: { zh: '我不信 AI，全部推翻重查', en: 'I do not trust AI — discard everything and re-research from scratch' }, score: 1, tierSignal: 1 },
      { id: 'c', text: { zh: '挑出那句「承重的」、最可能编的具体声称（那个数字 / 出处），优先核实', en: 'Identify the "load-bearing" specific claim (that number / source) most likely to be fabricated, and verify it first' }, score: 4, tierSignal: 4 },
      { id: 'd', text: { zh: '让 AI 自己标出「哪些是它不确定的」', en: 'Ask AI to flag which parts it is uncertain about' }, score: 3, tierSignal: 3 },
    ],
  },
  {
    id: 'S8',
    type: 'scenario',
    dimension: 'output-evaluation',
    weight: 2,
    question: { zh: 'AI 引用了一份「研究」来支持它的结论，你怎么处理？', en: "AI cites a 'study' to support its conclusion. What do you do?" },
    note: { zh: 'AI 给的「出处」也可能是幻觉，引用 ≠ 可信。', en: "The 'source' AI provides can itself be a hallucination — citation does not equal credibility." },
    options: [
      { id: 'a', text: { zh: '有引用就更可信了，直接用', en: 'Having a citation makes it more credible — use it directly' }, score: 1, tierSignal: 1 },
      { id: 'b', text: { zh: '让它把研究链接 / 出处给我，我去核实它是否真实存在', en: 'Ask for the study link or source, then verify it actually exists' }, score: 4, tierSignal: 4 },
      { id: 'c', text: { zh: '看着像那么回事就行', en: 'Looks reasonable enough' }, score: 1, tierSignal: 1 },
      { id: 'd', text: { zh: '让它再换一篇研究来支持', en: 'Ask it to cite a different study instead' }, score: 2, tierSignal: 2 },
    ],
  },
  {
    id: 'S9',
    type: 'scenario',
    dimension: 'risk-awareness',
    weight: 2,
    question: { zh: '你赶着今晚交方案，手头有客户的内部数据，想让 AI 帮你快速分析。你会？', en: 'You have a deadline tonight and client internal data you want AI to quickly analyze. What do you do?' },
    note: { zh: '「赶时间」是照妖镜——它逼出你真实的风险习惯，而非理想答案。', en: "'Rushing' is a mirror — it reveals your real risk habits, not your ideal answers." },
    options: [
      { id: 'a', text: { zh: '直接把数据粘进常用的 AI 工具', en: 'Paste the data directly into your usual AI tool' }, score: 0, tierSignal: 1 },
      { id: 'b', text: { zh: '先把公司名、人名、敏感数字脱敏，再粘进去', en: 'First anonymize company names, personal names, and sensitive numbers, then paste' }, score: 4, tierSignal: 3 },
      { id: 'c', text: { zh: '只用公司批准过的内部 AI 工具', en: 'Only use company-approved internal AI tools' }, score: 4, tierSignal: 3 },
      { id: 'd', text: { zh: '不放心，干脆全部手动做', en: 'Not comfortable with it — do everything manually' }, score: 2, tierSignal: 2 },
    ],
  },
  {
    id: 'S10',
    type: 'scenario',
    dimension: 'risk-awareness',
    weight: 2,
    question: { zh: '你用 AI 写了一篇要公开发布的文章，发之前你会？', en: 'You used AI to write an article for public release. Before publishing, you:' },
    note: { zh: '发布前的事实核查，比「像不像 AI」重要得多。', en: "Pre-publish fact-checking is far more important than 'does it sound like AI'." },
    options: [
      { id: 'a', text: { zh: '看着通顺就直接发', en: 'It reads well — publish directly' }, score: 1, tierSignal: 1 },
      { id: 'b', text: { zh: '至少核实里面的事实 / 数据 / 引用，再读一遍找硬伤', en: 'Verify facts, data, and citations at minimum, then read once more to find hard errors' }, score: 4, tierSignal: 3 },
      { id: 'c', text: { zh: '担心被人看出是 AI 写的，重点改文风', en: 'Worried people will detect it as AI-written — focus on rewriting the style' }, score: 2, tierSignal: 2 },
      { id: 'd', text: { zh: '完全重写，不敢用 AI 的任何一句', en: 'Completely rewrite it — not comfortable keeping any AI sentences' }, score: 2, tierSignal: 2 },
    ],
  },
  {
    id: 'S11',
    type: 'scenario',
    dimension: 'prompt-capability',
    weight: 2,
    question: { zh: '你发现「让 AI 反问你」最有用，是在什么时候？', en: "You find 'letting AI ask you questions back' most useful in which situation?" },
    note: { zh: '把 AI 从「生成器」变成「教练」，是会用的人共有的动作。', en: "Turning AI from a 'generator' into a 'coach' is a pattern shared by skilled users." },
    options: [
      { id: 'a', text: { zh: '没用过这招', en: 'I have never used this technique' }, score: 1, tierSignal: 1 },
      { id: 'b', text: { zh: '偶尔用，觉得是个小技巧', en: 'Occasionally — I think of it as a minor trick' }, score: 3, tierSignal: 2 },
      { id: 'c', text: { zh: '当我自己也没想清楚要什么时，让它先问我，逼我把模糊想法挤出来', en: 'When I have not figured out what I want myself — I let it question me to force out vague ideas' }, score: 4, tierSignal: 3 },
      { id: 'd', text: { zh: '我一般直接给完整需求，不太需要它反问', en: 'I usually give complete requirements directly — rarely need it to ask back' }, score: 3, tierSignal: 3 },
    ],
  },
  {
    id: 'S12',
    type: 'scenario',
    dimension: 'ai-understanding',
    weight: 2,
    question: { zh: '假设你要做一门小生意，AI 对它最大的意义是？', en: 'Suppose you are starting a small business. What is AI\'s greatest significance to it?' },
    note: { zh: '六层的心智是「用 AI 重构成本结构」，而非「把 AI 加进旧流程」。', en: "The T6 mindset is 'using AI to restructure cost architecture' — not 'adding AI to old processes'." },
    options: [
      { id: 'a', text: { zh: '帮我把现在的活干快一点', en: 'Help me do current tasks faster' }, score: 2, tierSignal: 4 },
      { id: 'b', text: { zh: '帮我省下请人的钱', en: 'Help me save money on hiring' }, score: 3, tierSignal: 4 },
      { id: 'c', text: { zh: '让我重新想「如果有 AI，这门生意本来该长什么样」，砍掉很多旧环节', en: 'Make me rethink "what this business would look like if designed with AI from scratch" — cutting out many old steps' }, score: 4, tierSignal: 6 },
      { id: 'd', text: { zh: '没太想过，先用起来再说', en: 'Have not thought much about it — just start using it and see' }, score: 1, tierSignal: 2 },
    ],
  },
  // Practical questions
  {
    id: 'PR1',
    type: 'practical',
    dimension: 'prompt-capability',
    weight: 3,
    question: { zh: '把下面这句模糊指令改写成一条能让 AI 给出有用结果的指令：\n\n「帮我写一篇关于健康饮食的文章。」', en: 'Rewrite this vague instruction into one that gets useful AI results:\n\n"Write me an article about healthy eating."' },
    rubric: [
      { zh: '交代了身份 / 受众（写给谁看）', en: 'Specified identity / audience (who it is for)' },
      { zh: '给了明确目标或用途（为什么写）', en: 'Gave a clear goal or purpose (why it is being written)' },
      { zh: '加了约束（篇幅、角度、禁忌等）', en: 'Added constraints (length, angle, exclusions, etc.)' },
      { zh: '指定了输出格式 / 结构', en: 'Specified output format / structure' },
      { zh: '给了示例、语气或参考风格', en: 'Provided examples, tone, or reference style' },
    ],
  },
  {
    id: 'PR2',
    type: 'practical',
    dimension: 'output-evaluation',
    weight: 3,
    question: { zh: '下面是一段 AI 生成的回答，请指出你认为哪一句最可疑，以及你会怎么核实它：\n\n「番茄工作法能显著提升专注力。根据斯坦福大学 2023 年的一项研究，采用 25 分钟工作法的人群，工作效率平均提升了 47%，远高于其他时间管理方法。许多专家也普遍认为，这是目前最有效的方式之一。」', en: 'Here is an AI-generated response. Identify which sentence is most suspicious and explain how you would verify it:\n\n"The Pomodoro Technique can significantly improve focus. According to a 2023 Stanford University study, people using the 25-minute work method saw an average 47% productivity improvement, far exceeding other time management methods. Many experts widely agree it is currently the most effective approach."' },
    rubric: [
      { zh: '定位到了那句编造的具体声称（「斯坦福 2023 研究 / 47%」），而非泛泛说「都要核实」', en: 'Pinpointed the fabricated specific claim ("Stanford 2023 study / 47%"), not just vaguely "verify everything"' },
      { zh: '说明了为什么可疑（具体可证伪 vs 模糊大词）', en: 'Explained why it is suspicious (specific and falsifiable vs vague language)' },
      { zh: '给出了可行的核实方法（查原始出处 / 交叉验证）', en: 'Provided a feasible verification method (check original source / cross-reference)' },
      { zh: '没有走极端（既不全信也不全盘否定）', en: 'Did not go to extremes (neither fully trust nor fully reject)' },
      { zh: '区分了「承重声称」（那个数据）和「无关紧要的措辞」（许多专家认为）', en: 'Distinguished "load-bearing claim" (the statistic) from "inconsequential wording" (many experts agree)' },
    ],
  },
  {
    id: 'PR3',
    type: 'practical',
    dimension: 'task-decomposition',
    weight: 3,
    question: { zh: '你要用 AI 帮你「一周内做出一个读书笔记小工具」。请把它拆成 3–5 个你会依次交给 AI 的步骤。', en: 'You want to use AI to "build a book notes tool in one week." Break it down into 3–5 steps you would hand to AI in sequence.' },
    rubric: [
      { zh: '拆成了 3–5 个有先后逻辑的步骤', en: 'Broke it into 3–5 steps with a clear sequential logic' },
      { zh: '每步是 AI 真能执行的具体任务（不是「做好它」这种空话）', en: 'Each step is a concrete task AI can actually execute (not vague filler like "do it well")' },
      { zh: '步骤之间有依赖 / 递进关系', en: 'Steps have dependency / progression relationships' },
      { zh: '体现「最小可行优先」（先跑通再加功能）', en: 'Reflects "minimum viable first" thinking (get it running before adding features)' },
      { zh: '包含一个验证 / 检查环节', en: 'Includes a verification / review step' },
    ],
  },
];

// Backward-compat: all questions as a flat array
export const sampleQuestions = allQuestions;

export const learningResources = [
  {
    dimension: 'ai-understanding',
    resources: [
      { title: { zh: '大语言模型是怎么工作的', en: 'How Large Language Models Work' }, type: 'article', duration: { zh: '15 分钟', en: '15 min' } },
      { title: { zh: 'AI 幻觉：原因与应对', en: 'AI Hallucinations: Causes and Responses' }, type: 'video', duration: { zh: '20 分钟', en: '20 min' } },
      { title: { zh: 'AI 的能力边界精讲', en: 'Deep Dive: AI Capability Boundaries' }, type: 'course', duration: { zh: '2 小时', en: '2 hours' } },
    ],
  },
  {
    dimension: 'task-decomposition',
    resources: [
      { title: { zh: '把大任务拆小的实战指南', en: 'Practical Guide to Breaking Down Large Tasks' }, type: 'article', duration: { zh: '20 分钟', en: '20 min' } },
      { title: { zh: '任务拆解 × AI 执行：15 个模板', en: 'Task Decomposition × AI Execution: 15 Templates' }, type: 'template', duration: { zh: '即用', en: 'Ready to use' } },
      { title: { zh: '复杂项目的 AI 拆解法', en: 'AI Decomposition for Complex Projects' }, type: 'course', duration: { zh: '1.5 小时', en: '1.5 hours' } },
    ],
  },
  {
    dimension: 'prompt-capability',
    resources: [
      { title: { zh: '提示词工程基础', en: 'Prompt Engineering Fundamentals' }, type: 'article', duration: { zh: '20 分钟', en: '20 min' } },
      { title: { zh: '高级提示技巧实战', en: 'Advanced Prompting Techniques in Practice' }, type: 'video', duration: { zh: '30 分钟', en: '30 min' } },
      { title: { zh: '提示词模板库', en: 'Prompt Template Library' }, type: 'template', duration: { zh: '即用', en: 'Ready to use' } },
    ],
  },
  {
    dimension: 'output-evaluation',
    resources: [
      { title: { zh: '识别 AI 幻觉的实用方法', en: 'Practical Methods for Identifying AI Hallucinations' }, type: 'article', duration: { zh: '10 分钟', en: '10 min' } },
      { title: { zh: '事实核查方法论', en: 'Fact-Checking Methodology' }, type: 'video', duration: { zh: '25 分钟', en: '25 min' } },
      { title: { zh: 'AI 输出质量评估框架', en: 'AI Output Quality Evaluation Framework' }, type: 'course', duration: { zh: '1 小时', en: '1 hour' } },
    ],
  },
  {
    dimension: 'risk-awareness',
    resources: [
      { title: { zh: 'AI 数据隐私实操指南', en: 'AI Data Privacy Practical Guide' }, type: 'article', duration: { zh: '20 分钟', en: '20 min' } },
      { title: { zh: 'AI 伦理基础', en: 'AI Ethics Fundamentals' }, type: 'video', duration: { zh: '30 分钟', en: '30 min' } },
      { title: { zh: '企业 AI 安全治理', en: 'Enterprise AI Security Governance' }, type: 'course', duration: { zh: '2 小时', en: '2 hours' } },
    ],
  },
  {
    dimension: 'workflow-migration',
    resources: [
      { title: { zh: 'AI 工作流设计原则', en: 'AI Workflow Design Principles' }, type: 'article', duration: { zh: '15 分钟', en: '15 min' } },
      { title: { zh: '自动化工具入门 101', en: 'Automation Tools 101' }, type: 'video', duration: { zh: '40 分钟', en: '40 min' } },
      { title: { zh: '团队 AI 协作最佳实践', en: 'Team AI Collaboration Best Practices' }, type: 'course', duration: { zh: '1.5 小时', en: '1.5 hours' } },
    ],
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export function selectQuestions(): Question[] {
  const profiles = allQuestions.filter((q) => q.type === 'profile');
  const knowledge = shuffleArray(allQuestions.filter((q) => q.type === 'knowledge')).slice(0, 4);
  const scenarios = shuffleArray(allQuestions.filter((q) => q.type === 'scenario')).slice(0, 8);
  const practicals = allQuestions.filter((q) => q.type === 'practical');
  return [...profiles, ...knowledge, ...scenarios, ...practicals];
}

export function scorePractical(id: string, text: string): number {
  if (!text || text.trim().length < 10) return 0;
  const t = text.toLowerCase();
  let score = 0;
  if (id === 'PR1') {
    if (/受众|读者|写给|audience|reader|for whom|target/i.test(t)) score++;
    if (/目标|用途|为什么|goal|purpose|why|objective/i.test(t)) score++;
    if (/约束|字数|篇幅|限制|长度|constraint|length|limit|word/i.test(t)) score++;
    if (/格式|结构|标题|小节|format|structure|heading|section/i.test(t)) score++;
    if (/例子|示例|语气|风格|example|tone|style|like/i.test(t)) score++;
  } else if (id === 'PR2') {
    if (/斯坦福|stanford/i.test(t)) score++;
    if (/47%|47 %|47percent/i.test(t)) score++;
    if (/可疑|suspicious|fabricat|hallucin|编造|为什么/i.test(t)) score++;
    if (/核实|验证|verify|check|cross.?reference|来源|source/i.test(t)) score++;
    if (/区分|承重|load.?bear|specific|模糊|vague|distinguish/i.test(t)) score++;
  } else if (id === 'PR3') {
    const stepCount = (t.match(/\d+\.|step \d|第[一二三四五]|步骤/g) || []).length;
    if (stepCount >= 3) score++;
    if (/具体|specific|implement|实现|build|创建|create|设计|design/i.test(t)) score++;
    if (/先|然后|接着|之后|依赖|first|then|next|after|depend/i.test(t)) score++;
    if (/最小|mvp|基础版|先跑通|minimum|viable|basic version/i.test(t)) score++;
    if (/验证|检查|测试|verify|check|test|review/i.test(t)) score++;
  }
  return score;
}
