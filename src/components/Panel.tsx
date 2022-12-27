import React from "react";

interface Props {
  children: React.ReactNode;
}

const Panel = ({ children }: Props) => {
  return (
    <div className="my-3 overflow-auto rounded-md bg-gray-300 p-3">
      {children}
    </div>
  );
};

export default Panel;
