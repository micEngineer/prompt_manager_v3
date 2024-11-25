import React, { useState, useMemo } from 'react';
import { PenSquare, Plus } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { CategoryList } from './components/CategoryList';
import { PromptCard } from './components/PromptCard';
import { CreatePromptModal } from './components/CreatePromptModal';
import type { Prompt, Category } from './types';

const sampleCategories: Category[] = [
  { id: '1', name: 'ビジネス', color: '#FF6B6B' },
  { id: '2', name: 'クリエイティブ', color: '#4ECDC4' },
  { id: '3', name: '技術', color: '#45B7D1' },
];

const samplePrompts: Prompt[] = [
  {
    id: '1',
    title: 'ブログ記事作成プロンプト',
    content: 'あなたは優秀なブログライターです。以下のトピックについて、SEOを意識した魅力的な記事を作成してください。',
    category: '1',
    tags: ['ブログ', 'SEO', 'コンテンツ作成'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'コードレビュープロンプト',
    content: '経験豊富なシニアエンジニアとして、以下のコードをレビューし、ベストプラクティスに基づいた改善案を提示してください。',
    category: '3',
    tags: ['プログラミング', 'コードレビュー', '技術'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>(samplePrompts);
  const [categories, setCategories] = useState<Category[]>(sampleCategories);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory ? prompt.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, prompts]);

  const handleCreatePrompt = (newPrompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    const prompt: Prompt = {
      ...newPrompt,
      id: (prompts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPrompts([...prompts, prompt]);
    setIsCreateModalOpen(false);
  };

  const handleUpdatePrompt = (updatedPrompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingPrompt) return;
    
    const updated: Prompt = {
      ...updatedPrompt,
      id: editingPrompt.id,
      createdAt: editingPrompt.createdAt,
      updatedAt: new Date(),
    };

    setPrompts(prompts.map(p => p.id === editingPrompt.id ? updated : p));
    setEditingPrompt(null);
  };

  const handleDeletePrompt = (id: string) => {
    if (window.confirm('このプロンプトを削除してもよろしいですか？')) {
      setPrompts(prompts.filter(p => p.id !== id));
    }
  };

  const handleCreateCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: (categories.length + 1).toString(),
      name,
      color,
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Prompt Manager</h1>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PenSquare className="h-5 w-5 mr-2" />
              新規作成
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-3">
            <CategoryList
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onCreateCategory={handleCreateCategory}
            />
          </div>
          
          <div className="col-span-9">
            <div className="mb-6">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard 
                  key={prompt.id} 
                  prompt={prompt}
                  onEdit={() => setEditingPrompt(prompt)}
                  onDelete={() => handleDeletePrompt(prompt.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <CreatePromptModal
        isOpen={isCreateModalOpen || editingPrompt !== null}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingPrompt(null);
        }}
        onSubmit={editingPrompt ? handleUpdatePrompt : handleCreatePrompt}
        categories={categories}
        initialPrompt={editingPrompt}
      />
    </div>
  );
}

export default App;