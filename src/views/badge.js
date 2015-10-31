import React from 'react';

export default React.createClass({
  render() {
    const width = this.props.width;
    const depcheckWidth = 63;
    const depcheckPosition = depcheckWidth / 2 + 1;
    const captionWidth = width - depcheckWidth;
    const captionPosition = captionWidth / 2 + depcheckWidth - 1;
    return (
      <svg width={width} height="20">
        <linearGradient id="a" x2="0" y2="100%">
          <stop offset="0" stopColor="#bbb" stopOpacity=".1" />
          <stop offset="1" stopOpacity=".1" />
        </linearGradient>
        <rect rx="3" width={width} height="20" fill="#555" />
        <rect
          rx="3"
          x={depcheckWidth}
          width={captionWidth}
          height="20"
          fill={this.props.color}
        />
        <path fill={this.props.color} d={`M${depcheckWidth} 0h4v20h-4z`} />
        <rect rx="3" width={width} height="20" fill="url(#a)" />
        <g
          fill="#fff"
          textAnchor="middle"
          fontFamily="DejaVu Sans,Verdana,Geneva,sans-serif"
          fontSize="11"
        >
          <text x={depcheckPosition} y="15" fill="#010101" fillOpacity=".3">
            depcheck
          </text>
          <text x={depcheckPosition} y="14">
            depcheck
          </text>
          <text x={captionPosition} y="15" fill="#010101" fillOpacity=".3">
            {this.props.caption}
          </text>
          <text x={captionPosition} y="14">
            {this.props.caption}
          </text>
        </g>
      </svg>
    );
  },
});
