"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { postsApi } from "@/lib/api/posts";
import type { CreatePostInput, PostItem } from "@/types/posts";

export default function PostsPage() {
  const [items, setItems] = useState<PostItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [authorEmail, setAuthorEmail] = useState("youli@example.com");
  const [authorName, setAuthorName] = useState("youli");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      authorEmail.trim().length > 0 && title.trim().length > 0 && !isSubmitting
    );
  }, [authorEmail, title, isSubmitting]);

  async function reload() {
    setIsLoading(true);
    setError(null);
    try {
      // { take: 2 }
      const res = await postsApi.list();
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    console.log("页面加载时，重新加载数据");
    reload();
    return () => {
      console.log("组件即将卸载");
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Posts</h1>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="authorEmail"
          />
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="authorName (optional)"
          />
        </div>

        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="title"
        />

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="content (optional)"
        />

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
          />
          published
        </label>

        <div className="flex items-center gap-3">
          <Button
            disabled={!canSubmit}
            onClick={async () => {
              setIsSubmitting(true);
              setError(null);
              try {
                const payload: CreatePostInput = {
                  title,
                  content,
                  authorEmail,
                  authorName,
                  isPublished,
                };
                await postsApi.create(payload);
                setTitle("");
                setContent("");
                setIsPublished(false);
                await reload();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Unknown error");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {isSubmitting ? "Submitting..." : "Create"}
          </Button>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => reload()}
          >
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-zinc-500">
            {isLoading ? "Loading..." : "No posts yet"}
          </div>
        ) : null}

        <div className="space-y-3">
          {items.map((post) => (
            <div key={post.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-lg font-medium">{post.title}</div>
                  <div className="text-xs text-zinc-500">
                    {new Date(post.createdAt).toLocaleString()} ·{" "}
                    {post.author.email}
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  {post.isPublished ? "published" : "draft"}
                </div>
              </div>
              {post.content ? (
                <div className="mt-3 text-sm whitespace-pre-wrap text-zinc-700">
                  {post.content}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
