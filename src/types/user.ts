export type Team = {
  id: number;
  name: string;
  users: User[];
};

export type User = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  total_answers?: number;
};
