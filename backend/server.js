import cors from "cors";
import express from "express";
import { DataTypes, Sequelize } from "sequelize";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // your Next.js frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Connect to PostgreSQL
const sequelize = new Sequelize("blogdb", "postgres", "11231", {
  host: "localhost",
  dialect: "postgres",
});

// ✅ Define Post model
const Post = sequelize.define(
  "Post",
  {
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
  },
  { timestamps: true }
);

// ✅ Define Comment model
const Comment = sequelize.define(
  "Comment",
  {
    author: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0, max: 5 },
    },
  },
  { timestamps: true }
);

// ✅ Associations
Post.hasMany(Comment, { foreignKey: "postId", onDelete: "CASCADE" });
Comment.belongsTo(Post, { foreignKey: "postId" });

// ✅ Test DB connection + sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");
    await sequelize.sync(); // create tables if not exist
    console.log("✅ Database synced");
  } catch (err) {
    console.error("❌ DB connection error:", err);
  }
})();

// Root
app.get("/", (req, res) => {
  res.send("Backend API (Postgres) is running 🚀");
});

// ---------------- Post Routes ----------------

// Get all posts (with optional search & pagination)
app.get("/api/posts", async (req, res) => {
  try {
    const { q, page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    const where = q ? { title: { [Sequelize.Op.iLike]: `%${q}%` } } : {};

    const { rows: posts, count } = await Post.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
      include: [Comment], // include comments when fetching posts
    });

    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create post
app.post("/api/posts", async (req, res) => {
  try {
    const post = await Post.create(req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update post
app.put("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    await post.update(req.body);
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete post
app.delete("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    await post.destroy();
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- Comment Routes ----------------

// Get comments for a post
app.get("/api/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { postId: req.params.postId },
      order: [["createdAt", "DESC"]],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment to a post
app.post("/api/posts/:postId/comments", async (req, res) => {
  try {
    const { author, text, rating } = req.body;
    const comment = await Comment.create({
      postId: req.params.postId,
      author,
      text,
      rating,
    });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a comment
app.put("/api/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await comment.update(req.body);
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comment
app.delete("/api/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    await comment.destroy();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
