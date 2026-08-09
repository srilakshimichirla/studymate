// config/gemini.js
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = 'gemini-3.5-flash-lite';

const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 1,
  topP: 0.8,
  maxOutputTokens: 2048,
};

module.exports = { ai, MODEL_NAME, GENERATION_CONFIG };