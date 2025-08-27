"use client";

import { useState } from "react";
import CommentForm from "../../comments/components/CommentForm";
import CommentList from "../../comments/components/CommentList";

export default function PostItem({ post }: { post: any }) {
  const [reload, setReload] = useState(false);

  return (
    <div className="border rounded p-4 mb-3 shadow">
      <h3 className="text-xl font-bold">{post.title}</h3>
      <p className="text-gray-600">{post.content}</p>

      {/* Comments */}
      <div className="mt-3">
        <h5 className="font-semibold">Comments</h5>
        <CommentForm postId={post.id} onAdded={() => setReload(!reload)} />
        <CommentList key={reload ? "a" : "b"} postId={post.id} />
      </div>
    </div>
  );
}
