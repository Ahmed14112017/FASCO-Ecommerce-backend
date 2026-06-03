import axios from "axios";

export const getAuthToken = async () => {
  const res = await axios.post("https://accept.paymob.com/api/auth/tokens", {
    api_key: process.env.PAYMOB_API_KEY,
  });

  return res.data.token;
};

export const createPaymobOrder = async (token: string, order: any) => {
  const res = await axios.post(
    "https://accept.paymob.com/api/ecommerce/orders",
    {
      auth_token: token,
      delivery_needed: "false",
      amount_cents: order.totalPrice * 100,
      currency: "EGP",
      items: order.items.map((item: any) => ({
        name: item.product.name,
        amount_cents: item.price * 100,
        quantity: item.quantity,
      })),
    },
  );

  return res.data;
};

export const getPaymentKey = async (
  token: string,
  orderId: number,
  amount: number,
) => {
  const res = await axios.post(
    "https://accept.paymob.com/api/acceptance/payment_keys",
    {
      auth_token: token,
      amount_cents: amount * 100,
      expiration: 3600,
      order_id: orderId,
      currency: "EGP",

      billing_data: {
        first_name: "User",
        last_name: "Test",
        email: "test@test.com",
        phone_number: "01000000000",
        apartment: "NA",
        floor: "NA",
        street: "NA",
        building: "NA",
        city: "Cairo",
        country: "EG",
        postal_code: "NA",
        state: "NA",
      },

      integration_id: process.env.PAYMOB_INTEGRATION_ID,
    },
  );

  return res.data.token;
};
