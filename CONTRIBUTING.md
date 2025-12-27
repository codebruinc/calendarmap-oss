# Contributing to SchemaMap

Thank you for your interest in contributing! This guide will help you get started.

## 🚀 Quick Development Setup

```bash
# Clone the repository
git clone https://github.com/codebruinc/schemamap.git
cd schemamap

# Install dependencies
pnpm install

# Build all packages
pnpm -r build

# Start development server
pnpm --filter @schemamap/web dev
```

The web app will be available at `http://localhost:3000`.

## 📦 Project Structure

- **`packages/engine/`** - Core TypeScript engine (mapping logic, validation, templates)
- **`packages/cli/`** - Node.js command-line interface
- **`apps/web/`** - Next.js web application
- **Sample CSVs** - Located in `apps/web/public/samples/`

## 🎯 How to Add a New Schema

### 1. Create the Template

Add your template to `packages/engine/src/templates/`:

```typescript
// packages/engine/src/templates/my-new-schema.ts
import { Template } from '../types';

export const myNewSchemaTemplate: Template = {
  key: 'my-new-schema',
  title: 'My New Schema',
  notes: [
    'Important validation rules',
    'Common gotchas to avoid',
  ],
  fields: [
    {
      key: 'required_field',
      label: 'Required Field',
      required: true,
      type: 'string',
      transform: ['trim'],
      synonyms: ['alternative name', 'another name'],
    },
    // ... more fields
  ],
};
```

### 2. Export the Template

Add to `packages/engine/src/templates/index.ts`:

```typescript
import { myNewSchemaTemplate } from './my-new-schema';

export const templates = {
  // ... existing templates
  'my-new-schema': myNewSchemaTemplate,
} as const;

export { myNewSchemaTemplate };
```

### 3. Update Type Definitions

Add your schema key to the union type in `packages/engine/src/types.ts`:

```typescript
export type Template = {
  key: 'shopify-products' | 'shopify-inventory' | 'stripe-customers' | 'my-new-schema';
  // ... rest of type
};
```

### 4. Add Sample CSV

Create `apps/web/public/samples/my-new-schema-sample.csv` with realistic test data.

### 5. Update Web App

Add navigation link in `apps/web/app/page.tsx`:

```tsx
<Link 
  href="/map?schema=my-new-schema"
  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-2 transition-colors"
>
  Open My New Schema Mapper <ArrowRight className="w-5 h-5" />
</Link>
```

### 6. Add Documentation

Create `apps/web/app/docs/my-new-schema-csv-mapper/page.tsx` following the pattern of existing docs pages. Include:

- Step-by-step usage guide
- Common field mappings table
- JSON-LD schema markup for SEO
- Link to sample CSV download

### 7. Test Everything

```bash
# Build and test engine
pnpm --filter @schemamap/engine build
pnpm --filter @schemamap/engine test

# Test CLI
pnpm --filter @schemamap/cli build
echo "test,data" | schemamap guess --schema my-new-schema

# Test web app
pnpm --filter @schemamap/web dev
# Visit http://localhost:3000/map?schema=my-new-schema
```

## 🧪 Testing

### Engine Tests
```bash
cd packages/engine
pnpm test
```

### Manual Testing
1. Upload the sample CSV to your new schema mapper
2. Verify auto-mapping works correctly  
3. Check validation catches expected errors
4. Download and verify output CSV format

## 📝 Code Style

- **TypeScript strict mode** - All packages use strict TypeScript
- **Functional style** - Prefer pure functions and immutable data
- **Clear naming** - Use descriptive names for functions and variables
- **Comments** - Document complex mapping logic and validation rules

## 🚨 Important Guidelines

### Privacy & Security
- **Never upload CSVs to servers** - All processing must happen client-side
- **No external API calls** from core engine - Keep it pure and local
- **No tracking** - Don't add analytics or user tracking

### Performance
- **Large file support** - Engine must handle 100k+ row CSVs efficiently  
- **Memory conscious** - Don't load entire CSVs into memory unnecessarily
- **Browser compatible** - Code must work in browsers and Node.js

### Compatibility
- **No breaking changes** to engine API without major version bump
- **Backward compatibility** for mapping.json files
- **CLI stability** - Command signatures should remain stable

## 🔄 Development Workflow

1. **Fork** the repository
2. **Create feature branch** from `main`
3. **Make changes** following code style guidelines
4. **Add tests** if adding new functionality
5. **Test locally** with sample data
6. **Submit pull request** with clear description

## 📋 Pull Request Checklist

- [ ] Engine builds without errors (`pnpm --filter @schemamap/engine build`)
- [ ] CLI builds and runs (`pnpm --filter @schemamap/cli build`)
- [ ] Web app builds and deploys (`pnpm --filter @schemamap/web build`)
- [ ] Sample CSV provided for new schemas
- [ ] Documentation updated
- [ ] No breaking changes to existing API
- [ ] Follows privacy-first principles

## 🆘 Getting Help

- **GitHub Issues** - Ask questions or report bugs
- **Discussions** - General questions and feature ideas
- **Discord** - Real-time chat with maintainers (coming soon)

## 🎉 Recognition

Contributors will be recognized in:
- README.md credits section
- GitHub contributors page  
- Release notes for significant contributions

Thank you for helping make CSV mapping accessible to everyone! 🙌