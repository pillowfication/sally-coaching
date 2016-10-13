const uuid = require('uuid');
const prompt = require('prompt');
const jsonfile = require('jsonfile');

const FILE_LOCATION = 'config.json';

let currSettings;
try {
  currSettings = jsonfile.readFileSync(FILE_LOCATION);
} catch (err) {
  currSettings = {};
}

let schema = [{
  name: 'CLIENT_ID',
  description: 'Client ID',
  default: currSettings.CLIENT_ID
}, {
  name: 'CLIENT_SECRET',
  description: 'Client Secret',
  default: currSettings.CLIENT_SECRET
}];

let expressSecret = currSettings.EXPRESS_SECRET || uuid.v4();

prompt.start();

prompt.get(schema, (error, result) => {
  result.EXPRESS_SECRET = expressSecret;

  try {
    jsonfile.writeFileSync(FILE_LOCATION, result, {spaces: 2});
  } catch (error) {
    console.log(`Error creating '${FILE_LOCATION}'. Please try again.`);
    console.log(error);
  }
});
