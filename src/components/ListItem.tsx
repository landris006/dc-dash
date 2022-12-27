import React from "react";

interface Props {
  children: React.ReactNode;
}

const ListItem = ({ children }: Props) => {
  return (
    <li className="cursor-pointer rounded bg-gray-100 p-3 shadow-md transition hover:bg-slate-400 active:bg-gray-100">
      {children}
    </li>
  );
};

export default ListItem;
