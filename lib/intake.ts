export type Answers = Record<string, string | string[]>
export type Q = {
  id: string; label: string; hint?: string
  type: 'text' | 'long' | 'single' | 'multi' | 'check'
  options?: string[]; required?: boolean; showIf?: (a: Answers) => boolean
}
export const sections: { key: string; title: string; subtitle: string; questions: Q[] }[] = [
  { key: 'A', title: 'Personal information', subtitle: 'Basic details so we know who you are', questions: [
    { id: 'A1', label: 'Full name', type: 'text', required: true },
    { id: 'A2', label: 'Age', type: 'single', required: true, options: ['17 – 20', '21 – 25', '26 – 30', '31 – 35', '36 – 40', '41 – 50', '50+'] },
    { id: 'A3', label: 'Gender', type: 'single', required: true, options: ['Male', 'Female', 'Prefer not to say'] },
    { id: 'A4', label: 'State of residence', type: 'text', required: true },
    { id: 'A5', label: 'Current occupation', type: 'single', required: true, options: ['University Student', 'Polytechnic / College Student', 'Recent Graduate (NYSC / Job Seeking)', 'Employed (Full-Time)', 'Employed (Part-Time)', 'Self-Employed / Business Owner', 'Freelancer', 'Unemployed'] },
    { id: 'A6', label: 'How did you hear about Yelwa Leagues?', type: 'single', required: true, options: ['Friend / Word of Mouth', 'Social Media', 'Campus Outreach', 'Event / Programme', 'Other'] },
    { id: 'A6_other', label: 'Please specify', type: 'text', showIf: (a) => a.A6 === 'Other' },
  ] },
  { key: 'B', title: 'Academic background', subtitle: 'Helps us calibrate the language and depth of delivery', questions: [
    { id: 'B1', label: 'Highest educational qualification', type: 'single', required: true, options: ['SSCE / WAEC / NECO', 'ND / NCE', 'HND', 'BSc / BA / BEng (In Progress)', 'BSc / BA / BEng (Completed)', 'MSc / MBA / MA', 'PhD', 'Self-Taught / No Formal Qualification'] },
    { id: 'B2', label: 'Field of study / area of specialisation', hint: 'e.g. Accounting, Engineering, History, Medicine', type: 'text', required: true },
    { id: 'B3', label: 'Which of these business terms are you familiar with?', hint: 'Tick all that apply. Be honest, there are no wrong answers.', type: 'multi', options: ['Cash Flow', 'Balance Sheet', 'Profit Margin', 'Supply & Demand', 'Value Proposition', 'Return on Investment (ROI)', 'Market Segmentation', 'None of the above'] },
  ] },
  { key: 'C', title: 'Business experience', subtitle: 'Where you are in your entrepreneurship journey', questions: [
    { id: 'C1', label: 'Do you currently run a business or side hustle?', type: 'single', required: true, options: ['Yes — an established business', 'Yes — a small or emerging side hustle', 'No — but I have tried before', 'No — I am completely new to business'] },
    { id: 'C2', label: 'How long have you been in business?', type: 'single', options: ['Less than 6 months', '6 months – 1 year', '1 – 3 years', '3 – 5 years', '5+ years'], showIf: (a) => String(a.C1 ?? '').startsWith('Yes') },
    { id: 'C3', label: 'What industry or sector is your business in?', hint: 'e.g. Fashion, Food & Beverage, Digital Services, Agriculture, Tech', type: 'text' },
    { id: 'C4', label: 'What is your biggest current business challenge?', hint: 'One or two sentences. Be specific.', type: 'long' },
    { id: 'C5', label: 'Have you attended any business seminars, workshops or masterclasses before?', type: 'single', required: true, options: ['Yes — multiple times', 'Yes — once or twice', 'No'] },
    { id: 'C6', label: 'Have you read business books or completed online business courses?', type: 'single', options: ['Yes — several', 'Yes — a few', 'Not really', 'No'] },
  ] },
  { key: 'D', title: 'Digital and tool literacy', subtitle: 'Helps us understand your readiness for the systems and automation components', questions: [
    { id: 'D1', label: 'How would you describe your overall digital comfort level?', type: 'single', required: true, options: ['Basic — I mainly use calls and WhatsApp', 'Intermediate — I use documents, email, and social media comfortably', 'Advanced — I use tools, systems, and software regularly'] },
    { id: 'D2', label: 'Do you use any AI tools? (e.g. ChatGPT, Claude, Gemini)', type: 'single', required: true, options: ['Yes — I use them regularly', 'Yes — occasionally', 'I have tried them once or twice', 'No — never'] },
    { id: 'D3', label: 'Are you familiar with any business productivity tools?', hint: 'Tick all that apply.', type: 'multi', required: true, options: ['Notion', 'Slack', 'Trello / Asana', 'Google Workspace (Docs, Sheets, Drive)', 'Canva', 'WhatsApp Business', 'None of the above'] },
    { id: 'D4', label: 'Are you familiar with any automation tools? (e.g. Zapier, Make)', type: 'single', options: ['Yes — I use them', "I have heard of them but don't use them", 'No — never heard of them'] },
  ] },
  { key: 'E', title: 'Goals and availability', subtitle: 'Helps us place you on the right track and timetable', questions: [
    { id: 'E1', label: 'Your reasons for joining Yelwa Leagues', hint: 'Tick all that apply.', type: 'multi', required: true, options: ['I want to start a business from scratch', 'I want to grow or scale an existing business', 'I want to learn business for future use', 'I am exploring a career transition into entrepreneurship', 'Personal development and financial literacy'] },
    { id: 'E2', label: 'Where do you want to be in 12 months as a result of this program?', hint: 'Be specific. Give us a target, not a vague wish.', type: 'long', required: true },
    { id: 'E3', label: 'Is there a specific income or business milestone you are working toward?', hint: 'e.g. N100k a month, launching my first product, getting my first 50 customers', type: 'text' },
    { id: 'E4', label: 'How many hours per week can you realistically commit?', type: 'single', required: true, options: ['2 hours per week', '4 hours per week', '6 hours per week', 'More than 6 hours per week'] },
    { id: 'E5', label: 'What times are you generally available?', hint: 'Tick all that apply.', type: 'multi', required: true, options: ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekends Only', 'Flexible — anytime'] },
    { id: 'E6', label: 'Is there anything else you want us to know about you?', type: 'long' },
    { id: 'consent', label: 'I agree that Yelwa Leagues may store and use my details to assess my application.', type: 'check', required: true },
  ] },
]
export const isEmpty = (v: unknown) => v === undefined || v === '' || (Array.isArray(v) && v.length === 0)
