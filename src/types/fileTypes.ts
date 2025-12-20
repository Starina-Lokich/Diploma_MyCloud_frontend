export interface File {
  id: string;
  original_name: string;
  size: number;
  upload_date: string;
  last_download: string | null;
  comment: string;
  public_link: string;
  user: string; // ID пользователя
}
