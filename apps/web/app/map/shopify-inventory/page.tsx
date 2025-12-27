import { redirect } from 'next/navigation';

export default function ShopifyInventoryRedirect() {
  redirect('/map?schema=shopify-inventory');
}