import React from 'react';

const Dash = () => (
  <span> - </span>
);

export default React.createClass({
  render() {
    return (
      <p className="text-center">
        <small>
          <a href={this.props.homeUrl}>Home</a>
          <Dash />
          <a href={this.props.tutorialUrl}>Tutorial</a>
          <Dash />
          <a href="https://github.com/lijunle/depcheck-web">GitHub</a>
        </small>
      </p>
    );
  },
});
