import http from '@/lib/http';

// Author interface
export interface Author {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Category interface for articles
export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parent_id: string;
  created_at: string;
  updated_at: string;
}

// Breadcrumb interface
export interface Breadcrumb {
  name: string;
  link: string;
}

// Article interface
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  image: string;
  short_description: string;
  meta_description: string;
  keywords: string[];
  tags: string[] | null;
  categories: ArticleCategory[];
  author: Author;
  reading_time_minutes: number;
  views: number;
  likes: number;
  comments: number;
  published: boolean;
  updated_at: string;
  created_at: string;
  breadcrumb: Breadcrumb[];
}

// Create article request interface
export interface CreateArticleRequest {
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  image?: string;
  short_description?: string;
  meta_description?: string;
  keywords?: string[];
  tags?: string[];
  category_ids?: string[];
  published?: boolean;
}

// Article service
export const articleService = {
  // Get all articles
  getArticles: async (): Promise<Article[]> => {
    try {
      const response = await http.get('/articles');
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },

  // Create a new article
  createArticle: async (
    articleData: CreateArticleRequest
  ): Promise<Article> => {
    try {
      const response = await http.post('/articles', articleData);
      return response.data;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  },

  // Get article by ID
  getArticleById: async (id: string): Promise<Article> => {
    try {
      const response = await http.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching article:', error);
      throw error;
    }
  },

  // Update article
  updateArticle: async (
    id: string,
    articleData: Partial<CreateArticleRequest>
  ): Promise<Article> => {
    try {
      const response = await http.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  },

  // Delete article
  deleteArticle: async (id: string): Promise<void> => {
    try {
      await http.delete(`/articles/${id}`);
    } catch (error) {
      console.error('Error deleting article:', error);
      throw error;
    }
  },
};

export default articleService;
