import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post } from '../types';
import PostCard from '../components/PostCard';
import { ArrowRight, Flame, TrendingUp, Hash } from 'lucide-react';

export default function Home() {
  const { slug } = useParams<{ slug?: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = slug ? `/api/posts?category=${slug}` : '/api/posts';
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  const featuredPost = !slug ? posts[0] : null;
  const listPosts = !slug ? posts.slice(1) : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section - Only on Home */}
      {!slug && featuredPost && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Destaque</h2>
          </div>
          <PostCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Category Header */}
      {slug && (
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-600/20 text-rose-500 mb-4">
            <Hash className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-white uppercase tracking-wider mb-2">
            {slug === 'news' ? 'Notícias' : 
             slug === 'reviews' ? 'Reviews' : 
             slug === 'manga' ? 'Mangá' : 
             slug === 'recommendations' ? 'Recomendações' : slug}
          </h1>
          <p className="text-neutral-400">Explorando o melhor do conteúdo nesta categoria</p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Posts List */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-rose-500" />
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
                {slug ? 'Posts Recentes' : 'Últimas Notícias'}
              </h2>
            </div>
            {!slug && (
              <a href="/category/news" className="text-sm text-neutral-400 hover:text-rose-500 flex items-center gap-1 transition-colors">
                Ver tudo <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>
          
          {listPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {listPosts.map((post) => (
                // @ts-ignore
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-900/30 rounded-xl border border-white/5">
              <p className="text-neutral-400">Nenhum post encontrado nesta categoria.</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          {/* Categories */}
          <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-2">
              Categorias
            </h3>
            <ul className="space-y-3">
              {[
                { name: 'Notícias', path: 'news' },
                { name: 'Reviews', path: 'reviews' },
                { name: 'Recomendações', path: 'recommendations' },
                { name: 'Mangá', path: 'manga' },
                { name: 'Curiosidades', path: 'trivia' }
              ].map((cat) => (
                <li key={cat.path}>
                  <a href={`/category/${cat.path}`} className={`flex items-center justify-between transition-colors group ${slug === cat.path ? 'text-rose-500' : 'text-neutral-400 hover:text-rose-500'}`}>
                    <span>{cat.name}</span>
                    <span className="bg-neutral-800 text-xs px-2 py-1 rounded-full group-hover:bg-rose-500/20 group-hover:text-rose-500 transition-colors">
                      {Math.floor(Math.random() * 20) + 5}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-gradient-to-br from-rose-900/20 to-neutral-900 border border-rose-500/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Otaku Weekly</h3>
            <p className="text-neutral-400 text-sm mb-6">
              As melhores notícias da semana direto na sua caixa de entrada. Sem spam, apenas anime.
            </p>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-rose-500 mb-3"
            />
            <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-lg transition-colors">
              Inscrever-se
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
