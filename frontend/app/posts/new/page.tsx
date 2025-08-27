import PostForm from "../components/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h2>Create a New Post</h2>
      <PostForm
        onCreated={() => {
          console.log("Post created!");
        }}
      />
    </div>
  );
}
