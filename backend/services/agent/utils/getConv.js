import axios from "axios";

const chatServiceUrl = process.env.CHAT_SERVICE_URL || process.env.CHAT_SERVICE;

export const getConversationHistory =
    async (conversationId) => {

        const response =
            await axios.get(

                `${chatServiceUrl}/api/chat/get-messages/${conversationId}`

            );

        return response.data;

    };