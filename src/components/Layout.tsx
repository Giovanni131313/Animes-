import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Search, User, Twitter, Instagram, Youtube, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Notícias', path: '/category/news' },
    { name: 'Reviews', path: '/category/reviews' },
    { name: 'Mangá', path: '/category/manga' },
    { name: 'Recomendações', path: '/category/recommendations' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <span className="font-bold text-white text-xl">A</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">AniPulse</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors hover:text-rose-500 ${
                    location.pathname === item.path ? 'text-rose-500' : 'text-neutral-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                <User className="w-5 h-5" />
              </button>
              <button className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-white/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white text-xl">A</span>
                </div>
                <span className="font-display font-bold text-xl tracking-tight">AniPulse</span>
              </Link>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Sua fonte definitiva para notícias de anime, mangá e cultura japonesa. Análises profundas, notícias de última hora e recomendações curadas.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-neutral-400 hover:text-rose-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-rose-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-rose-500 transition-colors"><Youtube className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-rose-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-6">Categorias</h3>
              <ul className="space-y-3">
                {navItems.slice(1).map((item) => (
                  <li key={item.path}>
                    <Link to={item.path} className="text-neutral-400 hover:text-rose-500 text-sm transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-neutral-400 hover:text-rose-500 text-sm transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-rose-500 text-sm transition-colors">Contato</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-rose-500 text-sm transition-colors">Privacidade</a></li>
                <li><a href="#" className="text-neutral-400 hover:text-rose-500 text-sm transition-colors">Termos</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">Newsletter</h3>
              <p className="text-neutral-400 text-sm mb-4">Receba as últimas notícias diretamente no seu email.</p>
              <form className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="bg-neutral-800 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-rose-500 w-full"
                />
                <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Assinar
                </button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-neutral-500 text-sm">© 2026 AniPulse. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
