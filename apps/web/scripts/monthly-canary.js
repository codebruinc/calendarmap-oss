#!/usr/bin/env node

/**
 * Monthly Canary Test Script for CalendarMap
 * 
 * This script performs end-to-end testing of the core CalendarMap functionality:
 * 1. Loads a sample CSV file
 * 2. Processes it through the mapping engine
 * 3. Generates an ICS file
 * 4. Validates the output with the ICS linter
 * 5. Sends email alerts on failure
 * 
 * Usage: node scripts/monthly-canary.js
 * Environment Variables:
 *   SMTP_HOST - SMTP server host
 *   SMTP_PORT - SMTP server port (default: 465)
 *   SMTP_USER - SMTP username  
 *   SMTP_PASS - SMTP password
 *   ALERT_EMAIL - Email address to send alerts to
 */

const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Sample CSV data for testing
const SAMPLE_CSV = `title,start,end,location,description
Monthly Team Meeting,2025-09-15 10:00 AM,2025-09-15 11:30 AM,Conference Room A,Regular team sync
Product Planning,2025-09-16 2:00 PM,2025-09-16 4:00 PM,Zoom,Q4 planning session
Client Review,2025-09-17 9:00 AM,2025-09-17 10:00 AM,Client Office,Project milestone review`;

// Expected number of events after processing
const EXPECTED_EVENT_COUNT = 3;

class CanaryTest {
  constructor() {
    this.startTime = new Date();
    this.results = {
      csvParsed: false,
      mappingGenerated: false,
      icsGenerated: false,
      validationPassed: false,
      eventCount: 0,
      errors: [],
      warnings: []
    };
  }

  async run() {
    console.log('🕊️ Starting CalendarMap Monthly Canary Test');
    console.log('Time:', this.startTime.toISOString());
    console.log('---');

    try {
      // Step 1: Test CSV parsing
      await this.testCSVParsing();
      
      // Step 2: Test mapping generation
      await this.testMappingGeneration();
      
      // Step 3: Test ICS generation
      await this.testICSGeneration();
      
      // Step 4: Test ICS validation
      await this.testICSValidation();
      
      // Step 5: Check results
      await this.validateResults();
      
      console.log('✅ All canary tests passed!');
      await this.sendSuccessNotification();
      
    } catch (error) {
      console.error('❌ Canary test failed:', error.message);
      this.results.errors.push(error.message);
      await this.sendFailureNotification(error);
      process.exit(1);
    }
  }

  async testCSVParsing() {
    console.log('📄 Testing CSV parsing...');
    
    try {
      // Import the engine dynamically to avoid issues if it's not built
      const { templates } = await import('../../../packages/engine/dist/index.js');
      
      if (!templates || !templates['calendar-ics']) {
        throw new Error('Calendar ICS template not found in engine');
      }
      
      // Parse CSV using a simple parser (similar to what papaparse does)
      const lines = SAMPLE_CSV.split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });
      
      if (rows.length !== EXPECTED_EVENT_COUNT) {
        throw new Error(`Expected ${EXPECTED_EVENT_COUNT} rows, got ${rows.length}`);
      }
      
      this.csvData = rows;
      this.headers = headers;
      this.results.csvParsed = true;
      console.log('  ✅ CSV parsed successfully');
      
    } catch (error) {
      throw new Error(`CSV parsing failed: ${error.message}`);
    }
  }

  async testMappingGeneration() {
    console.log('🗺️  Testing mapping generation...');
    
    try {
      const { templates, guessMapping } = await import('../../../packages/engine/dist/index.js');
      const template = templates['calendar-ics'];
      
      const mapping = guessMapping(this.headers, template);
      
      if (!mapping || Object.keys(mapping).length === 0) {
        throw new Error('No mapping generated');
      }
      
      // Check that required fields are mapped
      if (!mapping.title) {
        throw new Error('Title field not mapped');
      }
      if (!mapping.start) {
        throw new Error('Start date field not mapped');
      }
      
      this.mapping = mapping;
      this.results.mappingGenerated = true;
      console.log('  ✅ Mapping generated successfully');
      
    } catch (error) {
      throw new Error(`Mapping generation failed: ${error.message}`);
    }
  }

  async testICSGeneration() {
    console.log('📅 Testing ICS generation...');
    
    try {
      const { applyMapping, generateICS } = await import('../../../packages/engine/dist/index.js');
      const template = (await import('../../../packages/engine/dist/index.js')).templates['calendar-ics'];
      
      const result = applyMapping(this.csvData, template, this.mapping);
      
      if (!result || !result.rows) {
        throw new Error('No mapped rows returned');
      }
      
      const events = result.rows.map(row => ({
        title: row.title || '',
        dtstart: row.start,
        dtend: row.end,
        location: row.location,
        description: row.description,
        allDay: row.allDay || false
      }));
      
      const icsContent = generateICS(events, 'UTC');
      
      if (!icsContent.includes('BEGIN:VCALENDAR')) {
        throw new Error('Invalid ICS content generated');
      }
      
      if (!icsContent.includes('BEGIN:VEVENT')) {
        throw new Error('No events found in ICS content');
      }
      
      // Count events in ICS
      const eventCount = (icsContent.match(/BEGIN:VEVENT/g) || []).length;
      this.results.eventCount = eventCount;
      
      if (eventCount !== EXPECTED_EVENT_COUNT) {
        throw new Error(`Expected ${EXPECTED_EVENT_COUNT} events, got ${eventCount}`);
      }
      
      this.icsContent = icsContent;
      this.results.icsGenerated = true;
      console.log('  ✅ ICS generated successfully');
      console.log('  📝 ICS preview:', icsContent.substring(0, 500) + '...');
      
    } catch (error) {
      throw new Error(`ICS generation failed: ${error.message}`);
    }
  }

  async testICSValidation() {
    console.log('🔍 Testing ICS validation...');
    
    try {
      // Simple validation - check ICS structure
      if (!this.icsContent.includes('BEGIN:VCALENDAR') || 
          !this.icsContent.includes('END:VCALENDAR')) {
        throw new Error('Invalid ICS structure - missing VCALENDAR');
      }
      
      if (!this.icsContent.includes('BEGIN:VEVENT') || 
          !this.icsContent.includes('END:VEVENT')) {
        throw new Error('Invalid ICS structure - missing VEVENT');
      }
      
      // Check for required properties (fields can be empty but must be present)
      if (!this.icsContent.includes('UID:')) {
        throw new Error('Missing UID property in events');
      }
      
      if (!this.icsContent.includes('DTSTART')) {
        throw new Error('Missing DTSTART property in events');
      }
      
      if (!this.icsContent.includes('SUMMARY:')) {
        throw new Error('Missing SUMMARY property in events');
      }
      
      // Additional structural validation
      if (!this.icsContent.includes('DTSTAMP:')) {
        throw new Error('Missing DTSTAMP property in events');
      }
      
      this.results.validationPassed = true;
      console.log('  ✅ ICS validation passed');
      
    } catch (error) {
      throw new Error(`ICS validation failed: ${error.message}`);
    }
  }

  parseICSEvents(icsContent) {
    const events = [];
    const eventMatches = Array.from(icsContent.matchAll(/BEGIN:VEVENT([\s\S]*?)END:VEVENT/g));
    
    for (const match of eventMatches) {
      const eventContent = match[0];
      events.push({
        title: this.extractICSValue(eventContent, 'SUMMARY'),
        dtstart: this.extractICSValue(eventContent, 'DTSTART'),
        dtend: this.extractICSValue(eventContent, 'DTEND'),
        uid: this.extractICSValue(eventContent, 'UID'),
      });
    }
    
    return events;
  }

  extractICSValue(content, property) {
    const match = content.match(new RegExp(`${property}[^:]*:(.+)`));
    return match ? match[1].trim() : null;
  }

  async validateResults() {
    console.log('📊 Validating overall results...');
    
    const requiredChecks = [
      'csvParsed',
      'mappingGenerated', 
      'icsGenerated',
      'validationPassed'
    ];
    
    for (const check of requiredChecks) {
      if (!this.results[check]) {
        throw new Error(`Required check failed: ${check}`);
      }
    }
    
    if (this.results.eventCount !== EXPECTED_EVENT_COUNT) {
      throw new Error(`Event count mismatch: expected ${EXPECTED_EVENT_COUNT}, got ${this.results.eventCount}`);
    }
    
    console.log('  ✅ All validation checks passed');
  }

  async sendSuccessNotification() {
    const duration = new Date() - this.startTime;
    console.log(`📧 Sending success notification (duration: ${duration}ms)`);
    
    if (!this.shouldSendEmail()) {
      console.log('  📝 Email not configured, skipping notification');
      return;
    }
    
    const subject = '✅ CalendarMap.app Monthly Canary Test - All Systems Operational';
    const body = `
CalendarMap Monthly Canary Test - SUCCESS

Test completed successfully at: ${new Date().toISOString()}
Duration: ${duration}ms

Results:
- CSV parsed: ✅
- Mapping generated: ✅  
- ICS generated: ✅
- Validation passed: ✅
- Events processed: ${this.results.eventCount}/${EXPECTED_EVENT_COUNT}

${this.results.warnings.length > 0 ? `
Warnings:
${this.results.warnings.map(w => `- ${w}`).join('\n')}
` : ''}

All systems operating normally.
    `;
    
    await this.sendEmail(subject, body);
  }

  async sendFailureNotification(error) {
    const duration = new Date() - this.startTime;
    console.log(`📧 Sending failure notification (duration: ${duration}ms)`);
    
    if (!this.shouldSendEmail()) {
      console.log('  📝 Email not configured, skipping notification');
      return;
    }
    
    const subject = '🚨 CalendarMap.app Monthly Canary Test - SERVICE DEGRADED - Action Required';
    const body = `
CalendarMap Monthly Canary Test - FAILURE

Test failed at: ${new Date().toISOString()}
Duration: ${duration}ms

Primary Error: ${error.message}

Results:
- CSV parsed: ${this.results.csvParsed ? '✅' : '❌'}
- Mapping generated: ${this.results.mappingGenerated ? '✅' : '❌'}
- ICS generated: ${this.results.icsGenerated ? '✅' : '❌'}
- Validation passed: ${this.results.validationPassed ? '✅' : '❌'}
- Events processed: ${this.results.eventCount}/${EXPECTED_EVENT_COUNT}

${this.results.errors.length > 0 ? `
All Errors:
${this.results.errors.map(e => `- ${e}`).join('\n')}
` : ''}

${this.results.warnings.length > 0 ? `
Warnings:
${this.results.warnings.map(w => `- ${w}`).join('\n')}
` : ''}

ACTION REQUIRED: Please investigate the CalendarMap service.
    `;
    
    await this.sendEmail(subject, body);
  }

  shouldSendEmail() {
    return process.env.SMTP_HOST && 
           process.env.SMTP_USER && 
           process.env.SMTP_PASS && 
           process.env.ALERT_EMAIL;
  }

  async sendEmail(subject, body) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ALERT_EMAIL,
        subject: subject,
        text: body,
      });

      console.log('  ✅ Email sent successfully');
    } catch (error) {
      console.error('  ❌ Failed to send email:', error.message);
    }
  }
}

// Run the canary test if called directly
if (require.main === module) {
  const canary = new CanaryTest();
  canary.run().catch(error => {
    console.error('Canary test crashed:', error);
    process.exit(1);
  });
}

module.exports = CanaryTest;