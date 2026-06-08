import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { ChevronLeft } from 'lucide-react';

interface ArticleDetail {
  id: number;
  title: string;
  link: string;
  content: string;
  description: string;
  author: string;
  published_at: string;
}

interface ArticleViewProps {
  articleId: number | null;
  onBack?: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ articleId, onBack }) => {
  const [article, setArticle] = useState<ArticleDetail | null>(null);

  useEffect(() => {
    if (!articleId) {
      setArticle(null);
      return;
    }

    const fetchArticleDetail = async () => {
      try {
        const response = await client.get(`/articles/`);
        const found = response.data.find((a: any) => a.id === articleId);
        setArticle(found);
      } catch (error) {
        console.error('Failed to fetch article detail');
      }
    };
    fetchArticleDetail();
  }, [articleId]);

  if (!article) {
    return (
      <div className="h-full bg-white overflow-y-auto p-4 md:p-10 flex justify-center items-center text-gray-400">
        Select an article to read
      </div>
    );
  }

  return (
    <div className="h-full bg-white overflow-y-auto p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        {onBack && (
          <button className="md:hidden mb-6 flex items-center text-blue-600 text-sm hover:underline" onClick={onBack}>
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>
        )}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight text-gray-900">{article.title}</h1>
        <div className="text-xs md:text-sm text-gray-500 mb-8 pb-4 border-b border-gray-100 flex flex-wrap items-center gap-2">
          {article.author && <span className="font-medium text-gray-700">{article.author}</span>}
          {article.author && <span className="hidden md:inline">•</span>}
          <span>{new Date(article.published_at).toLocaleString()}</span>
          <span>•</span>
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View Original
          </a>
        </div>
        <div 
          className="prose max-w-none text-gray-800 leading-relaxed 
            prose-sm md:prose-base
            prose-img:rounded-lg prose-img:mx-auto prose-img:shadow-sm
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-headings:text-gray-900 prose-headings:font-bold"
          dangerouslySetInnerHTML={{ __html: article.content || article.description }} 
        />
      </div>
    </div>
  );
};

export default ArticleView;
