export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  author_id: number;
  author_name: string;
  author_avatar: string;
  created_at: string;
  rating: number;
  views: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Comment {
  id: number;
  post_id: number;
  user_name: string;
  content: string;
  created_at: string;
  rating?: number;
}
