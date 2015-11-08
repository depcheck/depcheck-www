import React from 'react';
import Layout from './layout';
import Navbar from './navbar';

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
  <a className="btn btn-default" href="/login/github">
    Login with GitHub Account
  </a>
);

const Welcome = ({ login, repoListUrl }) => (
  <a className="btn btn-default" href={repoListUrl}>
    Logged in as <mark>{login.provider}/{login.user}</mark>
  </a>
);

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1 className="text-center">Depcheck</h1>
        <div className="row">
          <div className="col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2">
            <Introduction />
            <p className="text-center">
              {this.props.login ? <Welcome {...this.props} /> : <Login />}
            </p>
            <Navbar {...this.props} />
          </div>
        </div>
        <Logo />
      </Layout>
    );
  },
});
