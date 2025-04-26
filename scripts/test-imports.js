#!/usr/bin/env node

/**
 * Script to test OpenZeppelin imports in the Solidity compiler
 */

const { testOpenZeppelinImport } = require("../app/core/test-imports");

console.log("🔍 Testing OpenZeppelin imports...");

try {
  const success = testOpenZeppelinImport();
  if (success) {
    console.log("✅ OpenZeppelin imports are working correctly");
    process.exit(0);
  } else {
    console.log("❌ OpenZeppelin imports test failed");
    process.exit(1);
  }
} catch (error) {
  console.error("Error running test:", error);
  process.exit(1);
}
