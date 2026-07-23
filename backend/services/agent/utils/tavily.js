import { TavilySearch } from "@langchain/tavily";

// tool for search agent

export const searchTool = new TavilySearch({
  maxResults: 5,
  topic: "general",
  includeImages:true
});
