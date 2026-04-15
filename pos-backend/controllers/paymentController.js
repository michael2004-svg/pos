const Payment = require("../models/paymentModel");
const config = require("../config/config");
const axios = require("axios");

const generateToken = async () => {
  const url = config.mpesa.environment === "production"
    ? "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    : "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth = Buffer.from(`${config.mpesa.consumerKey}:${config.mpesa.consumerSecret}`).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: { Authorization: auth }
    });
    return response.data.access_token;
  } catch (error) {
    console.error("Error generating M-Pesa token:", error.response?.data || error.message);
    throw error;
  }
};

const createOrder = async (req, res, next) => {
  try {
    const { amount, phone } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ success: false, message: "Phone number and amount required" });
    }

    const phoneNumber = phone.replace(/^0/, "254");

    const token = await generateToken();

    const stkCallbackUrl = config.mpesa.callbackUrl || "https://pos-production-25c0.up.railway.app/api/payment/stk-callback";
    const timestamp = new Date().toFormat("YYYYMMDDhhmmss");

    const password = Buffer.from(
      `${config.mpesa.shortCode}${config.mpesa.passkey}${timestamp}`
    ).toString("base64");

    const url = config.mpesa.environment === "production"
      ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
      : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";

    const requestData = {
      BusinessShortCode: config.mpesa.shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerBuyGoodsOnline",
      Amount: Math.round(amount),
      PartyA: phoneNumber,
      PartyB: config.mpesa.shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: stkCallbackUrl,
      AccountReference: "RESTRO_POS",
      TransactionDesc: "Restaurant Payment"
    };

    const response = await axios.post(url, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    res.status(200).json({
      success: true,
      message: "STK Push sent",
      data: {
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantId: response.data.MerchantRequestID
      }
    });
  } catch (error) {
    console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.errorMessage || "Payment request failed"
    });
  }
};

const stkCallback = async (req, res) => {
  try {
    const callbackData = req.body;

    if (callbackData.Body?.stkCallback) {
      const result = callbackData.Body.stkCallback;
      const resultCode = result.ResultCode;
      const resultDesc = result.ResultDesc;
      const checkoutRequestId = result.CheckoutRequestID;

      if (resultCode === 0) {
        const metadata = result.CallbackMetadata?.Item || [];
        const amount = metadata.find(i => i.Name === "Amount")?.Value;
        const mpesaReceiptNumber = metadata.find(i => i.Name === "MpesaReceiptNumber")?.Value;
        const phoneNumber = metadata.find(i => i.Name === "PhoneNumber")?.Value;

        const payment = new Payment({
          paymentId: mpesaReceiptNumber || checkoutRequestId,
          orderId: checkoutRequestId,
          amount: amount,
          currency: "KES",
          status: "completed",
          method: "M-Pesa",
          contact: phoneNumber,
          createdAt: new Date()
        });

        await payment.save();
        console.log("✅ Payment recorded:", mpesaReceiptNumber);
      } else {
        console.log("❌ Payment failed:", resultDesc);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Callback error:", error);
    res.status(500).json({ success: false });
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { checkoutRequestID } = req.body;

    const token = await generateToken();

    const url = config.mpesa.environment === "production"
      ? "https://api.safaricom.co.ke/mpesa/stkpush/v1/query"
      : "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/query";

    const timestamp = new Date().toFormat("YYYYMMDDhhmmss");
    const password = Buffer.from(
      `${config.mpesa.shortCode}${config.mpesa.passkey}${timestamp}`
    ).toString("base64");

    const queryData = {
      BusinessShortCode: config.mpesa.shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestID
    };

    const response = await axios.post(url, queryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (response.data.ResultCode === 0) {
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Verify error:", error);
    next(error);
  }
};

const webHookVerification = async (req, res, next) => {
  try {
    console.log("📥 M-Pesa Webhook received:", req.body);
    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    next(error);
  }
};

Date.prototype.toFormat = function() {
  const Y = this.getFullYear();
  const M = String(this.getMonth() + 1).padStart(2, "0");
  const D = String(this.getDate()).padStart(2, "0");
  const h = String(this.getHours()).padStart(2, "0");
  const m = String(this.getMinutes()).padStart(2, "0");
  const s = String(this.getSeconds()).padStart(2, "0");
  return `${Y}${M}${D}${h}${m}${s}`;
};

module.exports = { createOrder, verifyPayment, stkCallback, webHookVerification };