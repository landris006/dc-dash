import React from "react";
import { CgRedo } from "react-icons/cg";

interface Props {
  onClick: () => void;
  isLoading: boolean;
  maxRetries?: number;
}

const RefreshButton = ({ onClick, isLoading, maxRetries }: Props) => {
  const [numberOfRetries, setNumberOfRetries] = React.useState(0);

  if (maxRetries && numberOfRetries >= maxRetries) {
    return <></>;
  }

  return (
    <button
      about="Refresh"
      onClick={() => {
        onClick();
        setNumberOfRetries((prev) => prev + 1);
      }}
      className="flex h-fit items-center justify-center rounded-md bg-emerald-400 transition hover:bg-emerald-500 active:bg-emerald-400"
    >
      <CgRedo size={25} className={`${isLoading && "animate-spin"}`} />
    </button>
  );
};

export default RefreshButton;
