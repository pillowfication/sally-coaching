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
