// Load faker from CDN
(async () => {
  if (!window.faker) {
    await new Promise(resolve => {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js";
      script.onload = resolve;
      document.head.appendChild(script);
    });
  }

  const endpoint = "https://feedbackcollectorproject.onrender.com/feedback";

  const categories = [
    "General Feedback", "Usability", "Performance", "Feature Request", "Bug Report", "Other"
  ];

  const products = [
    "Course App", "Mobile App", "Billing System", "Support Chat", "Analytics Tool",
    "Payment Gateway", "Feedback System", "Dashboard", "Notification System", "Reports Module",
    "Search Feature", "Task Manager", "Settings Panel", "Auth Module"
  ];

  const positiveWords = [
    "good", "great", "love", "excellent", "awesome", "nice", "fantastic", "superb", "amazing",
    "improved", "satisfied", "helpful", "smooth", "fast", "positive", "brilliant", "wonderful",
    "perfect", "liked", "appreciate", "convenient", "happy", "clean"
  ];
  const negativeWords = [
    "bad", "poor", "hate", "bug", "issue", "problem", "slow", "difficult", "error", "delay",
    "crash", "negative", "worst", "disappointed", "fail", "unsatisfied", "confusing", "messy",
    "unusable", "lag", "unhelpful", "annoying", "broken"
  ];
  const positivePhrases = ["well done", "very helpful", "super easy", "great job", "user friendly"];
  const negativePhrases = ["not working", "very slow", "worst experience", "crashes often", "not helpful"];
  const neutralPhrases = [
    "Works okay for now", "Nothing too exciting", "Could use more options", "Seems average",
    "It's fine, nothing special", "Just okay", "Might be improved in future updates", "Neutral experience"
  ];

  const getRandom = arr => arr[Math.floor(Math.random() * arr.length)];

  function generateFeedback(index) {
    const name = faker.name.firstName();
    const product = getRandom(products);
    const category = getRandom(categories);
    const sentimentChance = Math.random();

    let feedback;

    if (sentimentChance < 0.33) {
      // Positive
      feedback = `I really ${getRandom(["like", "appreciate", "enjoy", "love"])} using ${product}. It's ${getRandom(positiveWords)} and ${getRandom(positivePhrases)}.`;
    } else if (sentimentChance < 0.66) {
      // Negative
      feedback = `I'm facing a ${getRandom(negativeWords)} in ${product}. It's ${getRandom(negativePhrases)} and very ${getRandom(negativeWords)} to use.`;
    } else {
      // Neutral
      feedback = `${getRandom(neutralPhrases)} with the ${product}. Could be better, but not terrible either.`;
    }

    return {
      name,
      product,
      category,
      feedback,
    };
  }

  // Submit 30 feedbacks
  for (let i = 0; i < 30; i++) {
    const feedback = generateFeedback(i);

    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(feedback),
    })
    .then(res => res.json())
    .then(result => console.log(`✅ Submitted ${i + 1}:`, result))
    .catch(err => console.error(`❌ Failed ${i + 1}:`, err));
  }
})();
