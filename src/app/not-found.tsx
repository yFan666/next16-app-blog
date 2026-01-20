import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black font-sans text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(700px_circle_at_15%_20%,rgba(16,185,129,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_85%_30%,rgba(99,102,241,0.16),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_50%_95%,rgba(236,72,153,0.10),transparent_55%)]" />
        <div className="absolute inset-0 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_72%)] [background-size:44px_44px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/0 to-white/5" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-20">
        <div className="relative w-full max-w-xl">
          <div className="pointer-events-none absolute -top-10 left-0 text-[120px] leading-none font-semibold tracking-tighter text-white/5 blur-[0.5px] select-none sm:text-[160px]">
            404
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300">
              <span>404 · 页面不存在</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.95)]" />
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                你走到了地图之外
              </span>
            </h1>

            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
              这条路径没有被记录在案。要么返回首页，要么去看看你真正想找的内容。
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90"
              >
                返回首页
              </Link>
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/0 px-5 text-sm font-medium text-zinc-200 transition hover:bg-white/5"
              >
                回到上一层感觉
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-zinc-500">
              <span className="font-mono">next16-app-blog</span>
              <span className="font-mono">not-found</span>
            </div>
          </div>

          <div className="pointer-events-none absolute -inset-x-6 -bottom-10 h-24 bg-[radial-gradient(closest-side,rgba(255,255,255,0.10),transparent)] blur-2xl" />
        </div>
      </div>
    </div>
  );
}
