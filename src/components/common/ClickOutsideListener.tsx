import { ReactNode, useEffect, MouseEvent, useState } from 'react';

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

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const handleDocumentClick = () => {
      if (eventsIgnored < ignoreCount) {
        setEventsIgnored((prev) => prev + 1);
        return;
      }

      onClickOutside();
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [onClickOutside, ignoreCount, eventsIgnored]);

  return <div onClick={handleClick}>{children}</div>;
};

export default ClickOutsideListener;
