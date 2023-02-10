import React from 'react';
import { MdArrowBackIos } from 'react-icons/md';

interface Props {
  page: number;
  setPagination: React.Dispatch<
    React.SetStateAction<{ page: number; limit: number }>
  >;
  hasMore: boolean | undefined;
}
const Pagination = ({ page, setPagination, hasMore }: Props) => {
  return (
    <div className="float-right w-fit rounded-t-md bg-slate-100 bg-opacity-[0.45] px-5 dark:bg-opacity-[0.15]">
      <div className="flex items-center">
        <button
          onClick={() =>
            page > 1 &&
            setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
          }
        >
          <MdArrowBackIos
            className={`text-indigo-700 transition dark:text-indigo-500 ${
              page > 1
                ? 'opacity-90 hover:scale-95 hover:text-indigo-600 hover:opacity-90 active:scale-90 dark:text-indigo-400'
                : 'cursor-default opacity-30'
            }`}
            size={50}
          />
        </button>

        <p className="flex w-fit min-w-[2ch] select-none justify-center text-4xl text-indigo-900">
          {page}
        </p>

        <button
          onClick={() =>
            hasMore &&
            setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
          }
        >
          <MdArrowBackIos
            className={`rotate-180 text-indigo-700 transition dark:text-indigo-300  ${
              hasMore
                ? 'opacity-90 hover:scale-95 hover:text-indigo-600 hover:opacity-90 active:scale-90'
                : 'cursor-default opacity-30'
            }`}
            size={50}
          />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
