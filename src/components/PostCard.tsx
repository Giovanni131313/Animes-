import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps): React.ReactElement {
  if (featured) {
    return (
      <Link to={`/post/${post.slug}`} className="group relative block h-[500px] rounded-2xl overflow-hidden shadow-2xl">
        <img 
          src={post.image} 
          alt={post.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full md:w-2/3">
          <span className="inline-block px-3 py-1 bg-rose-600 text-white text-xs font-bold uppercase tracking-wider rounded-full mb-4">
            {post.category_name}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight group-hover:text-rose-400 transition-colors">
            {post.title}
          </h2>
          <p className="text-neutral-300 mb-6 line-clamp-2 text-lg">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <div className="flex items-center gap-2">
              <img src={post.author_avatar} alt={post.author_name} className="w-8 h-8 rounded-full border border-white/20" />
              <span className="text-white font-medium">{post.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{post.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/post/${post.slug}`} className="group flex flex-col h-full bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden hover:border-rose-500/30 transition-colors">
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded">
            {post.category_name}
          </span>
        </div>
      </div>
      <div className="flex flex-col flex-grow p-5">
        <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-rose-500 transition-colors">
          {post.title}
        </h3>
        <p className="text-neutral-400 text-sm mb-4 line-clamp-2 flex-grow">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between text-xs text-neutral-500 mt-auto pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-neutral-300">{post.author_name}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{format(new Date(post.created_at), "d MMM", { locale: ptBR })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
