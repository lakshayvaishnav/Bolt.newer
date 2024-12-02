import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      navigate('/builder', { state: { prompt } });
    }
  };

  return (
    <div className="min-h-screen bg-notion-darker">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <Code2 className="w-16 h-16 text-notion-accent" />
          </div>
          <h1 className="text-4xl font-bold text-notion-text mb-4">
            Create Your Website with AI
          </h1>
          <p className="text-xl text-notion-dimmed mb-8">
            Describe your website and let AI build it for you in seconds
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 h-32 bg-notion-default text-notion-text border border-notion-border rounded-lg 
                focus:ring-2 focus:ring-notion-accent focus:border-transparent placeholder-notion-dimmed"
              placeholder="Describe your website (e.g., 'Create a modern landing page for a coffee shop with a dark theme')"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-notion-accent text-white rounded-lg font-medium 
                hover:bg-opacity-90 transition-colors"
            >
              Generate Website
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};