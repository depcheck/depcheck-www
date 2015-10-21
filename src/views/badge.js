import React from 'react';

function getSettings(result) {
  if (!result.dependencies || !result.devDependencies) {
    return ['unknown', '#9f9f9f'];
  } else if (result.dependencies.length || result.devDependencies.length) {
    return ['failing', '#e05d44'];
  }

  return ['passing', '#4c1'];
}

export default React.createClass({
  render() {
    // TODO expand the badge width according to caption
    const [caption, color] = getSettings(this.props);
    return (
      <svg width="103" height="20">
        <linearGradient id="a" x2="0" y2="100%">
          <stop offset="0" stopColor="#bbb" stopOpacity=".1" />
          <stop offset="1" stopOpacity=".1" />
        </linearGradient>
        <rect rx="3" width="103" height="20" fill="#555" />
        <rect rx="3" x="56" width="47" height="20" fill={color} />
        <path fill={color} d="M56 0h4v20h-4z" />
        <rect rx="3" width="103" height="20" fill="url(#a)" />
        <g
          fill="#fff"
          textAnchor="middle"
          fontFamily="DejaVu Sans,Verdana,Geneva,sans-serif"
          fontSize="11"
        >
          <text x="28" y="15" fill="#010101" fillOpacity=".3">depcheck</text>
          <text x="28" y="14">depcheck</text>
          <text x="79" y="15" fill="#010101" fillOpacity=".3">{caption}</text>
          <text x="79" y="14">{caption}</text>
        </g>
      </svg>
    );
  },
});
