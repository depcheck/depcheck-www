import React from 'react';
import Layout from './layout';

const Token = ({ token, url }) =>
  token
  ? <code>{token}</code>
  : (
    <form method="post" action={url}>
      <input type="submit" value="Enable" />
    </form>
  );

const Repo = ({ name, description, token, repoUrl, requestTokenUrl }) => (
  <li>
    <h4><a href={repoUrl}>{name}</a></h4>
    <p>{description}</p>
    <div>Token: <Token token={token} url={requestTokenUrl} /></div>
  </li>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1>Repo List</h1>
        <p>Hi, {this.props.provider}/{this.props.user}!</p>
        <ul>
        {
          this.props.repos.map(repo => <Repo key={repo.name} {...repo} />)
        }
        </ul>
      </Layout>
    );
  },
});
