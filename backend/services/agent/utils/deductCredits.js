import axios from "axios";

const authServiceUrl =
    process.env.AUTH_SERVICE_URL || process.env.AUTH_SERVICE;

export const deductCredits = async (userId, agent) => {
    try {
        const response = await axios.patch(
            `${authServiceUrl}/api/auth/internal/deduct-credits`,
            {
                userId,
                agent
            }
        );

        return response.data;
    } catch (error) {
        const response = error.response?.data;

        console.error("❌ Credit deduction failed");
        console.error("Status:", error.response?.status);
        console.error("Response:", response);
        console.error("Message:", error.message);

        const err = new Error(
            response?.message || "Failed to deduct credits."
        );

        err.status = error.response?.status || 500;

        err.data = {
            success: false,
            title: response?.title || "Credit Deduction Failed",
            message:
                response?.message ||
                "Failed to deduct credits."
        };

        throw err;
    }
};