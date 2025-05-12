export type User = {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  watched?: number;
  followers?: number;
  following?: number;
};