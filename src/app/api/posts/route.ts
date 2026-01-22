import { NextRequest, NextResponse } from "next/server";

import { createPost, listPosts } from "@/server/services/posts";

type CreatePostBody = {
  title?: unknown;
  content?: unknown;
  authorEmail?: unknown;
  authorName?: unknown;
  isPublished?: unknown;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function GET(request: NextRequest) {
  const takeParam = request.nextUrl.searchParams.get("take");
  const take = takeParam ? Number(takeParam) : 20;
  const items = await listPosts({ take });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as CreatePostBody;

  if (!isNonEmptyString(body.title)) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }

  if (!isNonEmptyString(body.authorEmail)) {
    return NextResponse.json(
      { error: "authorEmail is required" },
      { status: 400 },
    );
  }

  const title = body.title.trim();
  const authorEmail = body.authorEmail.trim().toLowerCase();

  const authorName =
    typeof body.authorName === "string" && body.authorName.trim().length > 0
      ? body.authorName.trim()
      : undefined;

  const content =
    typeof body.content === "string" ? body.content.trim() : undefined;

  const isPublished = body.isPublished === true;

  const created = await createPost({
    title,
    content,
    authorEmail,
    authorName,
    isPublished,
  });

  return NextResponse.json({ item: created }, { status: 201 });
}
