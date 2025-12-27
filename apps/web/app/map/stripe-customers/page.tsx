import { redirect } from 'next/navigation';

export default function StripeCustomersRedirect() {
  redirect('/map?schema=stripe-customers');
}