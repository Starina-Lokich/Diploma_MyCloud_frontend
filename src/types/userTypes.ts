export interface User {
  id: string;
  username: string;
  email: string;
  is_admin: boolean;
  first_name?: string;
  last_name?: string;
  storage_path: string;
  file_count: number;
  total_file_size: number;
  formatted_total_file_size: string;
}
