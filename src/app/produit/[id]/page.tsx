import { Metadata } from "next";
import { fetchProduct } from "@/lib/api";
import AddToCartButton from "@/components/AddToCartButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const product = await fetchProduct(id);
    return {
      title: `${product.name} | Ma Boutique Digitale`,
      description:
        product.description ||
        `Achetez ${product.name} en téléchargement immédiat.`,
    };
  } catch {
    return {
      title: "Produit introuvable | Ma Boutique Digitale",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetchProduct(id);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white border border-ink-200 rounded-2xl p-8">
        <p className="text-xs uppercase tracking-wide text-brand-600 font-semibold mb-3">
          {product.category?.name}
        </p>
        <h1 className="text-3xl font-bold text-ink-900 mb-4">
          {product.name}
        </h1>
        <p className="text-3xl font-bold text-ink-900 mb-6">
          {product.price} FCFA
        </p>
        {product.description && (
          <p className="text-ink-600 mb-8 leading-relaxed">
            {product.description}
          </p>
        )}
        <AddToCartButton productId={product.id} />
      </div>
    </main>
  );
}