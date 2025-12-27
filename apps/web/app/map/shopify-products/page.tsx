import { redirect } from 'next/navigation';

export default function ShopifyProductsRedirect() {
  redirect('/map?schema=shopify-products');
}