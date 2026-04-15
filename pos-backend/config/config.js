require("dotenv").config();

const config = Object.freeze({
    port: process.env.PORT || 3000,
    databaseURI: process.env.MONGODB_URI || "mongodb://localhost:27017/pos-db",
    nodeEnv : process.env.NODE_ENV || "development",
    accessTokenSecret: process.env.JWT_SECRET,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    razorpaySecretKey: process.env.RAZORPAY_KEY_SECRET,
    razorpyWebhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    mpesa: {
        consumerKey: process.env.MPESA_CONSUMER_KEY,
        consumerSecret: process.env.MPESA_CONSUMER_SECRET,
        shortCode: process.env.MPESA_SHORT_CODE,
        passkey: process.env.MPESA_PASSKEY,
        callbackUrl: process.env.MPESA_CALLBACK_URL,
        environment: process.env.MPESA_ENV || "production"
    }
});

module.exports = config;
