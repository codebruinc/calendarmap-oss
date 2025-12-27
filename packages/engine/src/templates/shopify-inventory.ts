import { Template } from '../types';

export const shopifyInventoryTemplate: Template = {
  key: 'shopify-inventory',
  title: 'Shopify Inventory',
  templateVersion: '2025.1.0',
  ruleVersion: '1.0.0',
  sourceUrls: [
    'https://help.shopify.com/en/manual/products/inventory/getting-started-with-inventory/inventory-csv',
    'https://help.shopify.com/en/manual/products/import-export/using-csv'
  ],
  lastVerified: '2025-01-14',
  notes: [
    'Based on official Shopify Inventory CSV import specifications (2025)',
    'UTF-8 encoding required, comma-separated values',
    'Available can be negative for inventory adjustments',
    'Location defaults to "default" if not specified',
    'Multi-location: separate rows per location required',
    'SKU will be automatically uppercased',
    'Import updates "On hand" quantities only',
    'Required: Handle, Location, SKU or Option values',
  ],
  fields: [
    {
      key: 'variant_sku',
      label: 'Variant SKU',
      required: true,
      type: 'string',
      transform: ['trim', 'upper'],
      synonyms: ['sku', 'product sku'],
    },
    {
      key: 'available',
      label: 'Available',
      required: true,
      type: 'number',
      transform: ['number'],
      synonyms: ['qty', 'stock', 'on hand', 'quantity', 'inventory'],
    },
    {
      key: 'location',
      label: 'Location',
      type: 'string',
      transform: ['trim'],
      synonyms: ['warehouse', 'store', 'location name'],
    },
    {
      key: 'cost',
      label: 'Cost',
      type: 'number',
      transform: ['number'],
      synonyms: ['unit cost', 'cost per item', 'wholesale cost'],
    },
  ],
};