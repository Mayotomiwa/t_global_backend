export interface Publication {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  imageUrl?: string;
}