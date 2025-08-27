export default function PostDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <div>
      <h2>Post: {params.slug}</h2>
      {/* Later: Fetch and render PostDetail */}
    </div>
  );
}
