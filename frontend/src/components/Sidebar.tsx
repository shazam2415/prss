import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Rss, LogOut, Plus, Trash2 } from 'lucide-react';

interface Feed {
  id: number;
  title: string;
  url: string;
}

interface SidebarProps {
  selectedFeedId: number | null;
  onSelectFeed: (id: number | null) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedFeedId, onSelectFeed, onLogout }) => {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedTitle, setNewFeedTitle] = useState('');

  const fetchFeeds = async () => {
    try {
      const response = await client.get('/feeds/');
      setFeeds(response.data);
    } catch (error) {
      console.error('Failed to fetch feeds');
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await client.post('/feeds/', { title: newFeedTitle, url: newFeedUrl });
      setNewFeedUrl('');
      setNewFeedTitle('');
      setShowAddFeed(false);
      fetchFeeds();
    } catch (error) {
      alert('Failed to add feed');
    }
  };

  const handleDeleteFeed = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this feed?')) return;
    try {
      await client.delete(`/feeds/${id}`);
      if (selectedFeedId === id) {
        onSelectFeed(null);
      }
      fetchFeeds();
    } catch (error) {
      alert('Failed to delete feed');
    }
  };

  return (
    <div className="w-full bg-gray-50 overflow-y-auto flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 font-bold bg-white sticky top-0 z-10">
        Feeds
      </div>
      
      <div 
        className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors ${selectedFeedId === null ? 'bg-gray-300 font-bold' : ''}`}
        onClick={() => onSelectFeed(null)}
      >
        <span>All Articles</span>
      </div>

      {feeds.map(feed => (
        <div 
          key={feed.id}
          className={`p-3 cursor-pointer flex items-center justify-between hover:bg-gray-200 transition-colors group ${selectedFeedId === feed.id ? 'bg-gray-300 font-bold' : ''}`}
          onClick={() => onSelectFeed(feed.id)}
        >
          <div className="flex items-center gap-2 truncate">
            <Rss size={16} className="shrink-0" />
            <span className="text-sm truncate">{feed.title}</span>
          </div>
          <button 
            onClick={(e) => handleDeleteFeed(e, feed.id)}
            className="opacity-100 md:opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-600 transition-opacity"
            title="Delete Feed"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}

      <div className="mt-auto border-t border-gray-200 bg-white">
        <div 
          className="p-3 cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition-colors" 
          onClick={() => setShowAddFeed(!showAddFeed)}
        >
          <Plus size={16} />
          <span>Add Feed</span>
        </div>
        <div 
          className="p-3 cursor-pointer flex items-center gap-2 hover:bg-gray-100 transition-colors text-red-600" 
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </div>
      </div>

      {showAddFeed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleAddFeed} className="flex flex-col gap-2">
            <input 
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="Title" 
              value={newFeedTitle}
              onChange={e => setNewFeedTitle(e.target.value)}
            />
            <input 
              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
              placeholder="URL" 
              value={newFeedUrl}
              onChange={e => setNewFeedUrl(e.target.value)}
            />
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded text-sm hover:bg-blue-700 transition">
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
