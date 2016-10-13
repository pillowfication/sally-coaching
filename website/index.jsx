const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;

const Moo = React.createClass({
  render: () => {
    return <span>MOO</span>;
  }
});

ReactDOM.render(
  <Router history={ReactRouter.browserHistory}>
    <Route path="/" component={Moo}/>
  </Router>,
  document.getElementById('content')
);
