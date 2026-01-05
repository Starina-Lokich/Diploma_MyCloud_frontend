export interface User {
  id: number;  // Исправить string → number
  username: string;
  email: string;
  is_admin: boolean;
  is_staff?: boolean;  
  is_superuser?: boolean; 
  first_name?: string;
  last_name?: string;
  full_name?: string;    
  storage_path: string;
  file_count: number;
  total_file_size: number;
  formatted_total_file_size: string;
}
