import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";
import { searchTool } from "../utils/tavily.js";

// for web search
// using tavily

export const searchAgent = async (state) => {

  await checkAgentLimit(
    state.userId,
    "search"
  );

  await deductCredits(state.userId,"search");

  try {

    const results = await searchTool.invoke({query: state.prompt});
    // console.log(results)

    return { // returns to chat agent
      ...state,
      searchResults: results,
    };

  } catch (error) {
    // console.log(error);
    return {
      ...state,
      searchResults: []
    };
  }
};