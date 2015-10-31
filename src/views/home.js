import React from 'react';
import Layout from './layout';

const Introduction = () => (
  <p>
    Depcheck looks at your project files and scans your code to find any unused dependencies. Get rid of useless dependencies, and ship clean package.
  </p>
);

const Logo = () => (
  <img
    src="/assets/logo-480.jpg"
    className="img-responsive center-block"
    alt="Depcheck Logo"
  />
);

const Login = () => (
  <p className="text-center">
    <a className="btn btn-default" href="/login/github">
      Login with GitHub Account
    </a>
  </p>
);

const Welcome = ({ login, url }) => (
  <p>
    Logged in as <mark>{login.provider}/{login.user}</mark>. Go to <a href={url.repoList}>repository list</a>.
  </p>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1 className="text-center">Depcheck</h1>
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <Introduction />
            {this.props.login ? <Welcome {...this.props} /> : <Login />}
          </div>
        </div>
        <Logo />
      </Layout>
    );
  },
});
