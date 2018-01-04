const schema = require('./schema.json');
const statusData = require('./../status.json');
const validator = require('is-my-json-valid');
const validate = validator(schema, {
  greedy: true,
  verbose: true
});

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if (!validate(statusData)) {
  console.error(validate.errors);
  process.exit(1);
} else {
  process.exit(0);
}
