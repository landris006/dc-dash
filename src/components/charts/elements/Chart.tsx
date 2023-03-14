import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { ChartContext } from './ChartContext';

interface Props {
  minWidth?: number;
  minHeight?: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  children: ReactNode;
}

const Chart = ({ margin, children, minWidth, minHeight }: Props) => {
  const { container, width, height } = useWidth(minWidth ?? 0, minHeight ?? 0);
  const svgRef = useRef<SVGSVGElement>(null);
  const [allowInteractions, setAllowInteractions] = useState(true);
  const chartContextValue = {
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
    containerRef: container,
    svgRef,
    allowInteractions,
    setAllowInteractions,
  };

  return (
    <ChartContext.Provider value={chartContextValue}>
      <div ref={container} className="relative h-full overflow-x-auto">
        {container.current && (
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="absolute outline-none"
          >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {children}
            </g>
          </svg>
        )}
      </div>
    </ChartContext.Provider>
  );
};

export default Chart;

const useWidth = (minWidth: number, minHeight: number) => {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resize = () => {
      if (!container.current) {
        return { width: 0, height: 0 };
      }

      if (container.current) {
        // eslint-disable-next-line prefer-const
        let { width, height } = container.current.getBoundingClientRect();

        if (width < minWidth) {
          width = minWidth;
        }

        if (height < minHeight) {
          height = minHeight;
        }

        setSize({ width, height });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [minWidth, minHeight]);

  return { container, ...size };
};
