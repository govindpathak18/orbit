import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { getMemory } from "../utils/memory.js";
import { getModel } from "../utils/model.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";


// for normal llm chats


export const chatAgent = async (state) => {

  await checkAgentLimit(state.userId, "chat");

  await deductCredits(state.userId, "chat");

  const llm = getModel("chat"); // groq

  const history = await getMemory(state.conversationId);

  const normalizeSearchResults = (results) => {
    if (!results) return "";

    const normalizeItem = (item, index) => {
      const lines = [`Result ${index + 1}:`];
      if (item.title) lines.push(`Title: ${item.title}`);
      if (item.link) lines.push(`Link: ${item.link}`);
      if (item.url) lines.push(`URL: ${item.url}`);
      if (item.snippet) lines.push(`Snippet: ${item.snippet}`);
      if (item.description) lines.push(`Description: ${item.description}`);
      if (item.source) lines.push(`Source: ${item.source}`);
      return lines.join("\n");
    };

    if (Array.isArray(results)) {
      return results.map(normalizeItem).join("\n\n");
    }

    if (typeof results === "object") {
      const nestedArray = results.results || results.value || results.items || results.webPages?.value || results.organic || results.organic_results;
      if (Array.isArray(nestedArray)) {
        return nestedArray.map(normalizeItem).join("\n\n");
      }

      return Object.entries(results)
        .map(([key, value]) => {
          if (Array.isArray(value)) {
            return `${key}:\n${value.map(normalizeItem).join("\n\n")}`;
          }
          return `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`;
        })
        .join("\n");
    }

    return String(results);
  };

  const searchContext = state.searchResults
    ? `
    Web Search Results:
    ${normalizeSearchResults(state.searchResults)}

    Use the above search results to answer the user.
    If the results include URLs or links, include them directly in the answer using markdown link formatting.
    Do not say you cannot provide links.
    `
    : ""

  // messages is an array of system prompt+history+user prompt+aiMessage

  const messages = [

    // system prompt,
    new SystemMessage(`
    You are orbit, an intelligent AI assistant.

    ${searchContext} 

    If searchContext exists:

    - Use search results to answer.
    - Do not mention internal tools.

    Rules:
    - give answers in a friendly and formal ways.
    - you can include imojis during chat
    - For simple questions, greetings, and short queries, respond naturally in plain text.
    - For technical, educational, coding, or detailed topics, use clean Markdown.

    Formatting:

    - Use # for titles and ## for sections.
    - Leave a blank line after headings.
    - Use bullet points for lists.
    - Use numbered lists for steps.
    - Use fenced code blocks with language tags for code.
    - Keep paragraphs short and readable.
    - Never write headings and content on the same line.
    - Never generate large walls of text.

    `
    )
  ];

  // from redis
  history.forEach((msg) => {

    if (msg.role === "user") {
      messages.push(new HumanMessage(msg.content));
    }

    if (msg.role === "assistant") {
      messages.push(new AIMessage(msg.content));
    }
  });

  // prompt
  messages.push(new HumanMessage(state.prompt));

  const response = await llm.invoke(messages);

  const images = state.searchResults?.images || [];

  return {
    ...state,

    response: response.content,
    images: images

  };

};