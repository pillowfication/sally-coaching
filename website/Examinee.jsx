const React = require('react');
const ReactBootstrap = require('react-bootstrap');

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Checkbox = ReactBootstrap.Checkbox;
const Table = ReactBootstrap.Table;

const Examinee = React.createClass({
  render() {
    return (
      <div>
        <h3>Placeholder page for {this.props.examinee.examineeName}</h3>
        <Loggy {...this.props}/>
      </div>
    );
  }
});

const Loggy = React.createClass({
  render() {
    // let goals = {};
    // this.props.examinee.examineeLogs.forEach((log) => {
    //   log.goalChanges.forEach((change) => {
    //     let goal = goals[change.goalName] || (goals[change.goalName] = {});
    //     goal[log.logDate] = change.goalChange;
    //   });
    // });

    return (
      <div>
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
                <Checkbox>Lesson observation</Checkbox>
                <Checkbox>Role play or modelling</Checkbox>
                <Checkbox>Discussed core issue</Checkbox>
                <Checkbox>Identified action step to address core issue</Checkbox>
              </Col>
              <Col sm={6}>
                <Checkbox>Developed future lesson plan</Checkbox>
                <Checkbox>Data scrutiny</Checkbox>
                <Checkbox>Book scrutiny</Checkbox>
                <Checkbox>Reviewed lesson plan</Checkbox>
              </Col>
            </Row>
            <div>
              Other: <input type="text" className="form-control"></input>
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
        </ol>
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
