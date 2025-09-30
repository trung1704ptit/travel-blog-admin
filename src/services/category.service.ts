import http from '@/lib/http';

// Category interface
export interface Category {
  id?: number;
  name: string;
  slug: string;
  image: string;
  parent_id?: number;
  children?: Category[];
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Create category request interface
export interface CreateCategoryRequest {
  name: string;
  slug: string;
  image?: string;
  parent_id?: number;
  description?: string;
}

// Category service
export const categoryService = {
  // Get all categories
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await http.get('/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Create a new category
  createCategory: async (
    categoryData: CreateCategoryRequest
  ): Promise<Category> => {
    try {
      const response = await http.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<Category> => {
    try {
      const response = await http.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (
    id: number,
    categoryData: Partial<CreateCategoryRequest>
  ): Promise<Category> => {
    try {
      const response = await http.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    try {
      await http.delete(`/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },
};

export default categoryService;
