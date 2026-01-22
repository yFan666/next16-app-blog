import "server-only";

import { prisma } from "@/server/db/prisma";

export type CreatePostInput = {
  title: string;
  content?: string;
  authorEmail: string;
  authorName?: string;
  isPublished: boolean;
};

export async function listPosts(input?: { take?: number }) {
  const take = input?.take ?? 20;
  const safeTake = Number.isFinite(take) ? Math.min(Math.max(take, 1), 50) : 20;

  return prisma.post.findMany({
    take: safeTake,
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
    },
  });
}

export async function createPost(input: CreatePostInput) {
  const title = input.title.trim();
  const authorEmail = input.authorEmail.trim().toLowerCase();

  const authorName =
    typeof input.authorName === "string" && input.authorName.trim().length > 0
      ? input.authorName.trim()
      : undefined;

  const content =
    typeof input.content === "string" && input.content.trim().length > 0
      ? input.content.trim()
      : undefined;

  const author = await prisma.user.upsert({
    where: { email: authorEmail },
    create: { email: authorEmail, name: authorName },
    update: authorName ? { name: authorName } : {},
  });

  console.log("author", author);

  return prisma.post.create({
    data: {
      title,
      content,
      isPublished: input.isPublished,
      authorId: author.id,
    },
    include: {
      author: true,
    },
  });
}
