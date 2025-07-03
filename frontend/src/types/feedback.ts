export interface Feedback {
  id: number;
  name: string;
  product: string;
  feedback: string;
  category: string;
  sentiment: string;
}

export interface FeedbackStats {
  total: number;
  by_category: Record<string, number>;
  by_sentiment: Record<string, number>;
}

export interface FeedbackSubmission {
  name: string;
  product: string;
  feedback: string;
  category: string;
}