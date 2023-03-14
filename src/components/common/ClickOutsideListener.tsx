import { ReactNode, useEffect, useState, useRef } from 'react';

const ClickOutsideListener = ({
  children,
  onClickOutside,
  ignoreCount = 1,
}: {
  children: ReactNode;
  onClickOutside: () => void;
  ignoreCount?: number;
}) => {
  const [eventsIgnored, setEventsIgnored] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: globalThis.MouseEvent) => {
      if (!elementRef.current) {
        return;
      }

      if (elementRef.current.contains(e.target as Node)) {
        return;
      }

      if (eventsIgnored < ignoreCount) {
        setEventsIgnored((prev) => prev + 1);
        return;
      }

      onClickOutside();
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [onClickOutside, ignoreCount, eventsIgnored]);

  return <div ref={elementRef}>{children}</div>;
};

export default ClickOutsideListener;
