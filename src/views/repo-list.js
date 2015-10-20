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
  <li key={name}>
    <h4><a href={repoUrl}>{name}</a></h4>
    <p>{description}</p>
    <p>Token: <Token token={token} url={requestTokenUrl} /></p>
  </li>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1>Repo List</h1>
        <p>Hi, {this.props.provider}/{this.props.user}!</p>
        <ul>{this.props.repos.map(repo => <Repo {...repo} />)}</ul>
      </Layout>
    );
  },
});
