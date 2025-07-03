import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  // TrendingUp,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Activity,
} from "lucide-react";
import StatisticsCard from "./StatisticsCard";
import { FeedbackStats } from "../types/feedback";
import { api } from "../services/api";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      // console.log("✅ Stats fetched:", data);
      setStats(data);
    } catch (error) {
      // console.error("❌ Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600">Get insights into your feedback data</p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Feedback"
          value={stats.total}
          icon={MessageSquare}
          color="blue"
        />
        <StatisticsCard
          title="Positive Feedback"
          value={stats.by_sentiment.positive || 0}
          icon={ThumbsUp}
          color="green"
        />
        <StatisticsCard
          title="Negative Feedback"
          value={stats.by_sentiment.negative || 0}
          icon={ThumbsDown}
          color="red"
        />
        <StatisticsCard
          title="Neutral Feedback"
          value={stats.by_sentiment.neutral || 0}
          icon={Activity}
          color="gray"
        />
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Feedback by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.by_category).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sentiment Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(stats.by_sentiment).map(([sentiment, count]) => {
              const percentage = (count / stats.total) * 100;
              const colors = {
                positive: "bg-green-500",
                negative: "bg-red-500",
                neutral: "bg-gray-500",
              };

              return (
                <div key={sentiment} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {sentiment}
                    </span>
                    <span className="text-sm text-gray-500">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        colors[sentiment as keyof typeof colors]
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Urgent Attention Alert */}
      {stats.by_sentiment.negative > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-900">
                Urgent Attention Required
              </h3>
              <p className="text-red-700">
                You have {stats.by_sentiment.negative} negative feedback item
                {stats.by_sentiment.negative > 1 ? "s" : ""} that may need
                immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
