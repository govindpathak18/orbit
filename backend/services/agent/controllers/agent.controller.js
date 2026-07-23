import redis from "../../../shared/redis/redis.js";
import { graph } from "../graph/supervisor.graph.js";
import { addMessage } from "../utils/memory.js";
import axios from "axios"

export const chat = async (req, res, next) => {

  try {

    // get user prompt
    const {
      prompt,
      conversationId,
      agent
    } = req.body;


    // add a new message(prompt)
    await addMessage(
      conversationId,
      "user",
      prompt
    );

    // calls save-message route to save the message(prompt)
    await axios.post(`${process.env.CHAT_SERVICE}/save-message`, {
      conversationId,
      role: "user",
      content: prompt
    })


    // invoke grpah
    const result = await graph.invoke({
        prompt,
        conversationId,
        userId:
          req.headers[
          "x-user-id"
          ],
        agent,
        file: req.file
      });


    // adds the ai response(result) message
    await addMessage(
      conversationId,
      "assistant",
      result.response
    );
    
    //saves the result message
    await axios.post(
      `${process.env.CHAT_SERVICE}/save-message`,
      {
        conversationId,
        role: "assistant",
        content: result.response,
        images: result.images,
        artifacts: result.artifacts || []
      }
    )


    return res.json({
      success: true,
      answer:result.response,
      images: result.images,
      artifacts:result.artifacts || []
    });

  } catch (error) {
    next(error)
  }

}