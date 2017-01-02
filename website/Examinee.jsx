const _ = require('lodash');
const moment = require('moment');
const update = require('react-addons-update');
const request = require('request');
const React = require('react');
const ReactBootstrap = require('react-bootstrap');

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Checkbox = ReactBootstrap.Checkbox;
const Table = ReactBootstrap.Table;

const Log = require('./Log.jsx');

const Examinee = React.createClass({
  saveLog(log, isNew, cb) {
    const examineeIndex = _.findIndex(this.props.profile.examinees, {
      _id: this.props.examinee._id
    });
    if (examineeIndex === -1) {
      console.log('SOMETHING IS REALLY BAD');
      return cb('ERROR SAVING');
    }

    let newExaminees;
    if (isNew) {
      newExaminees = update(this.props.profile, {
        examinees: {[examineeIndex]: {examineeLogs: {$push: [log]}}}
      });
    } else {
      const logIndex = _.findIndex(this.props.profile.examinees[examineeIndex].examineeLogs, {
        logDate: log.logDate
      });
      newExaminees = update(this.props.profile, {
        examinees: {[examineeIndex]: {examineeLogs: {[logIndex]: {$set: log}}}}
      });
    }

    console.log('Updating profile with data:');
    console.log(newExaminees);

    request({
      method: 'POST',
      url: `${window.location.origin}/api/updateProfile`,
      json: {updatedExaminees: newExaminees.examinees}
    }, (err, res) => {
      if (err) {
        console.log('Error updating user profile:');
        console.log(err);
        return cb('ERROR SAVING');
      } else {
        console.log('Update successful!');
        return cb('Saved!');
      }
    });
  },

  render() {
    if (this.props.children) {
      const logDate = +this.props.params.logDate;

      // Display single (existing) log
      if (logDate) {
        const log = _.find(this.props.examinee.examineeLogs, {logDate: logDate});

        if (!log)
          return (
            <div>
              <h3>{this.props.examinee.examineeName}</h3>
              <br/>
              <h3>Log {moment(logDate).format('DD/MM/YYYY')} not found!</h3>
            </div>
          );

        return (
          <div>
            <h3>{this.props.examinee.examineeName}</h3>
            <br/>
            {React.cloneElement(React.Children.only(this.props.children), _.assign({},
              this.props,
              {
                log: log,
                onSaveLog: this.saveLog
              }
            ))}
          </div>
        );
      }

      // Display LogList
      return (
        <div>
          <h3>{this.props.examinee.examineeName}</h3>
          <br/>
          {React.cloneElement(React.Children.only(this.props.children), this.props)}
        </div>
      );
    }

    console.log('Create Blank Log', this.props);

    let lastLog;
    for (let log of this.props.examinee.examineeLogs) {
      if (!lastLog || log.logDate > lastLog.logDate)
        lastLog = log;
    }
    let goalChanges = lastLog ? lastLog.goalChanges.map(goal => ({
      goalName: goal.goalName,
      goalChange: 0
    })) : [];

    let blankLog = {
      logDate: Date.now(),
      lessonObservation: false,
      rolePlayOrModelling: false,
      discussedCoreIssue: false,
      identifiedActionStepToAddressCoreIssue: false,
      developedFutureLessonPlan: false,
      dataScrutiny: false,
      bookScrutiny: false,
      reviewedLessonPlan: false,
      other: '',
      goalChanges: goalChanges,
      actionSteps: []
    }
    return (
      <div>
        <h3>{this.props.examinee.examineeName}</h3>
        <br/>
        <Log {...this.props} isNew log={blankLog} onSaveLog={this.saveLog}/>
      </div>
    );
  }
});

const ExamineeContainer = React.createClass({
  render() {
    let found;
    for (let examinee of this.props.profile.examinees)
      if (examinee.id === this.props.params.examineeId)
        found = examinee;

    if (found)
      return <Examinee {...this.props} examinee={found}/>;
    return <div>Examinee ID: {this.props.params.examineeId} not found!</div>;
  }
});

module.exports = ExamineeContainer;
