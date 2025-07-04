import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: string;
  selectedSentiment: string;
  onCategoryChange: (category: string) => void;
  onSentimentChange: (sentiment: string) => void;
  categories: string[];
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedCategory,
  selectedSentiment,
  onCategoryChange,
  onSentimentChange,
  categories,
  onClearFilters,
}) => {
  const sentiments = ['positive', 'negative', 'neutral'];
  const hasActiveFilters = selectedCategory || selectedSentiment;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-3 w-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sentiment
          </label>
          <select
            value={selectedSentiment}
            onChange={(e) => onSentimentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          >
            <option value="">All Sentiments</option>
            {sentiments.map((sentiment) => (
              <option key={sentiment} value={sentiment}>
                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;