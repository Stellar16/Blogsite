"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/posts/${params.id}`)
      .then((res) => res.json())
      .then((data) => setPost(data));
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch(`/api/posts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    router.push("/");
  }

  if (!post) return <p>Loading...</p>;

  return (
    <div className="container py-5">
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            value={post.slug}
            onChange={(e) => setPost({ ...post, slug: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows={4}
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
          />
        </div>
        <button className="btn btn-success" type="submit">
          Update Post
        </button>
      </form>
    </div>
  );
}
