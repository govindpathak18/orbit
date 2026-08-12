// for generating image generation prompt
// to creatate more detailed prompt for llm
// using pollinations api to generate image from prompt

import axios from "axios";
import { getModel } from "../utils/model.js";
import { uploadToS3 } from "../utils/uploadToS3.js";
import { getDownloadUrl } from "../utils/getDownloadUrl.js";
import { checkAgentLimit } from "../config/agentRateLimit.js";
import { deductCredits } from "../utils/deductCredits.js";

export const imageAgent = async (state) => {

  try {

    await checkAgentLimit(state.userId, "image");

    await deductCredits(state.userId, "image");

    const llm = getModel("image");

    // generate an enhanced prompt
    const promptResponse = await llm.invoke(`

You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:

${state.prompt}

`);

    const enhancedPrompt = String(promptResponse.content || state.prompt).trim();
    if (!enhancedPrompt) {
      throw new Error("Image prompt generation returned empty content.");
    }

    // image generation url (pollination api)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}`;

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      validateStatus: (status) => status >= 200 && status < 300,
    });

    if (!imageResponse?.data || imageResponse.data.byteLength === 0) {
      throw new Error("Image API returned an empty response.");
    }

    const imageBuffer = Buffer.from(imageResponse.data);

    const fileName = `image-${Date.now()}.png`;

    // upload the image to Cloudinary
    const uploadResult = await uploadToS3(imageBuffer, fileName, "image/png");

    // get the image url (Cloudinary secure_url or built URL)
    const downloadUrl = await getDownloadUrl(uploadResult.public_id || uploadResult);

    return {
      ...state,
      response: `
# 🖼️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.
`
    };

  } catch (error) {
    console.error("Image Agent Error:", error);
    return {
      ...state,
      response: `❌ Failed to generate image. Error: ${error?.message || "Unknown error"}`,
    };
  }
};