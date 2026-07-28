import api from "../utils/axios";

// creates an order and returns the order details
export const createOrder = async (plan) => {
    const { data } = await api.post(
        "/api/billing/create-order",
        { plan }
    );

    return data;

};