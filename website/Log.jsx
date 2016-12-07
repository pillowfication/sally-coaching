const moment = require('moment');
const React = require('react');
const ReactBootstrap = require('react-bootstrap');
const update = require('react-addons-update');

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Table = ReactBootstrap.Table;
const Checkbox = ReactBootstrap.Checkbox;
const Button = ReactBootstrap.Button;

const Log = React.createClass({
  propTypes: {
    isNew: React.PropTypes.bool,
    log: React.PropTypes.object,
    onSaveLog: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return this.props.log;
  },

  udcb(field) {
    this.setState({[field]: !this.state[field]});
  },
  udot(event) {
    this.setState({other: event.target.value});
  },

  render() {
    console.log('render Log.jsx', this.state);
    return (
      <div>

        <h4>{this.props.isNew ? 'New Log for' : 'Editing Log'} {moment(this.state.logDate).format('DD/MM/YYYY')}</h4>
        <br/>

        <ol>
          {/* Question 1 */}
          <li style={{paddingBottom: '1em'}}>
            <b>Name</b><br/>
            {this.props.account._json.displayName}
          </li>

          {/* Question 2 */}
          <li style={{paddingBottom: '1em'}}>
            <b>Teacher met with</b><br/>
            {this.props.examinee.examineeName}
          </li>

          {/* Question 3 */}
          <li style={{paddingBottom: '1em'}}>
            <b>Which of the following activities took place during the meeting?</b>
            &nbsp;Choose ALL that apply<br/>
            <Row>
              <Col sm={6}>
                <Checkbox checked={this.state.lessonObservation} onChange={this.udcb.bind(this, 'lessonObservation')}>Lesson observation</Checkbox>
                <Checkbox checked={this.state.rolePlayOrModelling} onChange={this.udcb.bind(this, 'rolePlayOrModelling')}>Role play or modelling</Checkbox>
                <Checkbox checked={this.state.discussedCoreIssue} onChange={this.udcb.bind(this, 'discussedCoreIssue')}>Discussed core issue</Checkbox>
                <Checkbox checked={this.state.identifiedActionStepToAddressCoreIssue} onChange={this.udcb.bind(this, 'identifiedActionStepToAddressCoreIssue')}>Identified action step to address core issue</Checkbox>
              </Col>
              <Col sm={6}>
                <Checkbox checked={this.state.developedFutureLessonPlan} onChange={this.udcb.bind(this, 'developedFutureLessonPlan')}>Developed future lesson plan</Checkbox>
                <Checkbox checked={this.state.dataScrutiny} onChange={this.udcb.bind(this, 'dataScrutiny')}>Data scrutiny</Checkbox>
                <Checkbox checked={this.state.bookScrutiny} onChange={this.udcb.bind(this, 'bookScrutiny')}>Book scrutiny</Checkbox>
                <Checkbox checked={this.state.reviewedLessonPlan} onChange={this.udcb.bind(this, 'reviewedLessonPlan')}>Reviewed lesson plan</Checkbox>
              </Col>
            </Row>
            <div>
              Other: <input type="text" className="form-control" value={this.state.other} onChange={this.udot}></input>
            </div>
          </li>

          {/* Question 4 */}
          <li style={{paddingBottom: '1em'}}>
            <b>How has the teacher progressed on their key goals?</b><br/>
            <Table>
              <thead>
                <tr>
                  <th rowSpan="2">Name of goal</th>
                  <th rowSpan="2">Direction of change since last meeting</th>
                  <th colSpan="5" style={{textAlign: 'center'}}>History against goal</th>
                </tr>
                <tr>
                  <th>01/01</th>
                  <th>08/01</th>
                  <th>15/01</th>
                  <th>22/01</th>
                  <th>29/01</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </Table>
          </li>

          {/* Question 5 */}
          <li style={{paddingBottom: '1em'}}>
            <b>What action steps have been agreed?</b><br/>
          </li>

          <br/>
          <Button bsStyle="primary" onClick={() => {
              this.props.onSaveLog(this.state, this.props.isNew);
            }}>Save Log</Button>
        </ol>
      </div>
    );
  }
});

module.exports = Log;
