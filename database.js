const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');
const config = {
  databaseUrl: 'mongodb://localhost/sally-coaching'
};

// Connect to Database
mongoose.Promise = global.Promise;
mongoose.connect(config.databaseUrl);

mongoose.connection.on('error', () => {
  console.log(`Failed to connect to ${config.databaseUrl}. Please ensure MongoDB is running.`);
});

// Create the UserProfile stuff
const UserProfileSchema = new mongoose.Schema({
  examinerId: String,      // The person this profile is for (Google ID)
  examinees: [{
    id: String,            // ShortID for convenience
    examineeName: String,  // Identify the examinees by name
    examineeLogs: [{
      logDate: Number,     // The date this log is for (timestamp)

      lessonObservation: Boolean,     // Question 3
      rolePlayOrModelling: Boolean,
      discussedCoreIssue: Boolean,
      identifiedActionStepToAddressCoreIssue: Boolean,
      developedFutureLessonPlan: Boolean,
      dataScrutiny: Boolean,
      bookScrutiny: Boolean,
      reviewedLessonPlan: Boolean,
      other: String,

      goalChanges: [{        // Question 4
        goalName: String,    // Name of goal
        goalChange: Number   // Change in goal from previous week
      }],

      actionSteps: [{        // Question 5
        actionName: String,
        milestone: String,
        dateForCompletion: String,
      }]
    }]
  }]
});
UserProfileSchema.plugin(findOrCreate);
UserProfile = mongoose.model('UserProfile', UserProfileSchema);

function getUserProfile(examinerId, cb) {
  UserProfile.findOrCreate(
    {examinerId: examinerId},
    {
      examinerId: examinerId,
      examinees: []
    },
    cb
  );
}

function updateUserProfile(examinerId, updatedExaminees, cb) {
  UserProfile.findOneAndUpdate(
    {examinerId: examinerId},
    {$set: {examinees: updatedExaminees}}
  ).exec(cb);
}

module.exports = {
  getUserProfile: getUserProfile,
  updateUserProfile: updateUserProfile
};
