import React from 'react';
import Layout from './layout';

const codeSnippet = `
{
  "token": "00a9a10d-c1c4-0686-a6e3-c955ee6f0515",
  "branch": "master",
  "report": "",
  "result": {
    "dependencies": ["a"],
    "devDependencies": ["b", "c"]
  }
}`;

const Report = ({ branch, report, dependencies, devDependencies }) => (
  <li>
    <p>Branch: {branch}</p>
    <p>Report: {report}</p>
    <div>
      <p>Unused dependencies</p>
      <ul>{dependencies.map(dep => <li key={dep}>{dep}</li>)}</ul>
    </div>
    <div>
      <p>Unused devDependencies</p>
      <ul>{devDependencies.map(dep => <li key={dep}>{dep}</li>)}</ul>
    </div>
  </li>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1>Repository {this.props.repo}</h1>
        <h4>From {this.props.provider}/{this.props.user}!</h4>
        <div>
          <p>Reports</p>
          <ul>
          {
            this.props.reports.map(report =>
              <Report key={`${report.branch}/${report.report}`} {...report}/>)
          }
          </ul>
        </div>
        <div>
          <p>Example</p>
          <p>POST <code>/github/lijunle/depcheck-web</code></p>
          <pre>{codeSnippet}</pre>
        </div>
      </Layout>
    );
  },
});
