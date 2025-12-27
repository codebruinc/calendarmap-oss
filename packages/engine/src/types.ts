export type Field = {
  key: string;
  label: string;
  required?: boolean;
  type: 'string' | 'number' | 'boolean' | 'enum';
  enumValues?: string[];
  transform?: ('trim' | 'upper' | 'lower' | 'number' | 'boolean')[];
  synonyms?: string[];
};

export type Template = {
  key: 'shopify-products' | 'shopify-inventory' | 'stripe-customers' | 'calendar-ics';
  title: string;
  fields: Field[];
  notes: string[];
  templateVersion: string;
  ruleVersion: string;
  sourceUrls: string[];
  lastVerified: string; // ISO date
};

export type ValidationError = {
  row: number;
  field: string;
  issue: string;
  value?: any;
};

export type BusinessWarning = {
  row: number;
  type: 'unpublished_with_inventory' | 'zero_price_active' | 'deny_policy_no_stock' |
        'minimal_customer_info' | 'test_email_detected' | 'address_format_mismatch' |
        'large_negative_inventory' | 'high_qty_no_cost' |
        // Calendar ICS warning types
        'end_before_start' | 'event_far_past' | 'event_far_future' |
        'very_long_event' | 'short_title' | 'generic_title';
  message: string;
};

export type ValidationResult = {
  okCount: number;
  errorCount: number;
  sampleErrors: ValidationError[];
  businessWarnings?: BusinessWarning[];
};

export type MappingResult = {
  headers: string[];
  rows: any[];
};

export type GuessMappingResult = Record<string, string>; // targetKey -> sourceHeader