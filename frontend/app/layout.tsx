import "bootstrap/dist/css/bootstrap.min.css"; // ✅ make sure bootstrap is installed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="container py-4">{children}</body>
    </html>
  );
}
