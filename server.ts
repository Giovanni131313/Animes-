import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('blog.db');

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS authors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    category_id INTEGER,
    author_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    rating REAL DEFAULT 0,
    views INTEGER DEFAULT 0,
    FOREIGN KEY(category_id) REFERENCES categories(id),
    FOREIGN KEY(author_id) REFERENCES authors(id)
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(post_id) REFERENCES posts(id)
  );
`);

// Seed Data if empty
const count = db.prepare('SELECT count(*) as count FROM posts').get() as { count: number };

if (count.count === 0) {
  console.log('Seeding database...');
  
  const insertCategory = db.prepare('INSERT INTO categories (name, slug) VALUES (?, ?)');
  const cats = [
    ['Notícias', 'news'],
    ['Reviews', 'reviews'],
    ['Recomendações', 'recommendations'],
    ['Mangá', 'manga'],
    ['Curiosidades', 'trivia']
  ];
  
  // Map category names to IDs for easier insertion
  const catMap: Record<string, number | bigint> = {};
  cats.forEach(c => {
    const info = insertCategory.run(c[0], c[1]);
    catMap[c[1]] = info.lastInsertRowid;
  });

  const insertAuthor = db.prepare('INSERT INTO authors (name, role, avatar) VALUES (?, ?, ?)');
  const authorId = insertAuthor.run('Otaku Chief', 'Editor Chefe', 'https://picsum.photos/seed/akira/100/100').lastInsertRowid;

  const insertPost = db.prepare(`
    INSERT INTO posts (title, slug, excerpt, content, image, category_id, author_id, rating, views, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const posts = [
    [
      'Os Melhores Animes da Temporada de Inverno 2026',
      'melhores-animes-inverno-2026',
      'Confira nossa lista completa com os destaques que você não pode perder nesta temporada fria.',
      'A temporada de inverno chegou com tudo! Tivemos grandes estreias e continuações aguardadas. O destaque vai para a nova temporada de "Cyber Samurai" e o slice-of-life "Coffee & Cats". A animação está impecável e as trilhas sonoras emocionantes. Se você gosta de ação, não perca "Mecha Horizon". Para os românticos, "Winter Love" é a pedida certa.',
      'https://picsum.photos/seed/anime1/800/400',
      catMap['recommendations'], authorId, 4.8, 1250, '2026-01-15 10:00:00'
    ],
    [
      'Novo Capítulo de One Piece Choca Fãs',
      'one-piece-novo-capitulo',
      'Oda sensei fez de novo! Revelações bombásticas sobre o Século Perdido mudam tudo.',
      'O capítulo desta semana de One Piece trouxe informações cruciais que os fãs teorizavam há anos. A conexão entre Joy Boy e o Governo Mundial ficou mais clara, mas novas perguntas surgiram. Cuidado com spoilers abaixo! A narrativa visual de Oda continua suprema, com painéis duplos de tirar o fôlego.',
      'https://picsum.photos/seed/onepiece/800/400',
      catMap['manga'], authorId, 5.0, 5430, '2026-02-20 14:30:00'
    ],
    [
      'Top 10 Animes para Iniciantes',
      'top-10-iniciantes',
      'Nunca assistiu anime? Comece por aqui! Uma lista curada para todos os gostos.',
      'Entrar no mundo dos animes pode ser intimidador. Por isso, separamos clássicos modernos que são portas de entrada perfeitas. Death Note para quem gosta de suspense, Fullmetal Alchemist: Brotherhood para aventura épica, e Haikyuu!! para quem curte esportes e superação.',
      'https://picsum.photos/seed/beginners/800/400',
      catMap['recommendations'], authorId, 4.5, 3200, '2026-02-10 09:15:00'
    ],
    [
      'Estúdio Ghibli Anuncia Novo Filme',
      'ghibli-novo-filme',
      'Miyazaki sai da aposentadoria (de novo) para um projeto misterioso.',
      'O lendário Hayao Miyazaki está trabalhando em um novo longa-metragem. Detalhes são escassos, mas rumores apontam para uma aventura de fantasia com forte mensagem ambiental, marca registrada do diretor. A expectativa é alta!',
      'https://picsum.photos/seed/ghibli/800/400',
      catMap['news'], authorId, 4.9, 8900, '2026-02-21 11:00:00'
    ],
    [
      'Review: Solo Leveling - A Adaptação',
      'review-solo-leveling',
      'A espera acabou. O anime faz jus ao manhwa lendário? Confira nossa análise.',
      'A A-1 Pictures entregou uma animação fluida e fiel ao material original. As cenas de luta de Jin-Woo são viscerais e a trilha sonora de Hiroyuki Sawano eleva a tensão. Alguns cortes na história foram necessários, mas o ritmo se mantém frenético.',
      'https://picsum.photos/seed/solo/800/400',
      catMap['reviews'], authorId, 4.7, 4100, '2026-01-20 16:45:00'
    ]
  ];

  posts.forEach(p => insertPost.run(...p));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/posts', (req, res) => {
    const { category } = req.query;
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, a.name as author_name, a.avatar as author_avatar 
      FROM posts p 
      JOIN categories c ON p.category_id = c.id 
      JOIN authors a ON p.author_id = a.id
    `;
    
    if (category) {
      const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(category) as { id: number } | undefined;
      if (!cat) return res.json([]);
      
      query += ` WHERE p.category_id = ?`;
      const posts = db.prepare(query + ' ORDER BY p.created_at DESC').all(cat.id);
      return res.json(posts);
    }
    
    const posts = db.prepare(query + ' ORDER BY p.created_at DESC').all();
    res.json(posts);
  });

  app.get('/api/posts/:slug', (req, res) => {
    const post = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, a.name as author_name, a.avatar as author_avatar 
      FROM posts p 
      JOIN categories c ON p.category_id = c.id 
      JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ?
    `).get(req.params.slug);
    
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  });

  app.get('/api/categories', (req, res) => {
    const categories = db.prepare('SELECT * FROM categories').all();
    res.json(categories);
  });

  app.get('/api/comments/:postId', (req, res) => {
    const comments = db.prepare('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC').all(req.params.postId);
    res.json(comments);
  });

  try {
    db.exec('ALTER TABLE comments ADD COLUMN rating INTEGER DEFAULT 0');
  } catch (e) {
    // Column likely exists
  }

  app.post('/api/comments', (req, res) => {
    const { postId, userName, content, rating } = req.body;
    if (!postId || !userName || !content) {
      return res.status(400).json({ error: 'Missing fields' });
    }
    
    const stmt = db.prepare('INSERT INTO comments (post_id, user_name, content, rating) VALUES (?, ?, ?, ?)');
    const info = stmt.run(postId, userName, content, rating || 0);
    
    // Update post average rating
    if (rating > 0) {
      const avg = db.prepare('SELECT AVG(rating) as avg FROM comments WHERE post_id = ? AND rating > 0').get(postId) as { avg: number };
      db.prepare('UPDATE posts SET rating = ? WHERE id = ?').run(avg.avg, postId);
    }

    res.json({ id: info.lastInsertRowid, post_id: postId, user_name: userName, content, rating, created_at: new Date().toISOString() });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
