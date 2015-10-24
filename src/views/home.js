import React from 'react';
import Layout from './layout';

const Login = () => (
  <a href="/login/github">Login with GitHub Account</a>
);

const Welcome = ({ login, url }) => (
  <p>Hello {login.user}! Go to <a href={url.repoList}>my repo</a>.</p>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1>Depcheck Web Service</h1>
        {this.props.login ? <Welcome {...this.props} /> : <Login />}
      </Layout>
    );
  },
});
