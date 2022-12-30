import React from "react";

interface Props {
  children: React.ReactNode;
  bgColor?: string;
  classNames?: string;
  onClick?: () => void;
}

const Panel = ({ children, classNames, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-md p-3 shadow-xl ${classNames ?? "bg-gray-300"}`}
    >
      {children}
    </div>
  );
};

export default Panel;
