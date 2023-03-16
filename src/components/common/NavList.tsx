import React, { useRef } from 'react';

const NavList = ({
  items,
  onSelect,
  width = 6,
  height = 3,
}: {
  items: string[];
  onSelect: (selectedItem: typeof items[number]) => void;
  width?: number;
  height?: number;
}) => {
  const box = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!box.current) {
      return;
    }

    box.current.animate(
      {
        left: e.currentTarget.offsetLeft + 'px',
      },
      {
        duration: 300,
        easing: 'ease-in-out',
        fill: 'forwards',
      }
    );
  };

  return (
    <div className="relative flex justify-center">
      <div
        ref={box}
        className="pointer-events-none absolute left-0 rounded-md bg-slate-400"
        style={{ width: `${width}rem`, height: `${height}rem` }}
      ></div>

      <ul className="flex gap-3" style={{ gap: `${0.125 * width}rem` }}>
        {items.map((item) => (
          <li
            key={item}
            className="z-10 flex cursor-pointer items-center justify-center rounded-md p-1 text-center transition hover:bg-slate-400 hover:bg-opacity-50"
            style={{ width: `${width ?? 6}rem`, height: `${height ?? 3}rem` }}
            onClick={(e) => {
              handleClick(e);
              onSelect(item);
            }}
          >
            <span className="flex items-center justify-center">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavList;
