export interface Notification {
  id: number;
  user_id: string;
  created_at: string;
  read_at: string | null;
  type: string;
  title: string;
  description?: string | null;
  link?: string | null;
  icon?: string | null;
  icon_color?: string | null;
}
