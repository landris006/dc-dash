import React, { Ref } from "react";

interface Props {
  children: React.ReactNode;
  bgColor?: string;
  classNames?: string;
  onClick?: () => void;
}

const Panel = (
  { children, classNames, onClick }: Props,
  ref: Ref<HTMLDivElement>
) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`rounded-md p-3 shadow-xl ${classNames ?? "bg-gray-300"}`}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(Panel);
