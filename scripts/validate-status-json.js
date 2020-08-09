const ajv = require('ajv');
const validator = new ajv({
  $data: true,
  allErrors: true,
  logger: false,
  schemaId: 'id',
  useDefaults: true,
  verbose: true
});

const schema = require('./schema.json');
const statusData = require('./../status.json');
const validate = validator.compile(schema);

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if (!validate(statusData)) {
  console.error(validate.errors);
  process.exit(1);
} else {
  console.log("status.json validated - no errors.");
  process.exit(0);
}
