import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FeedbackList from './components/FeedbackList';
import FeedbackForm from './components/FeedbackForm';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedbackSubmit = () => {
    // Trigger refresh of dashboard and feedback list
    setRefreshKey(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={`dashboard-${refreshKey}`} />;
      case 'feedback':
        return <FeedbackList key={`feedback-${refreshKey}`} />;
      case 'submit':
        return <FeedbackForm onSubmitSuccess={handleFeedbackSubmit} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;