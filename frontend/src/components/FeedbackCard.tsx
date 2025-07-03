//FeedbackCard
import React from 'react';
import { User, Package, MessageSquare, Tag, AlertTriangle } from 'lucide-react';
import { Feedback } from '../types/feedback';

interface FeedbackCardProps {
  feedback: Feedback;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    if (sentiment === 'negative') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all hover:shadow-md ${
      feedback.sentiment === 'negative' ? 'border-red-200 shadow-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{feedback.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Package className="h-3 w-3" />
              <span>{feedback.product}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSentimentColor(feedback.sentiment)}`}>
            {getSentimentIcon(feedback.sentiment)}
            <span className="ml-1">{feedback.sentiment}</span>
          </span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <MessageSquare className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Feedback</span>
        </div>
        <p className="text-gray-600 leading-relaxed">{feedback.feedback}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4 text-gray-400" />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          {feedback.category}
        </span>
      </div>
    </div>
  );
};

export default FeedbackCard;