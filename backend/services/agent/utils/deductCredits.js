import axios from "axios";

const authServiceUrl = process.env.AUTH_SERVICE_URL || process.env.AUTH_SERVICE;

export const deductCredits = async (userId,agent) => {
    try {
        await axios.patch(
            `${authServiceUrl}/internal/deduct-credits`,
            {userId,agent}
        );

    }

    catch (error) {
        const response =error.response?.data;

        const err = new Error(response?.message || "Failed to deduct credits.");

        err.status = error.response?.status || 500;

        err.data = {
            success: false,
            title: response?.title || "Insufficient Credits",
            message:response?.message || "You don't have enough credits. Please upgrade your plan."
        };

        throw err;

    }

};