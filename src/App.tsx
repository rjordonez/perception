import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Moon, Sun } from 'lucide-react';
import { ResearchList } from './components/ResearchList';
import { ResearchDetail } from './components/ResearchDetail';
import { SearchAnimation } from './components/SearchAnimation';
import type { ResearchPoint } from './types';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ResearchPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<ResearchPoint | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSearching(true);
    setResults([]);

    // Simulate API call
    setTimeout(() => {
      setResults([
        {
          id: '1',
          topic: 'Impact of Social Media on Mental Health',
          supportingPapers: [
            {
              id: 's1',
              title: 'Social Media Usage and Depression',
              authors: ['Smith, J.', 'Johnson, M.'],
              year: 2023,
              abstract: 'Study shows correlation between social media use and increased depression rates.',
              accuracy: 0.89,
              perspective: 'Clinical Psychology',
              url: 'https://example.com/paper1'
            }
          ],
          opposingPapers: [
            {
              id: 'o1',
              title: 'Benefits of Online Social Connection',
              authors: ['Brown, R.', 'Davis, K.'],
              year: 2023,
              abstract: 'Research indicates positive effects of social media on community building.',
              accuracy: 0.85,
              perspective: 'Social Psychology',
              url: 'https://example.com/paper2'
            }
          ]
        }
      ]);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'dark bg-[#111]' : 'bg-background'}`}>
      <button
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 p-3 rounded-full bg-white dark:bg-[#222] 
                   shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-secondary" />
        ) : (
          <Moon className="w-5 h-5 text-primary" />
        )}
      </button>

      <div className="container mx-auto px-4 py-20">
        {!selectedPoint ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-poppins text-6xl font-bold text-center mb-6 text-primary dark:text-white">
              Research Paper
              <span className="block text-secondary mt-2">Cross-Reference</span>
            </h1>

            <p className="text-center text-lg mb-12 text-primary/80 dark:text-white/80">
              Enter your research topic to discover different perspectives and their accuracy
            </p>

            <form onSubmit={handleSearch} className="mb-16">
              <div className="relative">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your research topic..."
                  className="w-full px-6 py-4 rounded-xl border-2 border-secondary/20 
                           focus:border-secondary search-input-shadow
                           text-lg bg-white dark:bg-[#222] dark:border-secondary/10
                           dark:text-white transition-all duration-200"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 
                           bg-secondary hover:bg-accent text-white px-6 py-2.5
                           rounded-lg transition-colors duration-200 flex items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  <span>Search</span>
                </button>
              </div>
            </form>

            {isSearching ? (
              <SearchAnimation />
            ) : (
              results.length > 0 && (
                <ResearchList
                  points={results}
                  onPointClick={(point) => setSelectedPoint(point)}
                />
              )
            )}
          </motion.div>
        ) : (
          <ResearchDetail
            point={selectedPoint}
            onBack={() => setSelectedPoint(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;