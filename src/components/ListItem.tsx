import React from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const ListItem = ({ children, onClick }: Props) => {
  return (
    <li
      onClick={onClick}
      className="
        cursor-pointer rounded bg-slate-100 bg-opacity-[0.45] p-3
        shadow-md backdrop-blur-sm transition hover:bg-slate-400
        hover:bg-opacity-[0.45]"
    >
      {children}
    </li>
  );
};

export default ListItem;
