import { NextRequest, NextResponse } from "next/server";

import { COMMON_CODE } from "@/server/api/codes";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  console.log("🍟🚀🍟 ~ GET ~ id:", id);

  return NextResponse.json({
    code: COMMON_CODE.OK,
    message: "成功",
    data: { message: `Hello, ${id}!` },
  });
}
