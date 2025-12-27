// Simple Levenshtein distance - same algorithm as fast-levenshtein
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1] ? matrix[i - 1][j - 1] :
        Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
    }
  }
  return matrix[b.length][a.length];
}
const levenshtein = { get: levenshteinDistance };
import { Template, Field, GuessMappingResult, ValidationResult, ValidationError, BusinessWarning, MappingResult } from './types';
import { parseFlexibleDate } from './ics-generator';

/**
 * Auto-map CSV headers to template fields using fuzzy matching + synonyms
 */
export function guessMapping(headers: string[], template: Template): GuessMappingResult {
  const mapping: GuessMappingResult = {};
  const usedHeaders = new Set<string>();
  
  for (const field of template.fields) {
    const candidates = [field.label, field.key, ...(field.synonyms || [])];
    let bestMatch = '';
    let bestScore = Infinity;
    let bestType = '';
    
    for (const header of headers) {
      if (usedHeaders.has(header)) continue; // Don't reuse headers
      
      const normalizedHeader = header.toLowerCase().trim();
      
      for (const candidate of candidates) {
        const normalizedCandidate = candidate.toLowerCase().trim();
        
        // Exact match gets highest priority
        if (normalizedHeader === normalizedCandidate) {
          bestMatch = header;
          bestScore = 0;
          bestType = 'exact';
          break;
        }
        
        // Word boundary matches (like "product price" contains "price")
        const headerWords = normalizedHeader.split(/[\s_-]+/);
        const candidateWords = normalizedCandidate.split(/[\s_-]+/);
        
        // Check for multi-word exact matches (e.g., "All Day" matches "all_day")
        if (headerWords.length === candidateWords.length && headerWords.length > 1) {
          const allWordsMatch = candidateWords.every((word, index) => 
            headerWords[index] === word || levenshtein.get(headerWords[index], word) <= 1
          );
          if (allWordsMatch) {
            bestMatch = header;
            bestScore = 0;
            bestType = 'multi-word-exact';
            break;
          }
        }
        
        // Check if any candidate word exactly matches any header word
        for (const candidateWord of candidateWords) {
          if (candidateWord.length > 2 && headerWords.includes(candidateWord)) {
            const score = Math.abs(normalizedHeader.length - normalizedCandidate.length);
            if (score < bestScore || (score === bestScore && bestType !== 'exact')) {
              bestMatch = header;
              bestScore = score;
              bestType = 'word';
            }
          }
        }
        
        // Contains match (broader matching)
        if (normalizedHeader.includes(normalizedCandidate) || normalizedCandidate.includes(normalizedHeader)) {
          const score = Math.abs(normalizedHeader.length - normalizedCandidate.length);
          if (score < bestScore || (score === bestScore && bestType === '')) {
            bestMatch = header;
            bestScore = score;
            bestType = 'contains';
          }
        }
        
        // Fuzzy match as fallback
        const distance = levenshtein.get(normalizedHeader, normalizedCandidate);
        const similarity = 1 - distance / Math.max(normalizedHeader.length, normalizedCandidate.length);
        
        if (similarity > 0.7 && distance < bestScore && bestType === '') {
          bestMatch = header;
          bestScore = distance;
          bestType = 'fuzzy';
        }
      }
      
      if (bestScore === 0) break; // Found exact match
    }
    
    // Accept the match if it's good enough
    if (bestMatch && (bestScore === 0 || (bestScore <= 10 && bestType !== ''))) {
      mapping[field.key] = bestMatch;
      usedHeaders.add(bestMatch);
    }
  }
  
  return mapping;
}

/**
 * Apply transforms to a value based on field configuration
 */
function applyTransforms(value: any, transforms: string[] = []): any {
  if (value === null || value === undefined) return value;
  
  let result = value;
  
  for (const transform of transforms) {
    switch (transform) {
      case 'trim':
        result = typeof result === 'string' ? result.trim() : result;
        break;
      case 'upper':
        result = typeof result === 'string' ? result.toUpperCase() : result;
        break;
      case 'lower':
        result = typeof result === 'string' ? result.toLowerCase() : result;
        break;
      case 'number':
        if (typeof result === 'string') {
          const parsed = parseFloat(result.replace(/[^0-9.-]/g, ''));
          result = isNaN(parsed) ? result : parsed;
        }
        break;
      case 'boolean':
        if (typeof result === 'string') {
          const lower = result.toLowerCase().trim();
          if (['true', '1', 'yes', 'y', 'on'].includes(lower)) {
            result = 'TRUE';
          } else if (['false', '0', 'no', 'n', 'off'].includes(lower)) {
            result = 'FALSE';
          }
        } else if (typeof result === 'boolean') {
          result = result ? 'TRUE' : 'FALSE';
        }
        break;
    }
  }
  
  return result;
}

/**
 * Validate a single value against a field definition
 */
function validateValue(value: any, field: Field, sourceHeader?: string): string | null {
  // Handle required fields
  if (field.required && (value === null || value === undefined || value === '')) {
    return `Required field "${field.label}" is empty. This field is required for ${field.key.includes('email') ? 'customer identification' : field.key.includes('sku') ? 'product identification' : 'proper data processing'}.`;
  }
  
  // Skip validation for empty optional fields
  if (!field.required && (value === null || value === undefined || value === '')) {
    return null;
  }
  
  // Type validation with context
  switch (field.type) {
    case 'number':
      if (typeof value !== 'number' && isNaN(parseFloat(String(value)))) {
        return `"${field.label}" must be a valid number, but got "${value}". ${sourceHeader ? `Check column "${sourceHeader}".` : ''} Example: 29.99 or 150`;
      }
      if (field.key.includes('price') && parseFloat(String(value)) < 0) {
        return `"${field.label}" cannot be negative, but got "${value}". Prices must be 0 or greater. Use 0 for free items.`;
      }
      if (field.key.includes('inventory') || field.key.includes('qty')) {
        const num = parseFloat(String(value));
        if (num < -999999 || num > 999999) {
          return `"${field.label}" value "${value}" is outside reasonable range. Should be between -999,999 and 999,999.`;
        }
      }
      break;
      
    case 'boolean':
      if (!['TRUE', 'FALSE', true, false].includes(value)) {
        return `"${field.label}" must be TRUE or FALSE, but got "${value}". ${sourceHeader ? `Check column "${sourceHeader}".` : ''} Use TRUE/FALSE, true/false, 1/0, or yes/no.`;
      }
      break;
      
    case 'enum':
      if (field.enumValues && !field.enumValues.includes(String(value))) {
        return `"${field.label}" must be one of: ${field.enumValues.join(', ')}, but got "${value}". ${sourceHeader ? `Check column "${sourceHeader}".` : ''}`;
      }
      break;
      
    case 'string':
      // Enhanced email validation
      if (field.key === 'email' && typeof value === 'string') {
        const emailStr = String(value).trim();
        
        // More comprehensive email validation
        if (emailStr.length === 0) {
          return `"${field.label}" is required but appears to be empty. ${sourceHeader ? `Check column "${sourceHeader}".` : ''}`;
        }
        
        if (emailStr.length > 254) {
          return `"${field.label}" is too long (${emailStr.length} characters). Email addresses should be under 254 characters.`;
        }
        
        // Check for basic format
        if (!emailStr.includes('@')) {
          return `"${field.label}" "${emailStr}" is missing @ symbol. Email format should be: name@domain.com`;
        }
        
        const parts = emailStr.split('@');
        if (parts.length !== 2) {
          return `"${field.label}" "${emailStr}" has multiple @ symbols. Email should have exactly one @ symbol.`;
        }
        
        const [localPart, domain] = parts;
        
        if (localPart.length === 0) {
          return `"${field.label}" "${emailStr}" is missing the name part before @. Email format should be: name@domain.com`;
        }
        
        if (domain.length === 0) {
          return `"${field.label}" "${emailStr}" is missing the domain part after @. Email format should be: name@domain.com`;
        }
        
        if (!domain.includes('.')) {
          return `"${field.label}" "${emailStr}" domain is missing a dot. Domain should include extension like .com, .org, etc.`;
        }
        
        const domainParts = domain.split('.');
        if (domainParts.some(part => part.length === 0)) {
          return `"${field.label}" "${emailStr}" has empty parts in domain. Check for double dots or trailing dots.`;
        }
        
        // More strict regex check
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(emailStr)) {
          return `"${field.label}" "${emailStr}" contains invalid characters. Use only letters, numbers, and common symbols like dots, hyphens, underscores.`;
        }
      }
      
      // Phone number validation
      if (field.key === 'phone' && typeof value === 'string' && value.trim() !== '') {
        const phoneStr = String(value).trim();
        // Very basic phone validation - just check for reasonable length and contains digits
        if (phoneStr.length < 7 || phoneStr.length > 20) {
          return `"${field.label}" "${phoneStr}" should be 7-20 characters long. Include country code if international (e.g., +1-555-123-4567).`;
        }
        if (!/\d/.test(phoneStr)) {
          return `"${field.label}" "${phoneStr}" should contain at least one digit. Format examples: +1-555-123-4567, (555) 123-4567, 555.123.4567`;
        }
      }
      
      // Country code validation
      if (field.key === 'country' && typeof value === 'string' && value.trim() !== '') {
        const countryStr = String(value).trim().toUpperCase();
        if (countryStr.length === 1) {
          return `"${field.label}" "${value}" is too short. Use 2-letter country codes (US, CA, GB) or full country names (United States, Canada, United Kingdom).`;
        }
        if (countryStr.length > 56) { // Longest country name
          return `"${field.label}" "${value}" is too long. Use 2-letter country codes (US, CA, GB) or standard country names.`;
        }
      }
      
      // Postal code basic validation
      if ((field.key === 'postal_code' || field.key.includes('zip')) && typeof value === 'string' && value.trim() !== '') {
        const postalStr = String(value).trim();
        if (postalStr.length < 3 || postalStr.length > 12) {
          return `"${field.label}" "${postalStr}" should be 3-12 characters. Examples: 90210, K1A 0A9, SW1A 1AA, 12345-6789`;
        }
      }

      // Date/datetime validation for calendar fields
      if ((field.key === 'start' || field.key === 'end') && typeof value === 'string' && value.trim() !== '') {
        const dateStr = String(value).trim();
        const parsed = parseFlexibleDate(dateStr, true);
        if (!parsed) {
          return `"${field.label}" "${dateStr}" is not a recognized date format. Supported formats include: 2025-01-15, 01/15/2025, January 15, 2025, 2025-01-15 09:00, 01/15/2025 9:00 AM`;
        }
        // Sanity check for reasonable dates
        const year = parsed.getFullYear();
        if (year < 1970 || year > 2100) {
          return `"${field.label}" "${dateStr}" has year ${year} which seems unusual. Expected years between 1970-2100.`;
        }
      }

      break;
  }
  
  return null;
}

/**
 * Check for business logic warnings for all templates
 */
function checkBusinessLogic(
  rows: any[],
  template: Template,
  mapping: GuessMappingResult
): BusinessWarning[] {
  const warnings: BusinessWarning[] = [];
  
  if (template.key === 'shopify-products') {
    warnings.push(...checkShopifyProductsLogic(rows, template, mapping));
  } else if (template.key === 'stripe-customers') {
    warnings.push(...checkStripeCustomersLogic(rows, template, mapping));
  } else if (template.key === 'shopify-inventory') {
    warnings.push(...checkShopifyInventoryLogic(rows, template, mapping));
  } else if (template.key === 'calendar-ics') {
    warnings.push(...checkCalendarIcsLogic(rows, template, mapping));
  }

  return warnings;
}

/**
 * Business logic warnings for Shopify Products
 */
function checkShopifyProductsLogic(
  rows: any[],
  template: Template,
  mapping: GuessMappingResult
): BusinessWarning[] {

  const warnings: BusinessWarning[] = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Get mapped values
    const publishedHeader = mapping['published'];
    const inventoryHeader = mapping['variant_inventory_qty'];
    const priceHeader = mapping['variant_price'];
    const statusHeader = mapping['status'];
    const policyHeader = mapping['variant_inventory_policy'];
    
    if (publishedHeader && inventoryHeader) {
      let published = row[publishedHeader];
      let inventory = row[inventoryHeader];
      
      // Apply transforms
      const publishedField = template.fields.find(f => f.key === 'published');
      const inventoryField = template.fields.find(f => f.key === 'variant_inventory_qty');
      
      if (publishedField) published = applyTransforms(published, publishedField.transform);
      if (inventoryField) inventory = applyTransforms(inventory, inventoryField.transform);
      
      // Check: Published = FALSE & Inventory > 0
      if (published === 'FALSE' && typeof inventory === 'number' && inventory > 0) {
        warnings.push({
          row: i + 1,
          type: 'unpublished_with_inventory',
          message: `Product has ${inventory} inventory but is not published`
        });
      }
    }
    
    if (priceHeader && statusHeader) {
      let price = row[priceHeader];
      let status = row[statusHeader];
      
      // Apply transforms
      const priceField = template.fields.find(f => f.key === 'variant_price');
      const statusField = template.fields.find(f => f.key === 'status');
      
      if (priceField) price = applyTransforms(price, priceField.transform);
      if (statusField) status = applyTransforms(status, statusField.transform);
      
      // Check: Price = 0 on active products
      if (typeof price === 'number' && price === 0 && status === 'active') {
        warnings.push({
          row: i + 1,
          type: 'zero_price_active',
          message: 'Active product has $0 price'
        });
      }
    }
    
    if (policyHeader && inventoryHeader) {
      let policy = row[policyHeader];
      let inventory = row[inventoryHeader];
      
      // Apply transforms
      const policyField = template.fields.find(f => f.key === 'variant_inventory_policy');
      const inventoryField = template.fields.find(f => f.key === 'variant_inventory_qty');
      
      if (policyField) policy = applyTransforms(policy, policyField.transform);
      if (inventoryField) inventory = applyTransforms(inventory, inventoryField.transform);
      
      // Check: Inventory policy = deny & qty ≤ 0
      if (policy === 'deny' && typeof inventory === 'number' && inventory <= 0) {
        warnings.push({
          row: i + 1,
          type: 'deny_policy_no_stock',
          message: `Inventory policy is "deny" but quantity is ${inventory}`
        });
      }
    }
  }
  
  return warnings;
}

/**
 * Business logic warnings for Stripe Customers  
 */
function checkStripeCustomersLogic(
  rows: any[],
  template: Template,
  mapping: GuessMappingResult
): BusinessWarning[] {
  const warnings: BusinessWarning[] = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    const emailHeader = mapping['email'];
    const nameHeader = mapping['name'];
    const phoneHeader = mapping['phone'];
    const countryHeader = mapping['country'];
    const addressHeader = mapping['address_line1'];
    
    // Check for customers with no contact info besides email
    if (emailHeader && !nameHeader && !phoneHeader) {
      const email = row[emailHeader];
      if (email && email.trim()) {
        warnings.push({
          row: i + 1,
          type: 'minimal_customer_info',
          message: `Customer has only email "${email}" - consider adding name or phone for better identification`
        });
      }
    }
    
    // Check for suspicious email domains
    if (emailHeader) {
      const email = row[emailHeader];
      if (email && typeof email === 'string') {
        const emailStr = email.trim().toLowerCase();
        if (emailStr.includes('test') || emailStr.includes('example') || emailStr.includes('demo')) {
          warnings.push({
            row: i + 1,
            type: 'test_email_detected',
            message: `Email "${email}" appears to be a test/example address - verify this is real customer data`
          });
        }
      }
    }
    
    // Check for inconsistent country/address data
    if (countryHeader && addressHeader) {
      const country = row[countryHeader];
      const address = row[addressHeader];
      
      if (country && address && typeof country === 'string' && typeof address === 'string') {
        const countryStr = country.trim().toLowerCase();
        const addressStr = address.trim().toLowerCase();
        
        // Simple heuristic for address/country mismatches
        if ((countryStr.includes('us') || countryStr.includes('america')) && !addressStr.match(/\d+/)) {
          warnings.push({
            row: i + 1,
            type: 'address_format_mismatch',
            message: `US customer but address "${address}" doesn't include house number - verify address format`
          });
        }
      }
    }
  }
  
  return warnings;
}

/**
 * Business logic warnings for Shopify Inventory
 */
function checkShopifyInventoryLogic(
  rows: any[],
  template: Template,  
  mapping: GuessMappingResult
): BusinessWarning[] {
  const warnings: BusinessWarning[] = [];
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    const skuHeader = mapping['variant_sku'];
    const availableHeader = mapping['available'];
    const costHeader = mapping['cost'];
    
    // Check for negative inventory without explanation
    if (availableHeader) {
      const available = row[availableHeader];
      if (available && typeof available === 'number' && available < -100) {
        warnings.push({
          row: i + 1,
          type: 'large_negative_inventory',
          message: `Large negative inventory (${available}) - verify this adjustment is intentional`
        });
      }
    }
    
    // Check for missing cost data on high-value adjustments
    if (availableHeader && costHeader) {
      const available = row[availableHeader];
      const cost = row[costHeader];
      
      if (available && Math.abs(parseFloat(String(available))) > 100 && (!cost || parseFloat(String(cost)) === 0)) {
        warnings.push({
          row: i + 1,
          type: 'high_qty_no_cost',
          message: `Large quantity adjustment (${available}) but no unit cost specified - consider adding cost data for accounting`
        });
      }
    }
  }
  
  return warnings;
}

/**
 * Business logic warnings for Calendar ICS
 */
function checkCalendarIcsLogic(
  rows: any[],
  template: Template,
  mapping: GuessMappingResult
): BusinessWarning[] {
  const warnings: BusinessWarning[] = [];
  const now = new Date();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const titleHeader = mapping['title'];
    const startHeader = mapping['start'];
    const endHeader = mapping['end'];

    // Get values
    const title = titleHeader ? row[titleHeader] : null;
    const startStr = startHeader ? row[startHeader] : null;
    const endStr = endHeader ? row[endHeader] : null;

    // Parse dates
    const startDate = startStr ? parseFlexibleDate(String(startStr).trim(), true) : null;
    const endDate = endStr ? parseFlexibleDate(String(endStr).trim(), true) : null;

    // Check: End time before start time
    if (startDate && endDate && endDate < startDate) {
      warnings.push({
        row: i + 1,
        type: 'end_before_start',
        message: `Event "${title || 'Untitled'}" has end time before start time`
      });
    }

    // Check: Events in the past (more than 1 year ago)
    if (startDate) {
      const oneYearAgo = new Date(now);
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      if (startDate < oneYearAgo) {
        warnings.push({
          row: i + 1,
          type: 'event_far_past',
          message: `Event "${title || 'Untitled'}" is more than 1 year in the past (${startDate.toLocaleDateString()})`
        });
      }
    }

    // Check: Events far in the future (more than 5 years)
    if (startDate) {
      const fiveYearsFromNow = new Date(now);
      fiveYearsFromNow.setFullYear(fiveYearsFromNow.getFullYear() + 5);
      if (startDate > fiveYearsFromNow) {
        warnings.push({
          row: i + 1,
          type: 'event_far_future',
          message: `Event "${title || 'Untitled'}" is more than 5 years in the future (${startDate.toLocaleDateString()})`
        });
      }
    }

    // Check: Very long events (more than 7 days)
    if (startDate && endDate) {
      const durationMs = endDate.getTime() - startDate.getTime();
      const durationDays = durationMs / (1000 * 60 * 60 * 24);
      if (durationDays > 7) {
        warnings.push({
          row: i + 1,
          type: 'very_long_event',
          message: `Event "${title || 'Untitled'}" spans ${Math.round(durationDays)} days - verify this is intentional`
        });
      }
    }

    // Check: Empty or generic titles
    if (title) {
      const titleStr = String(title).trim().toLowerCase();
      if (titleStr.length < 2) {
        warnings.push({
          row: i + 1,
          type: 'short_title',
          message: `Event has very short title "${title}" - consider adding more detail`
        });
      }
      if (['test', 'meeting', 'event', 'untitled', 'tbd', 'n/a'].includes(titleStr)) {
        warnings.push({
          row: i + 1,
          type: 'generic_title',
          message: `Event has generic title "${title}" - consider making it more descriptive`
        });
      }
    }
  }

  return warnings;
}

/**
 * Validate rows against template and mapping
 */
export function validateRows(
  rows: any[],
  template: Template,
  mapping: GuessMappingResult
): ValidationResult {
  const errors: ValidationError[] = [];
  let okCount = 0;
  
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let rowHasError = false;
    
    for (const field of template.fields) {
      const sourceHeader = mapping[field.key];
      if (!sourceHeader) {
        // Skip unmapped fields unless required
        if (field.required) {
          errors.push({
            row: i + 1,
            field: field.label,
            issue: 'Field not mapped',
          });
          rowHasError = true;
        }
        continue;
      }
      
      let value = row[sourceHeader];
      
      // Apply transforms
      value = applyTransforms(value, field.transform);
      
      // Validate
      const error = validateValue(value, field, sourceHeader);
      if (error) {
        errors.push({
          row: i + 1,
          field: field.label,
          issue: error,
          value,
        });
        rowHasError = true;
      }
    }
    
    if (!rowHasError) {
      okCount++;
    }
  }
  
  // Check for business logic warnings
  const businessWarnings = checkBusinessLogic(rows, template, mapping);

  return {
    okCount,
    errorCount: rows.length - okCount,
    sampleErrors: errors.slice(0, 10), // First 10 errors
    businessWarnings: businessWarnings.slice(0, 10), // First 10 warnings
  };
}

/**
 * Apply mapping and transforms to produce clean CSV
 */
export function applyMapping(
  rows: any[],
  template: Template,
  mapping: GuessMappingResult
): MappingResult {
  const headers = template.fields.map(field => field.label);
  const mappedRows = [];
  
  for (const row of rows) {
    const mappedRow: any = {};
    
    for (const field of template.fields) {
      const sourceHeader = mapping[field.key];
      let value = sourceHeader ? row[sourceHeader] : '';
      
      // Apply transforms
      value = applyTransforms(value, field.transform);
      
      // Use field label as the output header
      mappedRow[field.label] = value;
    }
    
    mappedRows.push(mappedRow);
  }
  
  return {
    headers,
    rows: mappedRows,
  };
}