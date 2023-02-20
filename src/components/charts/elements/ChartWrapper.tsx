import React, { ReactNode } from 'react';

interface Props {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  children: ReactNode;
}

const ChartWrapper = ({ width, height, margin, children }: Props) => {
  return (
    <div className="mx-auto overflow-x-auto" style={{ maxWidth: width }}>
      <svg width={width} height={height} className="m-0">
        <g transform={`translate(${margin.left}, ${margin.top})`}>{children}</g>
      </svg>
    </div>
  );
};

export default ChartWrapper;
