export const revalidate = 0;

import { createClient } from "@/utils/supabase/server";
import ProductCard from "@/components/ProductCard";


export default async function Home() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*");

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Storefront
        </h1>
        <p className="mt-4 text-white/40">
          Curated essentials for the modern setup.
        </p>
      </header>

      {/* The Responsive Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
}
