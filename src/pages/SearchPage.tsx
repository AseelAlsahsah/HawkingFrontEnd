// src/pages/SearchPage.tsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchItems } from '../services/api';
import type { ItemSearchResponse } from '../services/api';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<ItemSearchResponse>({ content: [], page: { size: 0, number: 0, totalElements: 0, totalPages: 0 } });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
        searchItems(0);  
    } else {
        setResults({ content: [], page: { size: 0, number: 0, totalElements: 0, totalPages: 0 } });
    }
  }, [query]);

  const searchItems = async (page = 0) => {
    setLoading(true);
    try {
      const data = await fetchItems({
        name: query,
        page,
        size: 20
      });
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!query) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gold-50 to-amber-50">
        <Navbar />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center p-12 max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
            <p className="text-lg text-gray-600">Enter a search term to get started.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gold-50 to-amber-50">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Results</h1>
            <p className="text-xl text-gray-600">
              Showing {results.page.totalElements} results for <span className="font-semibold text-gold-600">"{query}"</span>
            </p>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg p-6 h-80" />
              ))}
            </div>
          ) : results.content.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No results found</h2>
              <p className="text-lg text-gray-600 mb-8">Try different keywords like "ring", "necklace", or "18K"</p>
              <a href="/collections" className="inline-flex px-8 py-4 bg-gold-600 text-white font-semibold rounded-xl hover:bg-gold-700">
                Browse Collections
              </a>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {results.content.map((item) => (
                  <ProductCard key={item.code} item={item} />
                ))}
              </div>
              
              {results.page.totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  {Array.from({ length: results.page.totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => searchItems(i)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        results.page.number === i
                          ? 'bg-gold-600 text-white'
                          : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
