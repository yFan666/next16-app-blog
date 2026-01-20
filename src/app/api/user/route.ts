import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;

  console.log("🍟🚀🍟 ~ GET ~ query:", query.get("id"));

  return NextResponse.json({
    message: "GET reuqest successful",
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
    { message: "Post request successful", body },
    { status: 201 },
  );
  //返回json数据
}
