export function buildClarifyPrompt(
  title: string,
  description: string,
  maxQuestionsAllowed: number = 4
) {
  return `You are a product analyst reviewing an incoming feature request
before it gets turned into a formal spec.

Feature request title: ${title}
Feature request description: ${description}

Decide if this request has enough detail to write a proper PRD from, or if
it's missing critical information an engineer would need.

CRITICAL CONSTRAINT: You are allowed to ask AT MOST ${maxQuestionsAllowed} clarifying questions in total (HARD CAP: MAXIMUM 4). 
FEWER IS ALWAYS PREFERRED. Ask 1 or 2 focused questions if needed. Only ask a question if the answer is absolutely essential to build the feature. 
Do NOT ask optional, minor, or generic questions (like "what is the priority").
If the request is clear enough to proceed, return an empty questions list (\`"questions": []\`) and set \`"needsClarification": false\`.`
}
