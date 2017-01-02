const _ = require('lodash');
const moment = require('moment');
const React = require('react');
const ReactRouter = require('react-router');
const ReactBootstrap = require('react-bootstrap');

const Link = ReactRouter.Link;
const Button = ReactBootstrap.Button;
const Table = ReactBootstrap.Table;

const changeColorMap = {
  '-2': '#FF0000',
  '-1': '#F3B083',
  '0': '#D0CECE',
  '1': '#E1EFD8',
  '2': '#92D050'
};

const LogList = React.createClass({
  render() {
    if (this.props.examinee.examineeLogs.length === 0) {
      return <div><h4>There are no logs yet!</h4></div>;
    }

    let logs = _.sortBy(this.props.examinee.examineeLogs, 'logDate');
    let goals = [];
    for (let log of logs)
      for (let goal of log.goalChanges)
        if (goals.indexOf(goal.goalName) === -1)
          goals.push(goal.goalName);

    console.log(goals)

    return (
      <div>
        <Table style={{textAlign: 'center'}}>
          <thead>
            <tr>
              <th rowSpan={2} style={{textAlign: 'center'}}>Log Date</th>
              <th colSpan={goals.length} style={{textAlign: 'center'}}>Goal Changes</th>
            </tr>
            <tr>
              {goals.map(goal =>
                <th key={goal} style={{textAlign: 'center'}}>{goal}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => {
              let goalsByGoalName = _.keyBy(log.goalChanges, 'goalName');
              return (
                <tr key={log.logDate}>
                  <td>
                    <Link to={`/examinees/${this.props.examinee.id}/logs/${log.logDate}`}>
                      {moment(log.logDate).format('DD/MM/YY')}
                    </Link>
                  </td>
                  {goals.map(goal => {
                    let g = goalsByGoalName[goal];
                    return (
                      <td key={goal} style={{backgroundColor: !_.isUndefined(g) && changeColorMap[g.goalChange] || '#FFFFFF'}}>
                        {_.isUndefined(g) ? '—' : (g.goalChange > 0 ? `+${g.goalChange}` : g.goalChange)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );

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
