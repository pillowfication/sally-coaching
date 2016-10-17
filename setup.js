const fs = require('fs');
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

// Copy the CSS thing
((source, target, cb) => {
  console.log('Copying `bootstrap.min.css`...');
  let cbCalled = false;
  let rd = fs.createReadStream(source);
  rd.on('error', function(err) {
    done(err);
  });
  let wr = fs.createWriteStream(target);
  wr.on('error', function(err) {
    done(err);
  });
  wr.on('close', function(ex) {
    done();
  });
  rd.pipe(wr);
  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
})(
  './node_modules/bootstrap/dist/css/bootstrap.min.css',
  './website/bootstrap.css',
  (err) => {
    if (err)
      throw new Error('Error occurred when copying `bootstrap.min.css`');
    else {
      console.log('Copying successful!');
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
    }
  }
);
