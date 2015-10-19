import React from 'react';
import Layout from './layout';

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1>Hello World!</h1>
        <a href="/login/github">Login with GitHub Account</a>
      </Layout>
    );
  },
});
