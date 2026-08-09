// services/geminiService.js
const { ai, MODEL_NAME, GENERATION_CONFIG } = require('../config/gemini');

const generateNotes = async (topic, difficulty) => {
  try {
    const prompt = `
      You are an expert educator. Create comprehensive study notes about "${topic}" 
      for a ${difficulty} level student.
      
      Format your response as follows:
      
      # 📚 ${topic} - Study Notes
      
      ## 🎯 Key Concepts
      [Explain main concepts in simple terms]
      
      ## 📝 Detailed Explanation
      [Provide clear, comprehensive explanation]
      
      ## 💡 Important Definitions
      [List key terms with definitions]
      
      ## 🌟 Real-World Examples
      [Provide practical examples]
      
      ## 📊 Summary
      [Bullet point summary of key takeaways]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: GENERATION_CONFIG,
    });

    return response.text;
  } catch (error) {
    console.error('Gemini Error:', error);
    throw new Error('Failed to generate notes');
  }
};

const generateQuiz = async (topic, difficulty, numQuestions = 5) => {
  try {
    const prompt = `
      Create a ${numQuestions}-question multiple-choice quiz about "${topic}" 
      for a ${difficulty} level student.
      
      Format as JSON array:
      [
        {
          "question": "Question text",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "correctAnswer": "A) Option 1",
          "explanation": "Explanation"
        }
      ]
      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: GENERATION_CONFIG,
    });

    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid quiz format');
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Gemini Error:', error);
    throw new Error('Failed to generate quiz');
  }
};

const generateFeedback = async (topic, score, totalQuestions, weakAreas) => {
  try {
    const prompt = `
      Student scored ${score}/${totalQuestions} on "${topic}".
      Weak areas: ${weakAreas.join(', ')}.
      Provide encouraging feedback and study tips.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: GENERATION_CONFIG,
    });

    return response.text;
  } catch (error) {
    return "Keep practicing! Review the topics you found challenging.";
  }
};

module.exports = {
  generateNotes,
  generateQuiz,
  generateFeedback,
};