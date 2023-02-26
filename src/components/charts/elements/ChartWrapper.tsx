import React, {
  createContext,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Props {
  aspectRatio: number;
  minWidth?: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  children: ReactNode;
}

const defaultWidth = 960;
const defaultHeight = 600;
const defaultMargin = { top: 20, right: 20, bottom: 75, left: 75 };
const defaultdimensions = {
  width: defaultWidth,
  height: defaultHeight,
  margin: { top: 20, right: 20, bottom: 75, left: 75 },
  innerWidth: defaultWidth - defaultMargin.left - defaultMargin.right,
  innerHeight: defaultHeight - defaultMargin.top - defaultMargin.bottom,
};

export const DimensionsContext = createContext(defaultdimensions);

const ChartWrapper = ({ aspectRatio, margin, children, minWidth }: Props) => {
  const { container, width } = useWidth(minWidth ?? 0);
  const height = width / aspectRatio;
  const dimensions = {
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
  };

  return (
    <DimensionsContext.Provider value={dimensions}>
      <div ref={container} className="overflow-x-auto">
        <svg width={width} height={height} className="m-0">
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            {children}
          </g>
        </svg>
      </div>
    </DimensionsContext.Provider>
  );
};

export default ChartWrapper;

function useWidth(minWidth: number) {
  const container = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const resize = () => {
      if (container.current) {
        let { width } = container.current.getBoundingClientRect();

        if (width < minWidth) {
          width = minWidth;
        }

        setWidth(width);
      }
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [minWidth]);

  return { container, width };
}
