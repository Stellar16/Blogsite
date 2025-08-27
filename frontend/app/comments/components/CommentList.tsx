"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: number;
  author: string;
  text: string;
  rating: number;
  createdAt: string;
}

export default function CommentList({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);

  async function loadComments() {
    const res = await fetch(
      `http://localhost:5000/api/posts/${postId}/comments`
    );
    const data = await res.json();
    setComments(data);
  }

  useEffect(() => {
    loadComments();
  }, [postId]);

  return (
    <div className="space-y-2">
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((c) => (
        <div key={c.id} className="border p-2 rounded">
          <p className="font-semibold">{c.author}</p>
          <p>{c.text}</p>
          {c.rating > 0 && <p>⭐ {c.rating}</p>}
          <small className="text-gray-500">
            {new Date(c.createdAt).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
