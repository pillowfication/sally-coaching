const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const ReactBootstrap = require('react-bootstrap');
const request = require('request');

const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRedirect = ReactRouter.IndexRedirect;

const Grid = ReactBootstrap.Grid;
const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Navbar = ReactBootstrap.Navbar;
const Nav = ReactBootstrap.Nav;
const NavItem = ReactBootstrap.NavItem;

const SelectExaminee = require('./SelectExaminee.jsx');
const Examinee = require('./Examinee.jsx');

const App = React.createClass({
  getInitialState() {
    return {
      hasError: false,
      userProfile: undefined
    };
  },
  componentDidMount() {
    request({url: `${window.location.origin}/profile`}, (err, res, body) => {
      if (err) {
        console.log('Error fetching user profile:');
        console.log(err);
        this.setState({hasError: err});
      } else {
        let profile = JSON.parse(body);
        console.log('User profile fetched:');
        console.log(profile);
        this.setState({userProfile: profile});
      }
    });
  },
  render() {
    if (this.state.hasError) {
      return <span>An error has occurred while fetching your profile. Please try reloading the page.</span>;
    }

    if (!this.state.userProfile) {
      return <span>Loading...</span>;
    }

    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              Hello, {this.state.userProfile.user._json.displayName}!
            </Navbar.Brand>
          </Navbar.Header>
          <Nav pullRight>
            <NavItem href="/logout">Log out</NavItem>
          </Nav>
        </Navbar>
        <Grid>
          <Row>
            <Col xs={12}>{this.props.children}</Col>
          </Row>
        </Grid>
      </div>
    );
  }
});

const NoMatch = React.createClass({
  render() {
    return <h3>Oops! Page not found.</h3>;
  }
});

ReactDOM.render(
  <Router history={ReactRouter.browserHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/examinees"/>
      <Route path="examinees" component={SelectExaminee}>
        <Route path=":examineeId" component={Examinee}/>
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
  document.getElementById('content')
);
