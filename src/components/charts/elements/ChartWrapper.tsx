import React, {
  createContext,
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

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

const defaultWidth = 960;
const defaultHeight = 600;
const defaultMargin = { top: 20, right: 20, bottom: 75, left: 75 };
const defaultdimensions = {
  width: defaultWidth,
  height: defaultHeight,
  margin: { top: 20, right: 20, bottom: 75, left: 75 },
  innerWidth: defaultWidth - defaultMargin.left - defaultMargin.right,
  innerHeight: defaultHeight - defaultMargin.top - defaultMargin.bottom,
  containerRef: null as RefObject<HTMLDivElement> | null,
  svgRef: null as RefObject<SVGSVGElement> | null,
};

export const DimensionsContext = createContext(defaultdimensions);

const ChartWrapper = ({ margin, children, minWidth, minHeight }: Props) => {
  const { container, width, height } = useWidth(minWidth ?? 0, minHeight ?? 0);
  const svgRef = useRef<SVGSVGElement>(null);
  const dimensions = {
    width,
    height,
    margin,
    innerWidth: width - margin.left - margin.right,
    innerHeight: height - margin.top - margin.bottom,
    containerRef: container,
    svgRef,
  };

  return (
    <DimensionsContext.Provider value={dimensions}>
      <div ref={container} className="relative h-full overflow-x-auto">
        {container.current && (
          <svg ref={svgRef} width={width} height={height} className="absolute outline-none">
            <g transform={`translate(${margin.left}, ${margin.top})`}>
              {children}
            </g>
          </svg>
        )}
      </div>
    </DimensionsContext.Provider>
  );
};

export default ChartWrapper;

function useWidth(minWidth: number, minHeight: number) {
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
}
