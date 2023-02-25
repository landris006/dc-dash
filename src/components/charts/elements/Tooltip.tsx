import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children }: { children: React.ReactNode | undefined }) => {
  const { tooltip } = useFollowMouse();

  return createPortal(
    <div
      ref={tooltip}
      className={`pointer-events-none absolute top-1/2 min-w-[8rem] -translate-y-1/2`}
      // style={{
      //   display: children ? 'block' : 'none',
      // }}
    >
      {children}
    </div>,
    document.body
  );
};

export default Tooltip;

const useFollowMouse = () => {
  const tooltip = useRef<HTMLDivElement>(null);

  const [side, setSide] = useState<'left' | 'right'>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip.current) {
        return;
      }

      if (e.clientX > window.innerWidth * 0.5) {
        setSide('left');
      } else {
        setSide('right');
      }

      tooltip.current.animate(
        {
          top: e.clientY.toString() + 'px',
          left:
            (
              e.clientX +
              (side === 'right'
                ? 10
                : -tooltip.current.getBoundingClientRect().width - 10)
            ).toString() + 'px',
        },
        {
          duration: 500,
          fill: 'forwards',
        }
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [side, tooltip.current]);

  return { tooltip, side };
};
