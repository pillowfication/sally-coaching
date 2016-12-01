const _ = require('lodash');
const React = require('react');
const ReactBootstrap = require('react-bootstrap');

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Checkbox = ReactBootstrap.Checkbox;
const Table = ReactBootstrap.Table;

const Log = require('./Log.jsx');

const Examinee = React.createClass({
  render() {
    if (this.props.children) {
      const logDate = this.props.params.logDate;
      const log = _.findBy(this.props.examinee.examineeLogs, {logDate: logDate});

      if (!log)
        return (
          <div>
            <h3>{this.props.examinee.examineeName}</h3>
            <br/>
            <h3>Log {logDate} not found!</h3>
          </div>
        );

      return (
        <div>
          <h3>{this.props.examinee.examineeName}</h3>
          <br/>
          {React.cloneElement(React.Children.only(this.props.children), _.assign(
            {},
            this.props,
            {examinee: this.props.examinee}
          ))}
        </div>
      );
    }

    console.log('Create Blank Log', this.props);
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
      goalChanges: [],
      actionSteps: []
    }
    return (
      <div>
        <h3>{this.props.examinee.examineeName}</h3>
        <br/>
        <Log {...this.props} isNew log={blankLog}/>
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
