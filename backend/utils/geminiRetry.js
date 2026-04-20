const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error) => {
  const status = error?.status ?? error?.response?.status;
  const message = String(error?.message || '').toLowerCase();

  return status === 503 || message.includes('503') || message.includes('service unavailable');
};

const callGeminiWithRetry = async (model, prompt, maxRetries = 3) => {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      return await model.generateContent(prompt);
    } catch (error) {
      lastError = error;

      if (!isRetryableGeminiError(error) || attempt === maxRetries) {
        throw error;
      }

      const waitTime = 1500 * (2 ** attempt);
      console.warn(`Gemini 503 detected. Retrying in ${waitTime}ms (attempt ${attempt + 1}/${maxRetries})`);
      await delay(waitTime);
    }
  }

  throw lastError;
};

module.exports = { callGeminiWithRetry };