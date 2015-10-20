import React from 'react';
import Layout from './layout';

const Token = ({ token }) => (
  token ? <code>{token}</code> : <input type="button" value="Enable" />
);

const Repo = ({ name, description, token }) => (
  <li key={name}>
    <h4>{name}</h4>
    <p>{description}</p>
    <p>Token: <Token token={token} /></p>
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
