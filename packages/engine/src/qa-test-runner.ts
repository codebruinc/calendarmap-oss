#!/usr/bin/env node

import { runQASuite, formatQAReport, runRoundTripTest, goldenCases } from './ics-qa-suite';
import { generateICS } from './ics-generator';

/**
 * ICS QA Test Runner
 * 
 * This script validates that our ICS generation meets the quality criteria:
 * - Golden cases: timed events with TZ; all-day events; events crossing DST
 * - Red cases: end < start; invalid TZID; unescaped commas/newlines; overly long lines
 * - Round-trip: map → export → re-import shows identical semantics
 */

function main() {
  console.log('🔍 Running ICS QA Suite...\n');

  // Run the main QA suite
  const results = runQASuite();
  console.log(formatQAReport(results));

  // Run round-trip tests on golden cases
  console.log('\n🔄 Running Round-Trip Tests...');
  console.log('================================');
  
  let roundTripPassed = 0;
  let roundTripTotal = 0;

  for (const testCase of goldenCases) {
    roundTripTotal++;
    const roundTrip = runRoundTripTest(testCase.events);
    
    if (roundTrip.passed) {
      roundTripPassed++;
      console.log(`✅ ${testCase.name}: Round-trip stable`);
    } else {
      console.log(`❌ ${testCase.name}: Round-trip failed`);
      roundTrip.differences.forEach(diff => {
        console.log(`   • ${diff}`);
      });
    }
  }

  console.log(`\nRound-Trip Results: ${roundTripPassed}/${roundTripTotal} passed`);

  // Generate sample ICS for manual inspection
  console.log('\n📋 Sample ICS Output (Golden Case):');
  console.log('===================================');
  
  const sampleICS = generateICS(goldenCases[0].events);
  console.log(sampleICS);

  // Final summary
  const allTestsPassed = results.failed === 0 && roundTripPassed === roundTripTotal;
  
  console.log('\n🏁 Final Results:');
  console.log('=================');
  console.log(`QA Suite: ${results.passed}/${results.total} passed`);
  console.log(`Round-Trip: ${roundTripPassed}/${roundTripTotal} passed`);
  console.log(`Overall Status: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);

  // Done when: all golden pass; each red produces a clear, actionable error; round-trip is stable
  if (allTestsPassed) {
    console.log('\n✅ QA Suite Complete: All golden cases pass, red cases produce clear errors, round-trip is stable.');
  } else {
    console.log('\n❌ QA Suite Failed: Fix the failing tests above.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { main as runQATestRunner };