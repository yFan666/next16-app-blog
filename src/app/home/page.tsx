"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

const checkLogin = async () => {
  const res = await fetch("/api/login");
  const data = await res.json();

  if (data.code === 1) {
    return true;
  } else {
    redirect("/");
  }
};

export default function HomePage() {
  useEffect(() => {
    checkLogin();
  }, []);
  return (
    <div>
      <h1>你已经登录进入Home Page</h1>
    </div>
  );
}
