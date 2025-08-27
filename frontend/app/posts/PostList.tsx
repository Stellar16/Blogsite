"use client";

import { useEffect, useState } from "react";
import PostItem from "./components/PostItem";

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function PostList({ reloadFlag }: { reloadFlag: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  async function loadPosts(page = 1, q = "") {
    const res = await fetch(
      `http://localhost:5000/api/posts?page=${page}&limit=5&q=${q}`
    );
    const data = await res.json();
    setPosts(data.posts);
    setTotalPages(data.totalPages);
    setPage(data.currentPage);
  }

  // Reload on first mount + when reloadFlag changes
  useEffect(() => {
    loadPosts(page, search);
  }, [reloadFlag]);

  return (
    <div>
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          loadPosts(1, e.target.value);
        }}
        className="form-control mb-4"
      />

      {/* 📝 Posts */}
      <div>
        {posts.map((post) => (
          <PostItem key={post.id} post={post} /> // ✅ Use PostItem here
        ))}
      </div>

      {/* 📄 Pagination */}
      <div className="d-flex gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => loadPosts(i + 1, search)}
            className={`btn ${
              page === i + 1 ? "btn-primary" : "btn-outline-primary"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
