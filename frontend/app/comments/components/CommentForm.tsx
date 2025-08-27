"use client";

import { useState } from "react";

export default function CommentForm({
  postId,
  onAdded,
}: {
  postId: number;
  onAdded: () => void;
}) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, text, rating }),
    });

    setAuthor("");
    setText("");
    setRating(0);
    onAdded(); // refresh comments
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 border p-3 rounded bg-light">
      <h5>Add a Comment</h5>
      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="form-control mb-2"
        placeholder="Your name"
        required
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="form-control mb-2"
        placeholder="Write your comment..."
        rows={3}
        required
      />
      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="form-select mb-2"
      >
        <option value={0}>Rating: 0 ⭐</option>
        <option value={1}>1 ⭐</option>
        <option value={2}>2 ⭐</option>
        <option value={3}>3 ⭐</option>
        <option value={4}>4 ⭐</option>
        <option value={5}>5 ⭐</option>
      </select>
      <button type="submit" className="btn btn-primary">
        Submit Comment
      </button>
    </form>
  );
}
