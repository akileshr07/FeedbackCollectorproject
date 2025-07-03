const API_BASE_URL = 'https://feedbackcollectorproject.onrender.com';

export const api = {
  async submitFeedback(feedback: {
    name: string;
    product: string;
    feedback: string;
    category: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true", // ✅ bypass ngrok warning
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new Error("Failed to submit feedback");
    }

    return response.json();
  },

  async getFeedback() {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      headers: {
        "ngrok-skip-browser-warning": "true", // ✅ bypass ngrok warning
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch feedback");
    }

    return response.json();
  },

  async getStats() {
    const url = `${API_BASE_URL}/stats`;
    // console.log("📡 Fetching from:", url);

    const response = await fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true", // ✅ bypass ngrok warning
      },
    });

    const text = await response.text();
    // console.log("📦 Raw response:", text);

    if (!response.ok) throw new Error("Failed to fetch stats");

    return JSON.parse(text);
  },
};
