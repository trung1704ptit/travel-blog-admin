import { User } from '@/interfaces/user';
import http from '@/lib/http';

// User service
export const userService = {
  // Get all users with pagination
  getUsers: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }> => {
    try {
      const response = await http.get('/users', {
        params: {
          page,
          limit,
        },
      });
      return {
        data: response.data.data.users || [],
        total: response.data.data.users?.length || 0,
        page: page,
        limit: limit,
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User> => {
    try {
      const response = await http.get(`/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create a new user
  createUser: async (userData: Partial<User>): Promise<User> => {
    try {
      const response = await http.post('/users', userData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      const response = await http.patch(`/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      await http.delete(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export default userService;
