const _ = require('lodash');
const moment = require('moment');
const React = require('react');
const ReactBootstrap = require('react-bootstrap');
const update = require('react-addons-update');

const Row = ReactBootstrap.Row;
const Col = ReactBootstrap.Col;
const Table = ReactBootstrap.Table;
const Checkbox = ReactBootstrap.Checkbox;
const Button = ReactBootstrap.Button;

const changeColorMap = {
  '-2': '#FF0000',
  '-1': '#F3B083',
  '0': '#D0CECE',
  '1': '#E1EFD8',
  '2': '#92D050'
};

const Log = React.createClass({
  propTypes: {
    isNew: React.PropTypes.bool,
    log: React.PropTypes.object,
    onSaveLog: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return _.assign({}, this.props.log, {_addGoal: '', _saveStatus: ''});
  },

  resetStatus() {
    if (this.state._saveStatus && this.state._saveStatus !== 'Saving...')
      this.setState({_saveStatus: ''});
  },

  udcb(field) {
    this.setState({[field]: !this.state[field]});
    this.resetStatus();
  },
  udot(event) {
    this.setState({other: event.target.value});
    this.resetStatus();
  },
  addg(event) {
    this.setState({_addGoal: event.target.value});
  },

  addGoal() {
    if (!this.state._addGoal)
      return;

    if (_.map(this.state.goalChanges, 'goalName').indexOf(this.state._addGoal) !== -1) {
      this.setState({_addGoal: ''});
      return;
    }

    this.setState(update(this.state, {
      goalChanges: {$push: [{
        goalName: this.state._addGoal,
        goalChange: 0
      }]},
      _addGoal: {$set: ''}
    }));
    this.resetStatus();
  },
  sgc(goalName, e) {
    let find = _.findIndex(this.state.goalChanges, {goalName: goalName});
    if (find === -1 && e.target.value === 'delete') {}
    else if (find === -1)
      this.setState(update(this.state, {
        goalChanges: {$push: [{
          goalName: goalName,
          goalChange: +e.target.value
        }]}
      }));
    else if (e.target.value === 'delete')
      this.setState(update(this.state, {
        goalChanges: {$splice: [[find, 1]]}
      }));
    else
      this.setState(update(this.state, {
        goalChanges: {[find]: {goalChange: {$set: +e.target.value}}}
      }));
    this.resetStatus();
  },

  render() {
    console.log('render Log.jsx', this.state);

    let sortedLogs = _.sortBy(this.props.examinee.examineeLogs, 'logDate');
    let goals = _.map(sortedLogs, log => ({logDate: log.logDate, goal: log.goalChanges}));
    let actionSteps = _.map(sortedLogs, log => ({logDate: log.logDate, goal: log.actionSteps}));
    let goalsByDate = _.keyBy(goals, 'logDate');
    let last5dates = _(sortedLogs).map('logDate').filter(d => d < this.state.logDate).value();
    last5dates = [0,0,0,0,0].concat(last5dates).slice(-5);
    let lastDate = last5dates[4];

    let __cache;

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
            <Table style={{textAlign: 'center'}}>
              <thead>
                <tr>
                  <th rowSpan="2" style={{textAlign: 'center'}}>Name of goal</th>
                  <th rowSpan="2" style={{textAlign: 'center'}}>Direction of change since last meeting</th>
                  <th colSpan="5" style={{textAlign: 'center'}}>History against goal</th>
                </tr>
                <tr>
                  {last5dates.map((d, i) =>
                    <th key={i} style={{textAlign: 'center'}}>{d ? moment(d).format('DD/MM') : '—'}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(() => {
                  // Updated rows
                  __cache = {};
                  let rows = [];
                  if (lastDate) {
                    let lastGoals = goalsByDate[lastDate].goal;
                    for (let goal of lastGoals) {
                      let value = _.get(_.find(this.state.goalChanges, {goalName: goal.goalName}), 'goalChange', 'delete');
                      __cache[goal.goalName] = true;
                      rows.push(
                        <tr key={goal.goalName}>
                          <td>{goal.goalName}</td>
                          <td><select value={value} onChange={this.sgc.bind(this, goal.goalName)}>
                            <option value="-2">-2</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1">+1</option>
                            <option value="2">+2</option>
                            <option value="delete">Delete</option>
                          </select></td>
                          {last5dates.map((date, i) => {
                            let g = date ? _.find(goalsByDate[date].goal, {goalName: goal.goalName}) : undefined;
                            return (
                              <td key={i} style={{backgroundColor: !_.isUndefined(g) && changeColorMap[g.goalChange] || '#FFFFFF'}}>
                                {_.isUndefined(g) ? '—' : (g.goalChange > 0 ? `+${g.goalChange}` : g.goalChange)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    }
                  }
                  return rows;
                })()}
                {(() => {
                  // New rows
                  let rows = [];
                  for (let goal of this.state.goalChanges) {
                    if (!__cache[goal.goalName])
                      rows.push(
                        <tr key={goal.goalName}>
                          <td>{goal.goalName}</td>
                          <td><select value={goal.goalChange} onChange={this.sgc.bind(this, goal.goalName)}>
                            <option value="-2">-2</option>
                            <option value="-1">-1</option>
                            <option value="0">0</option>
                            <option value="1">+1</option>
                            <option value="2">+2</option>
                            <option value="delete">Delete</option>
                          </select></td>
                          {last5dates.map((date, i) => {
                            let g = date ? _.find(goalsByDate[date].goal, {goalName: goal.goalName}) : undefined;
                            return (
                              <td key={i} style={{backgroundColor: !_.isUndefined(g) && changeColorMap[g.goalChange] || '#FFFFFF'}}>
                                {_.isUndefined(g) ? '—' : (g.goalChange > 0 ? `+${g.goalChange}` : g.goalChange)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                  }
                  return rows;
                })()}
              </tbody>
            </Table>

            <Button bsStyle="default" onClick={this.addGoal}>Add Goal</Button>
            <input type="text" className="form-control" value={this.state._addGoal} onChange={this.addg} style={{
                marginTop: '1px',
                marginLeft: '1em',
                display: 'inline-block',
                width: '172px'
              }}></input>
          </li>

          {/* Question 5 */}
          <li style={{paddingBottom: '1em'}}>
            <b>What action steps have been agreed?</b><br/>
          </li>

          <br/>
          <Button bsStyle="primary" onClick={() => {
              this.setState({_saveStatus: 'Saving...'});
              this.props.onSaveLog(_.omit(this.state, ['_addGoal', '_saveStatus']), this.props.isNew, (status) => {
                this.setState({_saveStatus: status});
              });
            }}>Save Log</Button>
          <span style={{marginLeft: '1.2em'}}>{this.state._saveStatus}</span>
        </ol>
      </div>
    );
  }
});

module.exports = Log;
