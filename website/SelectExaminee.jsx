const React = require('react');
const ReactBootstrap = require('react-bootstrap');
const request = require('request');
const ReactRouter = require('react-router');

const Link = ReactRouter.Link;

const Col = ReactBootstrap.Col;
const Table = ReactBootstrap.Table;
const ControlLabel = ReactBootstrap.ControlLabel;
const Form = ReactBootstrap.Form;
const FormGroup = ReactBootstrap.FormGroup;
const FormControl = ReactBootstrap.FormControl;
const Button = ReactBootstrap.Button;

const SelectExaminee = React.createClass({
  makeQuery() {
    request({url: `${window.location.origin}/api/logs`}, (err, res, body) => {
      if (err) {
        console.log('Error receiving list of examinees:');
        console.log(err);
        this.setState({hasError: err});
      } else {
        let logs = JSON.parse(body);
        console.log('Received list of examinees:');
        console.log(logs);
        this.setState({logs: logs.logs});
      }
    });
  },

  getInitialState() {
    return {
      hasError: false,
      logs: undefined,
      examineeName: ''
    };
  },
  componentDidMount() {
    this.makeQuery();
  },

  handleExamineeNameChange(event) {
    this.setState({examineeName: event.target.value});
  },
  handleAddExaminee() {
    request({
      method: 'POST',
      url: `${window.location.origin}/api/createLog`,
      form: {examinee: this.state.examineeName}
    }, () => {
      console.log(arguments);
      this.setState({
        hasError: false,
        logs: undefined
      });
      this.makeQuery();
    });
  },

  render() {
    if (this.state.hasError)
      return (
        <div>
          <h3>Your examinees:</h3>
          <p>An error occurred when fetching the list of examinees. Please try refreshing the page.</p>
        </div>
      );

    if (!this.state.logs)
      return (
        <div>
          <h3>Your examinees:</h3>
          <p>Fetching list...</p>
        </div>
      );

    // Render child route if applicable
    if (this.props.children) {
      return React.cloneElement(React.Children.only(this.props.children), {
        logs: this.state.logs
      });
    }

    return (
      <div>
        <h3>Your Examinees</h3>
        {this.state.logs.length === 0 ? <p>Your list is empty!</p> :
          <Table striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Something else</th>
                <th>And another</th>
              </tr>
            </thead>
            <tbody>
              {this.state.logs.map((log) => {
                return (
                  <tr key={log._id}>
                    <td><Link to={`/examinees/${log._id}`}>{log.examineeName}</Link></td>
                    <td></td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>}
        <h3>Add New Examinee</h3>
        <Form>
          <FormGroup controlId="examineeName">
            <ControlLabel>Name</ControlLabel>
            <FormControl
              type="text"
              placeholder="Examinee Name"
              value={this.state.examineeName}
              onChange={this.handleExamineeNameChange}
            />
          </FormGroup>
          <Button onClick={this.handleAddExaminee}>Add Examinee</Button>
        </Form>
      </div>
    );
  }
});

module.exports = SelectExaminee;
