"use client";

import { useState } from "react";

export default function PostForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch("http://localhost:5000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setTitle("");
    setContent("");
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-4 shadow-sm">
      <h2 className="h5 mb-3">Create New Post</h2>

      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="form-control"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your content here..."
          className="form-control"
          rows={4}
          required
        />
      </div>

      <button type="submit" className="btn btn-success">
        Add Post
      </button>
    </form>
  );
}
