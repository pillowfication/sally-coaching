const _ = require('lodash');
const React = require('react');
const ReactBootstrap = require('react-bootstrap');
const request = require('request');
const ReactRouter = require('react-router');
const shortId = require('shortid');

const Link = ReactRouter.Link;

const Col = ReactBootstrap.Col;
const Table = ReactBootstrap.Table;
const ControlLabel = ReactBootstrap.ControlLabel;
const Form = ReactBootstrap.Form;
const FormGroup = ReactBootstrap.FormGroup;
const FormControl = ReactBootstrap.FormControl;
const Button = ReactBootstrap.Button;

const SelectExaminee = React.createClass({
  getInitialState() {
    return {
      examineeName: ''
    };
  },

  handleExamineeNameChange(event) {
    this.setState({examineeName: event.target.value});
  },
  handleOnKeyPress(event) {
    if (event.key === 'Enter')
      this.handleAddExaminee();
  },
  handleAddExaminee() {
    let updatedExaminees = this.props.profile.examinees.slice();
    updatedExaminees.push({
      id: shortId.generate(),
      examineeName: this.state.examineeName,
      examineeLogs: []
    });

    request({
      method: 'POST',
      url: `${window.location.origin}/api/updateProfile`,
      form: {updatedExaminees: updatedExaminees}
    }, () => {
      console.log('Updated stuff')
      console.log(arguments);
      this.setState({
        examineeName: ''
      });
      this.props.refresh();
    });
  },

  render() {
    // Render child route if applicable
    if (this.props.children) {
      return React.cloneElement(React.Children.only(this.props.children), {
        account: this.props.account,
        profile: this.props.profile,
        refresh: this.props.refresh
      });
    }

    let examinees = this.props.profile.examinees;

    return (
      <div>
        <h3>Your Examinees</h3>
        {examinees.length === 0 ? <p>Your list is empty!</p> :
          <Table striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Something else</th>
                <th>And another</th>
              </tr>
            </thead>
            <tbody>
              {examinees.map((examinee) => {
                return (
                  <tr key={examinee.id}>
                    <td><Link to={`/examinees/${examinee.id}`}>{examinee.examineeName}</Link></td>
                    <td></td>
                    <td></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>}
        <h3>Add New Examinee</h3>
        <input className="form-control"
          type="text"
          placeholder="Examinee Name"
          value={this.state.examineeName}
          onChange={this.handleExamineeNameChange}
          onKeyPress={this.handleOnKeyPress}
        />
        <br/>
        <Button onClick={this.handleAddExaminee}>Add Examinee</Button>
      </div>
    );
  }
});

module.exports = SelectExaminee;
