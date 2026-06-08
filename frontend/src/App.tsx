import React, { useState } from 'react'
import client from './api/client'
import Sidebar from './components/Sidebar'
import ArticleList from './components/ArticleList'
import ArticleView from './components/ArticleView'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [selectedFeedId, setSelectedFeedId] = useState<number | null>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null)
  const [mobilePane, setMobilePane] = useState<'sidebar' | 'list' | 'article'>('sidebar')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      
      const response = await client.post('/auth/login', formData)
      const newToken = response.data.access_token
      localStorage.setItem('token', newToken)
      setToken(newToken)
    } catch (error) {
      alert('Login failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const handleSelectFeed = (id: number | null) => {
    setSelectedFeedId(id)
    setSelectedArticleId(null)
    setMobilePane('list')
  }

  const handleSelectArticle = (id: number) => {
    setSelectedArticleId(id)
    setMobilePane('article')
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-gray-100 px-4">
        <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">News App Login</h2>
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={username} 
            onChange={e => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-2 mb-6 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition duration-200">
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden text-gray-800 font-sans">
      <div className={`${mobilePane === 'sidebar' ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 border-r border-gray-200`}>
        <Sidebar 
          selectedFeedId={selectedFeedId} 
          onSelectFeed={handleSelectFeed} 
          onLogout={handleLogout}
        />
      </div>
      
      <div className={`${mobilePane === 'list' ? 'block' : 'hidden'} md:block w-full md:w-[350px] flex-shrink-0 border-r border-gray-200`}>
        <ArticleList 
          feedId={selectedFeedId} 
          selectedArticleId={selectedArticleId}
          onSelectArticle={handleSelectArticle}
          onBack={() => setMobilePane('sidebar')}
        />
      </div>
      
      <div className={`${mobilePane === 'article' ? 'block' : 'hidden'} md:block flex-1 w-full`}>
        <ArticleView 
          articleId={selectedArticleId}
          onBack={() => setMobilePane('list')}
        />
      </div>
    </div>
  )
}

export default App
