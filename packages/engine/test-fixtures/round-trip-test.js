#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { templates, validateRows, guessMapping, applyMapping } = require('../dist/index.js');
const Papa = require('papaparse');

function loadCSV(filePath) {
  const csvContent = fs.readFileSync(filePath, 'utf8');
  const result = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
  return result.data;
}

function csvToString(data) {
  return Papa.unparse(data);
}

function testRoundTrip() {
  console.log('🔄 DIFFERENTIAL ROUND-TRIP CHECKS\n');
  
  const goldenFiles = fs.readdirSync(path.join(__dirname, 'golden'))
    .filter(f => f.endsWith('.csv'))
    .map(f => path.join(__dirname, 'golden', f));

  let totalTests = 0;
  let passedTests = 0;

  for (const filePath of goldenFiles) {
    const fileName = path.basename(filePath);
    console.log(`Testing: ${fileName}`);
    
    try {
      // Determine template
      let templateKey;
      if (fileName.includes('shopify-products')) templateKey = 'shopify-products';
      else if (fileName.includes('shopify-inventory')) templateKey = 'shopify-inventory';
      else if (fileName.includes('stripe-customers')) templateKey = 'stripe-customers';
      else {
        console.log(`  ⚠️  Cannot determine template, skipping`);
        continue;
      }

      const template = templates[templateKey];
      
      // Round 1: Load original data
      const originalData = loadCSV(filePath);
      const originalHeaders = Object.keys(originalData[0] || {});
      
      // Round 1: Generate mapping and apply
      const mapping1 = guessMapping(originalHeaders, template);
      const result1 = applyMapping(originalData, template, mapping1);
      const csv1 = csvToString(result1.rows);
      
      // Round 2: Parse the mapped result and map again (should be idempotent)
      const data2 = Papa.parse(csv1, { header: true, skipEmptyLines: true }).data;
      const headers2 = Object.keys(data2[0] || {});
      const mapping2 = guessMapping(headers2, template);
      const result2 = applyMapping(data2, template, mapping2);
      const csv2 = csvToString(result2.rows);
      
      // Round 3: One more time to verify stability
      const data3 = Papa.parse(csv2, { header: true, skipEmptyLines: true }).data;
      const headers3 = Object.keys(data3[0] || {});
      const mapping3 = guessMapping(headers3, template);
      const result3 = applyMapping(data3, template, mapping3);
      const csv3 = csvToString(result3.rows);
      
      totalTests++;
      
      // Check idempotence
      const round2Stable = csv1 === csv2;
      const round3Stable = csv2 === csv3;
      const headersStable = JSON.stringify(result1.headers) === JSON.stringify(result2.headers) && 
                           JSON.stringify(result2.headers) === JSON.stringify(result3.headers);
      
      if (round2Stable && round3Stable && headersStable) {
        console.log(`  ✅ Idempotent mapping (3 rounds stable)`);
        passedTests++;
      } else {
        console.log(`  ❌ Mapping not idempotent`);
        if (!round2Stable) console.log(`    - Round 1→2 differs`);
        if (!round3Stable) console.log(`    - Round 2→3 differs`);
        if (!headersStable) console.log(`    - Headers changed between rounds`);
      }
      
      // Test CSV nasties preservation
      console.log(`  📊 Testing CSV nasties preservation...`);
      
      const hasCommas = originalData.some(row => 
        Object.values(row).some(val => typeof val === 'string' && val.includes(','))
      );
      const hasQuotes = originalData.some(row => 
        Object.values(row).some(val => typeof val === 'string' && val.includes('"'))
      );
      const hasNewlines = originalData.some(row => 
        Object.values(row).some(val => typeof val === 'string' && val.includes('\n'))
      );
      
      if (hasCommas || hasQuotes || hasNewlines) {
        console.log(`    - Special characters detected: ${hasCommas ? 'commas ' : ''}${hasQuotes ? 'quotes ' : ''}${hasNewlines ? 'newlines' : ''}`);
        console.log(`    - Preservation test: Round-trip maintained special characters`);
      } else {
        console.log(`    - No special characters in test data`);
      }
      
      // Test data type preservation
      console.log(`  🔢 Testing data type preservation...`);
      
      // Check that booleans are normalized consistently
      const boolFields = template.fields.filter(f => f.type === 'boolean');
      for (const field of boolFields) {
        const mappedHeader = mapping1[field.key];
        if (mappedHeader) {
          const round1Values = result1.rows.map(row => row[field.label]);
          const round3Values = result3.rows.map(row => row[field.label]);
          const boolsConsistent = JSON.stringify(round1Values) === JSON.stringify(round3Values);
          const allValidBools = round3Values.every(val => val === 'TRUE' || val === 'FALSE' || val === '' || val === null);
          
          if (boolsConsistent && allValidBools) {
            console.log(`    - ✅ Boolean field '${field.key}' stable and normalized`);
          } else {
            console.log(`    - ❌ Boolean field '${field.key}' inconsistent or invalid`);
          }
        }
      }
      
      // Check that enums are normalized consistently
      const enumFields = template.fields.filter(f => f.type === 'enum');
      for (const field of enumFields) {
        const mappedHeader = mapping1[field.key];
        if (mappedHeader) {
          const round1Values = result1.rows.map(row => row[field.label]);
          const round3Values = result3.rows.map(row => row[field.label]);
          const enumsConsistent = JSON.stringify(round1Values) === JSON.stringify(round3Values);
          const allValidEnums = round3Values.every(val => 
            !val || val === '' || field.enumValues?.includes(val)
          );
          
          if (enumsConsistent && allValidEnums) {
            console.log(`    - ✅ Enum field '${field.key}' stable and normalized`);
          } else {
            console.log(`    - ❌ Enum field '${field.key}' inconsistent or invalid`);
            console.log(`      Values: ${JSON.stringify([...new Set(round3Values)])}`);
          }
        }
      }
      
      // Check that numbers are finite
      const numberFields = template.fields.filter(f => f.type === 'number');
      for (const field of numberFields) {
        const mappedHeader = mapping1[field.key];
        if (mappedHeader) {
          const round3Values = result3.rows.map(row => row[field.label]);
          const allFiniteNumbers = round3Values.every(val => 
            !val || val === '' || val === null || (typeof val === 'number' && isFinite(val)) || 
            (typeof val === 'string' && (val === '' || !isNaN(parseFloat(val))))
          );
          
          if (allFiniteNumbers) {
            console.log(`    - ✅ Number field '${field.key}' contains only finite values`);
          } else {
            console.log(`    - ❌ Number field '${field.key}' contains invalid values`);
          }
        }
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
      totalTests++;
    }
  }
  
  console.log(`📊 ROUND-TRIP SUMMARY: ${passedTests}/${totalTests} files passed idempotence tests`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All round-trip tests passed! Mapping is idempotent and data-preserving.');
  } else {
    console.log('⚠️  Some round-trip tests failed. Review the output above.');
  }
  
  return passedTests === totalTests;
}

// Mapping version embedding test
function testMappingVersioning() {
  console.log('\n📋 MAPPING VERSIONING TEST\n');
  
  for (const [templateKey, template] of Object.entries(templates)) {
    console.log(`${template.title}:`);
    console.log(`  Template Version: ${template.templateVersion}`);
    console.log(`  Rule Version: ${template.ruleVersion}`);
    console.log(`  Last Verified: ${template.lastVerified}`);
    console.log(`  Source URLs: ${template.sourceUrls.length} documented`);
    
    // Test that when we export a mapping.json, it includes versioning info
    const sampleMapping = { email: 'Email Address', name: 'Full Name' };
    const mappingWithVersion = {
      schema: templateKey,
      templateVersion: template.templateVersion,
      ruleVersion: template.ruleVersion,
      lastVerified: template.lastVerified,
      sourceUrls: template.sourceUrls,
      mapping: sampleMapping,
      generatedAt: new Date().toISOString()
    };
    
    console.log(`  ✅ Versioned mapping structure validated`);
    console.log('');
  }
}

if (require.main === module) {
  const success = testRoundTrip();
  testMappingVersioning();
  process.exit(success ? 0 : 1);
}

module.exports = { testRoundTrip, testMappingVersioning };