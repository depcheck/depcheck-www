import React from 'react';
import Layout from './layout';
import Navbar from './navbar';
import { BadgeImage } from './inline';

const Repo = ({ name, description, enabled, repoUrl, badgeUrl }) => (
  <li>
    <h4>
      <a href={repoUrl}>{name}</a>
      {enabled ? <BadgeImage badgeUrl={badgeUrl} /> : null}
    </h4>
    <p>{description}</p>
  </li>
);

const RepoList = ({ repos }) => (
  <ul className="list-unstyled">
    {repos.map(repo => <Repo key={repo.name} {...repo} />)}
  </ul>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1 className="text-center">
          Repository
        </h1>
        <h5 className="text-center">
          from <mark>{this.props.provider}/{this.props.user}</mark>
        </h5>
        <Navbar />
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <RepoList repos={this.props.enabled} />
            <hr />
            <RepoList repos={this.props.disabled} />
            <hr />
            <h3>Invalid Repositories</h3>
            <p>The following repositories have been removed from {this.props.provider}, and become invalid.</p>
            <RepoList repos={this.props.invalid} />
          </div>
        </div>
      </Layout>
    );
  },
});
