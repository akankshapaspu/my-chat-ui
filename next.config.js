// next.config.js
module.exports = {
  reactStrictMode: true,
  env: {
    // optionally expose to the client:
    NEXT_PUBLIC_HF_INFERENCE_URL: process.env.HF_INFERENCE_URL,
  },
};
