import React from 'react';
import markdown from 'marked';
import Navbar from './navbar';
import Layout from './layout';

export default React.createClass({
  render() {
    return (
      <Layout>
        <h1 className="text-center">Tutorial</h1>
        <Navbar />
        <div className="row">
          <div
            className="col-md-8 col-md-offset-2"
            dangerouslySetInnerHTML={{__html: markdown(this.props.content)}}
          />
        </div>
      </Layout>
    );
  },
});
