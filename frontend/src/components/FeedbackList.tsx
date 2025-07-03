//FeedbackList
import React, { useState, useEffect } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import FeedbackCard from './FeedbackCard';
import FilterPanel from './FilterPanel';
import { Feedback } from '../types/feedback';
import { api } from '../services/api';

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await api.getFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch = 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || feedback.category === selectedCategory;
    const matchesSentiment = !selectedSentiment || feedback.sentiment === selectedSentiment;
    
    return matchesSearch && matchesCategory && matchesSentiment;
  });

  const categories = [...new Set(feedbacks.map(f => f.category))];
  const urgentFeedbacks = filteredFeedbacks.filter(f => f.sentiment === 'negative');

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSentiment('');
    setSearchTerm('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Feedback List</h2>
          <p className="text-gray-600">
            {filteredFeedbacks.length} of {feedbacks.length} feedback items
            {urgentFeedbacks.length > 0 && (
              <span className="ml-2 text-red-600 font-medium">
                ({urgentFeedbacks.length} urgent)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchFeedbacks}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        selectedCategory={selectedCategory}
        selectedSentiment={selectedSentiment}
        onCategoryChange={setSelectedCategory}
        onSentimentChange={setSelectedSentiment}
        categories={categories}
        onClearFilters={clearFilters}
      />

      {/* Feedback Cards */}
      {filteredFeedbacks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No feedback items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFeedbacks.map((feedback) => (
            <FeedbackCard key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackList;