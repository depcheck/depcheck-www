import React from 'react';
import Layout from './layout';

const Badge = ({ badgeUrl }) => (
  <span> <img src={badgeUrl} /></span>
);

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
        <Badge badgeUrl={badgeUrl} />
      </div>
      <div className="panel-body">
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
          </div>
        </div>
      </Layout>
    );
  },
});
