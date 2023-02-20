import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children }: { children: React.ReactNode | undefined }) => {
  const { tooltip, isPositioned } = useFollowMouse();

  return createPortal(
    <div
      ref={tooltip}
      className="pointer-events-none absolute left-1/2 top-1/2 -translate-y-1/2 rounded-md bg-violet-400 bg-opacity-80 p-3"
      style={{
        display: children ? 'block' : 'none',
      }}
    >
      {isPositioned && children}
    </div>,
    document.body
  );
};

export default Tooltip;

const useFollowMouse = () => {
  const tooltip = useRef<HTMLDivElement>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  const [side, setSide] = useState<'left' | 'right'>();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip.current) {
        return;
      }

      if (e.clientX < window.innerWidth / 4) {
        setSide('right');
      }

      if (
        e.clientX + tooltip.current.getBoundingClientRect().width >
        window.innerWidth
      ) {
        setSide('left');
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
      ).onfinish = () => {
        setIsPositioned(true);
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [side]);

  return { tooltip, isPositioned };
};
