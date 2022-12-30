import React from "react";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const ListItem = ({ children, onClick }: Props) => {
  return (
    <li
      onClick={onClick}
      className="cursor-pointer rounded bg-gray-100 p-3 shadow-md transition hover:bg-slate-400 active:bg-gray-100"
    >
      {children}
    </li>
  );
};

export default ListItem;
