import { NextRequest, NextResponse } from "next/server";

import { COMMON_CODE, POSTS_CODE } from "@/server/api/codes";
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
  try {
    const takeParam = request.nextUrl.searchParams.get("take");
    const take = takeParam ? Number(takeParam) : 20;
    const items = await listPosts({ take });

    return NextResponse.json({
      code: COMMON_CODE.OK,
      message: "成功",
      data: { items },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json(
      {
        code: POSTS_CODE.UNKNOWN,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreatePostBody;

    if (!isNonEmptyString(body.title)) {
      return NextResponse.json(
        {
          code: POSTS_CODE.INVALID_TITLE,
          message: "title is required",
          data: null,
        },
        { status: 400 },
      );
    }

    if (!isNonEmptyString(body.authorEmail)) {
      return NextResponse.json(
        {
          code: POSTS_CODE.INVALID_AUTHOR_EMAIL,
          message: "authorEmail is required",
          data: null,
        },
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

    return NextResponse.json(
      {
        code: COMMON_CODE.OK,
        message: "成功",
        data: { item: created },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json(
      {
        code: POSTS_CODE.UNKNOWN,
        message,
        data: null,
      },
      { status: 500 },
    );
  }
}
