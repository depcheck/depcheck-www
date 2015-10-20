import React from 'react';

export default React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
  },
  render() {
    const title = this.props.title || 'Depcheck Web Service';

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>{title}</title>
        </head>
        <body>
          {this.props.children}
        </body>
      </html>
    );
  },
});
