import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Post, Comment } from '../types';
import { Calendar, Clock, User, MessageSquare, Share2, ThumbsUp, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
        return fetch(`/api/comments/${data.id}`);
      })
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error(err));
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newComment || !userName) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId: post.id, userName, content: newComment, rating }),
    });

    if (res.ok) {
      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment('');
      setUserName('');
      setRating(0);
      // Update post rating locally if needed, but for now just comments
    }
  };

  if (loading) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Carregando...</div>;
  if (!post) return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Post não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-12 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="px-3 py-1 bg-rose-600/20 text-rose-400 text-xs font-bold uppercase tracking-wider rounded-full border border-rose-500/20">
            {post.category_name}
          </span>
          <span className="text-neutral-500 text-sm flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(post.created_at), "d 'de' MMMM, yyyy", { locale: ptBR })}
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-neutral-400 text-sm border-y border-white/5 py-6">
          <div className="flex items-center gap-2">
            <img src={post.author_avatar} alt={post.author_name} className="w-10 h-10 rounded-full border border-white/10" />
            <div className="text-left">
              <p className="text-white font-medium">{post.author_name}</p>
              <p className="text-xs">Autor</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>5 min de leitura</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <span>{comments.length} Comentários</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl border border-white/5">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="prose prose-invert prose-lg max-w-none mb-16">
        <p className="lead text-xl text-neutral-300 mb-8 font-serif italic border-l-4 border-rose-500 pl-6">
          {post.excerpt}
        </p>
        <div className="text-neutral-300 space-y-6 leading-relaxed">
          {post.content.split('\n').map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </article>

      {/* Share & Tags */}
      <div className="flex items-center justify-between border-t border-b border-white/10 py-8 mb-16">
        <div className="flex gap-2">
          {['Anime', 'Japão', 'Cultura'].map(tag => (
            <span key={tag} className="text-xs text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-white/5 hover:border-rose-500/30 transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">Compartilhar</span>
        </button>
      </div>

      {/* Comments Section */}
      <section className="bg-neutral-900/30 border border-white/5 rounded-2xl p-8 mb-16">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-rose-500" />
          Comentários ({comments.length})
        </h3>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-12 bg-neutral-900 p-6 rounded-xl border border-white/5">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Nome</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-rose-500 transition-colors"
              placeholder="Seu nome"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Comentário</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors h-32 resize-none"
              placeholder="O que você achou?"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-400 mb-2">Sua Avaliação</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Publicar Comentário
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 font-bold border border-white/5">
                {comment.user_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-white">{comment.user_name}</h4>
                  {comment.rating && comment.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs text-yellow-500">{comment.rating}</span>
                    </div>
                  )}
                  <span className="text-xs text-neutral-500">
                    {format(new Date(comment.created_at), "d MMM, HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed bg-neutral-900/50 p-4 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 mt-2 ml-2">
                  <button className="text-xs text-neutral-500 hover:text-rose-500 flex items-center gap-1 transition-colors">
                    <ThumbsUp className="w-3 h-3" /> Curtir
                  </button>
                  <button className="text-xs text-neutral-500 hover:text-white transition-colors">
                    Responder
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
