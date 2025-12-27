#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as Papa from 'papaparse';
import { templates, guessMapping, applyMapping, validateRows, generateICS, Template, GuessMappingResult } from '@calendarmap/engine';

const program = new Command();

program
  .name('calendarmap')
  .description('Convert CSV events to ICS calendar format')
  .version('1.0.0');

program
  .command('map')
  .description('Apply a mapping to transform CSV data')
  .requiredOption('--schema <schema>', 'Target schema (calendar-ics)')
  .requiredOption('--mapping <file>', 'Mapping JSON file')
  .option('--input <file>', 'Input CSV file (default: stdin)')
  .option('--output <file>', 'Output CSV file (default: stdout)')
  .action(async (options) => {
    try {
      const template = templates[options.schema as keyof typeof templates];
      if (!template) {
        console.error(`Unknown schema: ${options.schema}`);
        process.exit(1);
      }

      // Read mapping
      const mappingJson = fs.readFileSync(options.mapping, 'utf8');
      const mapping: GuessMappingResult = JSON.parse(mappingJson);

      // Read input CSV
      const inputData = options.input ? fs.readFileSync(options.input, 'utf8') : readStdin();
      
      // Parse CSV
      const parsed = Papa.parse(inputData, { header: true, skipEmptyLines: true });
      if (parsed.errors.length > 0) {
        console.error('CSV parsing errors:', parsed.errors);
        process.exit(1);
      }

      let output: string;

      if (options.schema === 'calendar-ics') {
        // Generate ICS format for calendar schema
        // Read directly from original CSV data using the mapping
        // mapping maps our field keys (e.g., 'title') to user's column names (e.g., 'Subject')
        const csvData = parsed.data as any[];
        const events = csvData.map(row => {
          // Helper to get value from row using our field key
          const getValue = (fieldKey: string): string => {
            const userColumn = mapping[fieldKey];
            if (!userColumn) return '';
            const value = row[userColumn];
            if (value === null || value === undefined) return '';
            return String(value).trim();
          };

          const allDayValue = getValue('all_day').toLowerCase();
          const isAllDay = ['true', '1', 'yes', 'y', 'on'].includes(allDayValue);

          return {
            title: getValue('title'),
            start: getValue('start'),
            end: getValue('end'),
            duration: getValue('duration'),
            all_day: isAllDay,
            timezone: getValue('timezone') || 'UTC',
            location: getValue('location'),
            description: getValue('description'),
            url: getValue('url'),
            uid: getValue('uid'),
            organizer: getValue('organizer'),
            attendees: getValue('attendees'),
          };
        });

        output = generateICS(events, 'UTC');
      } else {
        // Apply mapping for non-calendar schemas
        const result = applyMapping(parsed.data as any[], template, mapping);
        // Generate CSV for other schemas
        output = Papa.unparse({
          fields: result.headers,
          data: result.rows
        });
      }

      // Write output
      if (options.output) {
        fs.writeFileSync(options.output, output);
      } else {
        console.log(output);
      }

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('guess')
  .description('Generate a mapping file by guessing from CSV headers')
  .requiredOption('--schema <schema>', 'Target schema (calendar-ics)')
  .option('--input <file>', 'Input CSV file (default: stdin)')
  .option('--output <file>', 'Output mapping JSON file (default: stdout)')
  .action(async (options) => {
    try {
      const template = templates[options.schema as keyof typeof templates];
      if (!template) {
        console.error(`Unknown schema: ${options.schema}`);
        process.exit(1);
      }

      // Read input CSV
      const inputData = options.input ? fs.readFileSync(options.input, 'utf8') : readStdin();
      
      // Parse CSV to get headers
      const parsed = Papa.parse(inputData, { header: true, preview: 1 });
      if (parsed.errors.length > 0) {
        console.error('CSV parsing errors:', parsed.errors);
        process.exit(1);
      }

      const headers = parsed.meta.fields || [];
      
      // Generate mapping
      const mapping = guessMapping(headers, template);
      
      // Output mapping JSON
      const mappingJson = JSON.stringify(mapping, null, 2);
      
      if (options.output) {
        fs.writeFileSync(options.output, mappingJson);
      } else {
        console.log(mappingJson);
      }

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate CSV data against a schema and mapping')
  .requiredOption('--schema <schema>', 'Target schema')
  .requiredOption('--mapping <file>', 'Mapping JSON file')
  .option('--input <file>', 'Input CSV file (default: stdin)')
  .action(async (options) => {
    try {
      const template = templates[options.schema as keyof typeof templates];
      if (!template) {
        console.error(`Unknown schema: ${options.schema}`);
        process.exit(1);
      }

      const mappingJson = fs.readFileSync(options.mapping, 'utf8');
      const mapping: GuessMappingResult = JSON.parse(mappingJson);

      const inputData = options.input ? fs.readFileSync(options.input, 'utf8') : readStdin();
      
      const parsed = Papa.parse(inputData, { header: true, skipEmptyLines: true });
      if (parsed.errors.length > 0) {
        console.error('CSV parsing errors:', parsed.errors);
        process.exit(1);
      }

      const validation = validateRows(parsed.data as any[], template, mapping);
      
      console.log(`✅ ${validation.okCount} rows valid`);
      console.log(`❌ ${validation.errorCount} rows with errors`);
      
      if (validation.sampleErrors.length > 0) {
        console.log('\nSample errors:');
        validation.sampleErrors.forEach(error => {
          console.log(`Row ${error.row}, ${error.field}: ${error.issue}`);
        });
      }

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

function readStdin(): string {
  return fs.readFileSync(process.stdin.fd, 'utf8');
}

program.parse();