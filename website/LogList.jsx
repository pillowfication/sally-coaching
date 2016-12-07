const moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const ReactBootstrap = require('react-bootstrap');

const Link = ReactRouter.Link;
const Button = ReactBootstrap.Button;

const LogList = React.createClass({
  render() {
    if (this.props.examinee.examineeLogs.length === 0) {
      return <div><h4>There are no logs yet!</h4></div>;
    }

    return (
      <div>
        <h5>Logs:</h5>
        <ul>
          {this.props.examinee.examineeLogs.map((log) =>
            <li key={log.logDate}>
              <Link to={`/examinees/${this.props.examinee.id}/logs/${log.logDate}`}>
                {moment(log.logDate).format('DD/MM/YY')}
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
  }
});

const LogListContainer = React.createClass({
  render() {
    return (
      <div>
        <LogList {...this.props}/>
        <br/>
        <Link to={`/examinees/${this.props.examinee.id}`}>
          <Button>Create new log</Button>
        </Link>
      </div>
    );
  }
});

module.exports = LogListContainer;
