import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  onClick?: () => void;
}

const ListItem = ({ children, ...props}: Props) => {
  return (
    <li
      className="
        cursor-pointer rounded bg-slate-100 bg-opacity-[0.45] p-3
        shadow-md backdrop-blur-sm transition hover:bg-slate-400
        hover:bg-opacity-[0.45]"
      {...props}
    >
      {children}
    </li>
  );
};

export default ListItem;
