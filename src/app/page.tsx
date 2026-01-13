export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="glass p-12 rounded-3xl max-w-md text-center">
        <h1 className="text-4xl font-bold tracking-tighter mb-4">
          The Future of Commerce
        </h1>
        <p className="text-muted-foreground mb-6">
          Next.js 15 + Tailwind v4 + Supabase.
        </p>
        <button className="px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform">
          Browse Products
        </button>
      </div>
    </div>
  );
}
