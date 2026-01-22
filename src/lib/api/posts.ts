import { requestJson } from "@/lib/api/http";
import type { CreatePostInput, PostItem } from "@/types/posts";

export const postsApi = {
  list: (input?: { take?: number }) => {
    return requestJson<{ items: PostItem[] }>("/api/posts", {
      method: "GET",
      query: { take: input?.take },
      cache: "no-store",
    });
  },
  create: (input: CreatePostInput) => {
    return requestJson<{ item: PostItem }>("/api/posts", {
      method: "POST",
      body: input,
    });
  },
};
