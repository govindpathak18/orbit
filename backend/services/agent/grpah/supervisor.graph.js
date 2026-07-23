import { StateGraph } from "@langchain/langgraph";
import { AgentState } from "./state.js";
import { routerNode } from "./router.node.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { searchAgent } from "../agents/search.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { imageAgent } from "../agents/imageGen.agent.js";
import { visionAgent } from "../agents/vision.agent.js";
import { pdfRagAgent } from "../agents/pdfRag.agent.js";

// creating a supervisor graph 
// that manages the flow of different agents based on user input and state

const workflow =
  new StateGraph(
    AgentState // custom state
  );

// AgentState = {prompt,conversationId,userId,agent,
//              response,images,model,file,artifacts,
//              searchResults,codeContext,pdfContext}


// adding nodes :-> {node,action}
// we have following nodes -> {router,chat,coding,search,pdf,ppt,image,vision,pdf_rag}

workflow.addNode(
  "router", // decides which agent to use based on input
  routerNode
);

workflow.addNode(
  "chat", // for general conversation and queries
  chatAgent
);

workflow.addNode(
  "coding", // for coding related queries and code generation
  codingAgent
);

workflow.addNode(
  "search", // for web search and information retrieval
  searchAgent
);

workflow.addNode(
  "pdf", // for pdf document processing and queries
  pdfAgent
);
workflow.addNode(
  "ppt", // for ppt document processing and queries
  pptAgent
);
workflow.addNode(
  "image", // for creating image generation prompts
  imageAgent
);
workflow.addNode(
  "vision", // for analyzing the image 
  visionAgent
);
workflow.addNode(
  "pdf_rag", // for pdf retrieval-augmented generation tasks
  pdfRagAgent
);
workflow.addEdge(
  "__start__", // start of the graph
  "router" // each query first passes to the router
);


// adding conditional edges based on the agent type in the state
workflow.addConditionalEdges(
  "router",(state) => {
    // based on the agent type, we route to the appropriate node
    switch (state.agent) {

      case "search":
        return "search";

      case "coding":
        return "coding";

      case "pdf":
        return "pdf";

      case "ppt":
        return "ppt";

      case "image":
        return "image";

      case "vision":
        return "vision";

      case "pdf_rag":
        return "pdf_rag";

      default:
        return "chat";

    }
  },
  // after the router node, we route to the appropriate agent node
  { 
    chat: "chat",
    search: "search",
    coding: "coding",
    pdf: "pdf",
    ppt: "ppt",
    image: "image",
    vision: "vision",
    pdf_rag: "pdf_rag"

  }

);


// adding normal edges
workflow.addEdge(
  "coding",
  "__end__"
);
workflow.addEdge(
  "image",
  "__end__"
);
workflow.addEdge(
  "search",
  "chat"
// search agent directs to chat agent for further conversation after search results are provided
);
workflow.addEdge(
  "pdf",
  "__end__"
);
workflow.addEdge(
  "ppt",
  "__end__"
);
workflow.addEdge(
  "chat",
  "__end__"
);
workflow.addEdge(
  "vision",
  "__end__"
);
workflow.addEdge(
  "pdf_rag",
  "__end__"
);


// compiling th graph
export const graph = workflow.compile();