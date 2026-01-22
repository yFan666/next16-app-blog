export type PostItem = {
  id: number;
  title: string;
  content: string | null;
  isPublished: boolean;
  createdAt: string;
  author: {
    id: number;
    email: string;
    name: string | null;
  };
};

export type CreatePostInput = {
  title: string;
  content: string;
  authorEmail: string;
  authorName: string;
  isPublished: boolean;
};
