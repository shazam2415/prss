import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ChevronLeft } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  published_at: string;
  is_read: boolean;
}

interface ArticleListProps {
  feedId: number | null;
  selectedArticleId: number | null;
  onSelectArticle: (id: number) => void;
  onBack?: () => void;
}

const ArticleList: React.FC<ArticleListProps> = ({ feedId, selectedArticleId, onSelectArticle, onBack }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = feedId ? { feed_id: feedId } : {};
        const response = await client.get('/articles/', { params });
        setArticles(response.data);
      } catch (error) {
        console.error('Failed to fetch articles');
      }
    };
    fetchArticles();
  }, [feedId]);

  const handleSelect = async (id: number) => {
    onSelectArticle(id);
    try {
      await client.patch(`/articles/${id}/read?is_read=true`);
      setArticles(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (error) {
      console.error('Failed to mark as read');
    }
  };

  return (
    <div className="w-full bg-white overflow-y-auto h-full">
      <div className="p-4 border-b border-gray-200 font-bold bg-white sticky top-0 z-10 shadow-sm flex items-center">
        {onBack && (
          <button className="md:hidden mr-3 p-1 hover:bg-gray-100 rounded" onClick={onBack}>
            <ChevronLeft size={20} />
          </button>
        )}
        Articles
      </div>
      <div className="divide-y divide-gray-100">
        {articles.map(article => (
          <div 
            key={article.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 
              ${selectedArticleId === article.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'} 
              ${!article.is_read ? 'font-semibold' : 'text-gray-600'}`}
            onClick={() => handleSelect(article.id)}
          >
            <span className="block mb-1 line-clamp-2 leading-snug text-sm md:text-base">{article.title}</span>
            <span className="text-xs text-gray-500">{new Date(article.published_at).toLocaleDateString()}</span>
          </div>
        ))}
        {articles.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No articles found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleList;
