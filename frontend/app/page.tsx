"use client"; // ⬅️ This makes it a Client Component

import { useState } from "react";
import PostForm from "./posts/components/PostForm";
import PostList from "./posts/PostList";

export default function HomePage() {
  const [reloadFlag, setReloadFlag] = useState(false);

  // Trigger reloading of posts
  const handleCreated = () => {
    setReloadFlag((prev) => !prev);
  };

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🚀 Blogsite</h1>
      <PostForm onCreated={handleCreated} />
      <PostList reloadFlag={reloadFlag} />
    </main>
  );
}
