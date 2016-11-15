const _ = require('lodash');
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
      isLoading: true,
      hasError: false,
      account: undefined,
      profile: undefined
    };
  },
  componentDidMount() {
    request({url: `${window.location.origin}/api/profile`}, (err, res, body) => {
      if (err) {
        console.log('Error fetching user profile:');
        console.log(err);
        this.setState({hasError: err});
      } else {
        let data = JSON.parse(body);
        console.log('User profile fetched:');
        console.log(data);
        this.setState({
          isLoading: false,
          account: data.account,
          profile: data.profile
        });
      }
    });
  },

  refresh() {
    this.setState({isLoading: true});
    request({url: `${window.location.origin}/api/profile`}, (err, res, body) => {
      if (err) {
        console.log('Error fetching user profile:');
        console.log(err);
        this.setState({hasError: err});
      } else {
        let data = JSON.parse(body);
        console.log('User profile fetched:');
        console.log(data);
        this.setState({
          isLoading: false,
          account: data.account,
          profile: data.profile
        });
      }
    });
  },

  render() {
    if (this.state.hasError || (!this.state.isLoading && (!this.state.account || !this.state.profile))) {
      return <span>An error has occurred while fetching your profile. Please try reloading the page.</span>;
    }

    return (
      <div>
        {this.state.isLoading && <Loader/>}
        {this.state.account && this.state.profile &&
          <div>
            <Navbar>
              <Navbar.Header>
                <Navbar.Brand>
                  Hello, {this.state.account._json.displayName}!
                </Navbar.Brand>
              </Navbar.Header>
              <Nav pullRight>
                <NavItem href="/logout">Log out</NavItem>
              </Nav>
            </Navbar>
            <Grid>
              <Row>
                <Col xs={12}>
                  {React.cloneElement(React.Children.only(this.props.children), {
                    account: this.state.account,
                    profile: this.state.profile,
                    refresh: this.refresh
                  })}
                </Col>
              </Row>
            </Grid>
            <div style={{paddingBottom: '100px'}}/>
          </div>}
      </div>
    );
  }
});

const Loader = React.createClass({
  render() {
    return (
      <div style={{
        zIndex: '9001',
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(180,180,180,.5)'
      }}>Loading</div>
    );
  }
})

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
