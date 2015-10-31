import React from 'react';
import cheerio from 'cheerio';
import ReactDOMServer from 'react-dom/server';

export default function view(name, properties) {
  const component = require(`../../src/views/${name}`);
  const element = React.createElement(component, properties);
  const html = ReactDOMServer.renderToStaticMarkup(element);
  return cheerio.load(html);
}
