import { cookies } from "next/headers"; // 引入cookies
import { NextRequest, NextResponse } from "next/server";

import { AUTH_CODE, COMMON_CODE } from "@/server/api/codes";

// 模拟登录成功后设置cookie
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (body.username === "admin" && body.password === "123456") {
    const cookieStore = await cookies();
    cookieStore.set("token", "123456", {
      httpOnly: true, // 只允许服务器端访问
      maxAge: 60 * 60 * 24 * 30, //30天
    });

    return NextResponse.json(
      { code: COMMON_CODE.OK, message: "成功", data: null },
      { status: 201 },
    );
  } else {
    return NextResponse.json(
      { code: AUTH_CODE.LOGIN_FAILED, message: "用户名或密码错误", data: null },
      { status: 401 },
    );
  }
}

// 检查登录状态
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token && token.value === "123456") {
    return NextResponse.json(
      { code: COMMON_CODE.OK, message: "成功", data: { isLogin: true } },
      { status: 200 },
    );
  } else {
    return NextResponse.json(
      { code: AUTH_CODE.UNAUTHORIZED, message: "未登录", data: null },
      { status: 401 },
    );
  }
}
