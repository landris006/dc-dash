import React, { HTMLAttributes, Ref } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Panel = (
  { children, className, onClick, ...props }: Props,
  ref: Ref<HTMLDivElement>
) => {
  return (
    <div
      {...props}
      ref={ref}
      onClick={onClick}
      className={`h-full rounded-md bg-opacity-[0.45] p-3 shadow-xl
      ${className}`}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(Panel);
