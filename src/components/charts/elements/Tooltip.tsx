import { useContext, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChartContext } from './ChartContext';

const Tooltip = ({ children }: { children: React.ReactNode | undefined }) => {
  const { tooltip } = useFollowMouse();
  const { containerRef } = useContext(ChartContext);

  return createPortal(
    <div
      ref={tooltip}
      className={`pointer-events-none absolute top-1/2 z-20 min-w-[8rem] -translate-y-1/2`}
    >
      {children}
    </div>,
    containerRef?.current ?? document.body
  );
};

export default Tooltip;

const useFollowMouse = () => {
  const tooltip = useRef<HTMLDivElement>(null);
  const { svgRef } = useContext(ChartContext);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip.current || !svgRef?.current) {
        return;
      }

      const rightSide = e.clientX < window.innerWidth * 0.5;

      tooltip.current.animate(
        {
          top:
            (
              e.clientY - svgRef.current.getBoundingClientRect().top
            ).toString() + 'px',
          left:
            (
              e.clientX -
              svgRef.current.getBoundingClientRect().left +
              (rightSide
                ? 10
                : -tooltip.current.getBoundingClientRect().width - 10)
            ).toString() + 'px',
        },
        {
          duration: 200,
          fill: 'forwards',
        }
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [svgRef]);

  return { tooltip, svgRef };
};
