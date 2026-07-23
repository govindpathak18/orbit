import { Annotation } from "@langchain/langgraph";


// creating a custom agent for the langGraph
export const AgentState = Annotation.Root({

    // key : Annotation()

    prompt: Annotation(),

    conversationId: Annotation(),

    // from req header
    userId: Annotation(),

    //from router node
    agent: Annotation(),

    response: Annotation(),

    // from search and imageGen agent
    images: Annotation(),

    model: Annotation(),

    file: Annotation(),

    // from coding agent
    artifacts: Annotation(),

    // from search agent
    searchResults: Annotation(),

    codeContext: Annotation(),

    pdfContext: Annotation()

});