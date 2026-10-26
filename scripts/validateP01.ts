/**
 * Validator for P-01 Planar Line Reflection Pattern Passport
 * Script: scripts/validateP01.ts
 *
 * Loads docs/patterns/P-01_PLANAR_LINE_REFLECTION.json from disk and audits it against
 * schemas/pattern-passport.schema.json using Ajv2020 (JSON Schema Draft 2020-12).
 */
import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';

console.log('================================================================');
console.log('  PCRS CANONICAL PATTERN PASSPORT VALIDATION: P-01               ');
console.log('================================================================\n');

const schemaPath = path.resolve(process.cwd(), 'schemas/pattern-passport.schema.json');
const passportPath = path.resolve(process.cwd(), 'docs/patterns/P-01_PLANAR_LINE_REFLECTION.json');

console.log(`Schema file:   ${schemaPath}`);
console.log(`Passport file: ${passportPath}\n`);

// 1. Read files
if (!fs.existsSync(schemaPath)) {
  console.error(`ERROR: Schema file not found at ${schemaPath}`);
  process.exit(1);
}
if (!fs.existsSync(passportPath)) {
  console.error(`ERROR: Passport file not found at ${passportPath}`);
  process.exit(1);
}

const rawSchema = fs.readFileSync(schemaPath, 'utf-8');
const rawPassport = fs.readFileSync(passportPath, 'utf-8');

let schemaObj: any;
let passportObj: any;

try {
  schemaObj = JSON.parse(rawSchema);
} catch (err: any) {
  console.error(`ERROR: Schema is not valid JSON: ${err.message}`);
  process.exit(1);
}

try {
  passportObj = JSON.parse(rawPassport);
} catch (err: any) {
  console.error(`ERROR: Passport is not valid JSON: ${err.message}`);
  process.exit(1);
}

// 2. Setup Ajv2020
const ajv = new Ajv2020({
  allErrors: true,
  strict: false,
});

const isSchemaValid = ajv.validateSchema(schemaObj);
if (!isSchemaValid) {
  console.error('ERROR: Schema is not compliant with Draft 2020-12:', ajv.errors);
  process.exit(1);
}
console.log('✓ Meta-validation: schemas/pattern-passport.schema.json is valid Draft 2020-12.');

const validate = ajv.compile(schemaObj);
const isValid = validate(passportObj);

if (isValid) {
  console.log('\n✓ PASSPORT VALIDATION RESULT: PASS (100% compliant with JSON Schema)');
  console.log(`  Pattern ID:       ${passportObj.identity?.pattern_id}`);
  console.log(`  Name:             ${passportObj.identity?.name}`);
  console.log(`  Lifecycle Status: ${passportObj.identity?.lifecycle_status}`);
  console.log(`  Evidence Status:  ${passportObj.evidence_and_provenance?.evidence_status}`);
  console.log(`  Domain:           ${passportObj.definition?.domain}`);
  console.log(`  Rule:             ${passportObj.definition?.rule}`);
  console.log(`  All 10 required top-level sections present:`);
  for (const key of Object.keys(passportObj)) {
    if (key !== '$schema') {
      console.log(`    - ${key}: OK`);
    }
  }
  console.log('\n================================================================');
  console.log('VERDICT: P-01 CANONICAL PATTERN PASSPORT IS VALID');
  console.log('================================================================\n');
  process.exit(0);
} else {
  console.error('\n✗ PASSPORT VALIDATION RESULT: FAIL');
  console.error('Errors found:');
  for (const err of validate.errors || []) {
    console.error(`  - Path: ${err.instancePath || '/'}, Keyword: ${err.keyword}, Message: ${err.message}`);
  }
  console.log('\n================================================================');
  console.log('VERDICT: P-01 DOES NOT MEET SCHEMA SPECIFICATION');
  console.log('================================================================\n');
  process.exit(1);
}
