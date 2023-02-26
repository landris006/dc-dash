import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children }: { children: React.ReactNode | undefined }) => {
  const tooltip = useFollowMouse();

  return createPortal(
    <div
      ref={tooltip}
      className={`pointer-events-none absolute top-1/2 min-w-[8rem] -translate-y-1/2`}
    >
      {children}
    </div>,
    document.body
  );
};

export default Tooltip;

const useFollowMouse = () => {
  const tooltip = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!tooltip.current) {
        return;
      }

      const rightSide = e.clientX < window.innerWidth * 0.5;

      tooltip.current.animate(
        {
          top: e.clientY.toString() + 'px',
          left:
            (
              e.clientX +
              (rightSide
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
  }, []);

  return tooltip;
};
