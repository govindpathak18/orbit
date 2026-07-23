import { getModel } from "../utils/model.js";

// router node/agent
// Decides which agent to call based on the prompt and file type

export const routerNode = async(state)=>{

// if user selects the agent, automatically call the agent
// else router/llm will decide the agent
if (state.agent && state.agent !== "auto") {
    return {
        ...state,
        agent: state.agent
    };
}


if(state.file){
    if( // if user provides an image, call vision agent
        state.file.mimetype.startsWith("image/")
    ){
        return{
            ...state,
            agent:"vision"
        };
    }
}

if(state.file){
    // if user provides a pdf, call pdf_rag agent
    if(state.file.mimetype==="application/pdf"){
        return{
            ...state,
            agent:"pdf_rag"
        };
    }
}


 const llm = getModel("router"); // default groq model

 const result = await llm.invoke(`

You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- image 

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Questions about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

Return ONLY one word:

chat
search
coding
pdf

User Query:

${state.prompt}

 `);

 return {
  ...state,
  agent:
  result.content
   .trim()
   .toLowerCase()
 };

};