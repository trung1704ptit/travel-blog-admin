export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  provider: string;
  created_at: string;
  updated_at: string;
  avatar?: string; // Optional for backward compatibility
  first_name?: string; // Optional for backward compatibility
  last_name?: string; // Optional for backward compatibility
}
