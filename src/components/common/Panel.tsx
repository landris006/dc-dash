import React, { Ref } from 'react';

interface Props {
  children: React.ReactNode;
  bgColor?: string;
  classNames?: string;
  transparent?: boolean;
  onClick?: () => void;
}

const Panel = (
  { children, classNames, onClick, transparent }: Props,
  ref: Ref<HTMLDivElement>
) => {
  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`h-full rounded-md p-3 shadow-xl
      ${transparent !== false && 'bg-opacity-[0.45] dark:bg-opacity-[0.15]'}
      ${classNames ?? 'bg-slate-300'}`}
    >
      {children}
    </div>
  );
};

export default React.forwardRef(Panel);
