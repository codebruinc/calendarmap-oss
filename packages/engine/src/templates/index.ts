import { shopifyProductsTemplate } from './shopify-products';
import { shopifyInventoryTemplate } from './shopify-inventory';
import { stripeCustomersTemplate } from './stripe-customers';
import { calendarIcsTemplate } from './calendar-ics';

export const templates = {
  'shopify-products': shopifyProductsTemplate,
  'shopify-inventory': shopifyInventoryTemplate,
  'stripe-customers': stripeCustomersTemplate,
  'calendar-ics': calendarIcsTemplate,
} as const;

export { shopifyProductsTemplate, shopifyInventoryTemplate, stripeCustomersTemplate, calendarIcsTemplate };

export type TemplateKey = keyof typeof templates;