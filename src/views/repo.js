import React from 'react';
import Layout from './layout';
import { BadgeImage } from './inline';

const Dependencies = ({ caption, dependencies }) => (
  <div>
  {
    dependencies.length
    ? (
      <p>
        <b>{caption} </b>
        {dependencies.map(dep => <span key={dep}><a>{dep}</a> </span>)}
      </p>
    )
    : null
  }
  </div>
);

const Report = ({ caption, dependencies, devDependencies, badgeUrl }) => (
  <li>
    <div className="panel panel-default">
      <div className="panel-heading">
        {caption}
        <BadgeImage badgeUrl={badgeUrl} />
      </div>
      <div className="panel-body">
        {
          !dependencies.length && !devDependencies.length
          ? <p>Everything is good in this report, there is no unused dependencies.</p>
          : null
        }
        <Dependencies
          caption="Unused dependencies"
          dependencies={dependencies}
        />
        <Dependencies
          caption="Unused devDependencies"
          dependencies={devDependencies}
        />
      </div>
    </div>
  </li>
);

const Token = ({ repo, token, url }) =>
  token
  ? (
    <div>
      <p><b>Repository token</b>: <code>{token}</code></p>
      <p>Please keep the token security. Follow the <a>depcheck tutorial</a> to enjoy it.</p>
    </div>
  )
  : (
    <form method="post" action={url}>
      <p>Repository {repo} is not enabled for depcheck. Enable it with the below button, and follow the <a>depcheck tutorial</a> to enjoy it.</p>
      <input className="btn btn-success pull-right" type="submit" value="Enable Depcheck" />
    </form>
  );

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1 className="text-center">
          {this.props.repo}
        </h1>
        <h5 className="text-center">
          from <mark>{this.props.provider}/{this.props.user}</mark>
        </h5>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <ul className="list-unstyled">
            {
              this.props.reports.map(report =>
                <Report key={report.caption} {...report}/>)
            }
            </ul>
            <Token
              repo={this.props.repo}
              token={this.props.token}
              url={this.props.tokenUrl}
            />
          </div>
        </div>
      </Layout>
    );
  },
});
