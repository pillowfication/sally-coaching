const mongoose = require('mongoose');
const config = {
  databaseUrl: 'mongodb://localhost/db'
};

mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUrl);

mongoose.connection.on('error', () => {
  console.log(`Failed to connect to ${config.databaseUrl}. Please ensure MongoDB is running.`);
});

const UserLog = mongoose.model('UserLog', new mongoose.Schema({
  examinerId: String,
  examineeName: String,
  someField1: String,
  someField2: String
}));

function createNewLog(examinerId, examineeName, cb) {
  let log = new UserLog({
    examinerId: examinerId,
    examineeName: examineeName,
    someField1: '',
    someField2: ''
  });
  log.save(cb);
}

function updateLog(logId, cb) {

}

function getAllLogs(examinerId, cb) {
  UserLog.find({examinerId: examinerId}).exec(cb);
}

module.exports = {
  createNewLog: createNewLog,
  updateLog: updateLog,
  getAllLogs: getAllLogs
};
