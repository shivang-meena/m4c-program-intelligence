
const Groq = require("groq-sdk");

// initialize groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * generates a grounded narrative report based strictly on factual metrics using Groq.
 * @param {Object} metrics - The factual data (utilization, completion rates, etc.)
 * @param {Boolean} isAiDisabled - Toggle flag from the frontend
 * @returns {String} The generated narrative or fallback string
 */
const generateNarrative = async (metrics, isAiDisabled = false) => {
  // 1. Mandatory Fallback Logic (When AI is disabled via UI)
  if (isAiDisabled) {
    return `[AI Disabled - Raw Facts] In ${metrics.month}, ${metrics.grantName} reached ${(metrics.pblCompletionRate * 100).toFixed(1)}% PBL completion, ${(metrics.evidenceSubmissionRate * 100).toFixed(1)}% evidence submission, and ${(metrics.attendanceRate * 100).toFixed(1)}% attendance. Status: ${metrics.riskStatus}. Milestone: ${metrics.milestoneSummary}.`;
  }

  // 2. AI Prompt Construction (Grounded Context)
  const systemPrompt = `
    You are a professional Program Reporting Assistant for Mantra4Change.
    Write a concise, 3-sentence summary report for a donor using ONLY the data below.
    DO NOT hallucinate names, numbers, or geographical data.
    
    Data:
    - Grant: ${metrics.grantName}
    - Month: ${metrics.month}
    - PBL Completion: ${(metrics.pblCompletionRate * 100).toFixed(1)}%
    - Evidence Submission: ${(metrics.evidenceSubmissionRate * 100).toFixed(1)}%
    - Attendance Rate: ${(metrics.attendanceRate * 100).toFixed(1)}%
    - Overall Risk Status: ${metrics.riskStatus}
    - Milestone Progress: ${metrics.milestoneSummary}
  `;

  try {
    // 3. Groq LLM API Call (Ultra-fast inference)
    const result = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: "Please generate the summary report based on the provided metrics." }
      ],
      max_tokens: 300,
      temperature: 0.1 // Low temperature ensures factual grounding
    });

    return result.choices[0].message.content;

  } catch (error) {
    console.error('Groq AI Generation Failed:', error.message);
    // Graceful degradation on API failure
    return `[Error Generating AI Report] Falling back to raw data: ${metrics.grantName} - Status: ${metrics.riskStatus}. PBL Completion: ${(metrics.pblCompletionRate * 100).toFixed(1)}%.`;
  }
};

module.exports = {
  generateNarrative
};