import { cookies } from "next/headers"; // 引入cookies
import { NextRequest, NextResponse } from "next/server";

// 模拟登录成功后设置cookie
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.username === "admin" && body.password === "123456") {
    const cookieStore = await cookies();
    cookieStore.set("token", "123456", {
      httpOnly: true, // 只允许服务器端访问
      maxAge: 60 * 60 * 24 * 30, //30天
    });

    return NextResponse.json({ code: 1 }, { status: 201 });
  } else {
    return NextResponse.json({ code: 0 }, { status: 401 });
  }
}

// 检查登录状态
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token && token.value === "123456") {
    return NextResponse.json({ code: 1 }, { status: 200 });
  } else {
    return NextResponse.json({ code: 0 }, { status: 401 });
  }
}
