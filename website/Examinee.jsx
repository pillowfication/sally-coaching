const React = require('react');

const Examinee = React.createClass({
  render() {
    return (
      <div>
        <h3>Placeholder page for {this.props.examinee.examineeName}</h3>
      </div>
    );
  }
});

const ExamineeContainer = React.createClass({
  render() {
    let examinee;
    for (let log of this.props.logs)
      if (log._id === this.props.params.examineeId)
        examinee = log;
    return <Examinee examinee={examinee}/>;
  }
});

module.exports = ExamineeContainer;
