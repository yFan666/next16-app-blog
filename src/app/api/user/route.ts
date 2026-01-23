import { NextRequest, NextResponse } from "next/server";

import { COMMON_CODE } from "@/server/api/codes";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;

  console.log("🍟🚀🍟 ~ GET ~ query:", query.get("id"));

  return NextResponse.json({
    code: COMMON_CODE.OK,
    message: "成功",
    data: { message: "GET request successful" },
  });
}

export async function POST(request: NextRequest) {
  // const body = await request.formData(); //接受formData数据
  // const body = await request.text(); //接受text数据
  // const body = await request.arrayBuffer(); //接受arrayBuffer数据
  // const body = await request.blob(); //接受blob数据
  const body = await request.json(); //接受json数据
  console.log("🍟🚀🍟 ~ POST ~ body:", body);
  return NextResponse.json(
    { code: COMMON_CODE.OK, message: "成功", data: { message: "成功", body } },
    { status: 201 },
  );
  //返回json数据
}
