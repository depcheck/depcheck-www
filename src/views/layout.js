import React from 'react';

const Dot = () => (
  <span> &middot; </span>
);

const Footer = () => (
  <p className="text-center text-muted">
    <small>
      <span>&copy; 2015 Junle Li</span>
      <Dot />
      <a href="https://github.com/lijunle/depcheck-es6">GitHub</a>
      <Dot />
      <a href="https://github.com/lijunle/depcheck-es6/issues">Issues</a>
      <Dot />
      <a href="https://www.npmjs.com/package/depcheck-es6">Npm</a>
    </small>
  </p>
);

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
  },
  render() {
    const title = this.props.title || 'Depcheck';

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
          <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
        </head>
        <body className="container">
          {this.props.children}
          <hr />
          <Footer />
        </body>
      </html>
    );
  },
});
