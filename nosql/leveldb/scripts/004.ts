import { db } from './db';

export async function getAllProducts(): Promise<any[]> {
  const products: any[] = [];

  for await (const [key, value] of db.iterator({ keys: true, values: true })) {
    if (key !== 'last_product_id') {
      products.push({ id: key, ...JSON.parse(value) });
    }
  }

  return products;
}
