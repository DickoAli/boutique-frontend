import { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  const data = await fetchProducts();
  const products = data.data;

  const productUrls = products.map((product: any) => ({
    url: `${baseUrl}/produit/${product.id}`,
    lastModified: new Date(product.updated_at),
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...productUrls,
  ];
}