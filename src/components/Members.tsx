import { useState } from 'react';
import Panel from './ui/Panel';
import { GoSearch } from 'react-icons/go';
import MemberList from './MemberList';
import { ImSpinner8 } from 'react-icons/im';
import { MdArrowBackIos } from 'react-icons/md';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import type { AppRouterTypes } from '../utils/trpc';
import { BsThreeDotsVertical } from 'react-icons/bs';

type QueryParams =
  AppRouterTypes['guildMember']['getPaginatedMembers']['input']['queryParams'];

const Members = () => {
  const guildID = useRouter().query.guildID as string;

  const [nickname, setNickname] = useState('');
  const [queryParams, setQueryParams] = useState<QueryParams>({
    nickname: '',
    orderBy: {
      nickname: 'asc',
    },
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading, isError } =
    trpc.guildMember.getPaginatedMembers.useQuery({
      guildID,
      queryParams,
      ...pagination,
    });

  const initSearch = () => {
    setQueryParams((prev) => ({ ...prev, nickname }));
  };

  return (
    <>
      <Panel classNames="bg-gray-300 flex-1 flex flex-col">
        <div>
          <h2 className="h- text-3xl font-semibold">Members</h2>
          <hr className="h-1 rounded bg-black" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex w-fit items-stretch gap-2 py-3">
            <input
              value={nickname}
              placeholder="Search members..."
              onChange={(e) => setNickname(e.target.value)}
              type="text"
              className="h-10 rounded-md p-1 text-xl"
            />

            <button
              onClick={initSearch}
              className="flex items-center gap-2 rounded-md bg-teal-400 p-1 px-5 transition hover:bg-teal-500 active:bg-teal-400"
            >
              <p className="text-xl font-semibold">Search</p>
              {isLoading ? (
                <ImSpinner8 size={20} className="animate-spin" />
              ) : (
                <GoSearch size={20} />
              )}
            </button>
          </div>

          <div className="mb-1 flex items-center justify-center ">
            <button
              onClick={() =>
                pagination.page > 1 &&
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              <MdArrowBackIos
                className={`text-teal-600 transition  ${
                  pagination.page <= 1
                    ? 'cursor-default opacity-30'
                    : 'hover:scale-95 hover:text-teal-500'
                }`}
                size={50}
              />
            </button>
            <p className="select-none text-4xl text-teal-900">
              {pagination.page}
            </p>
            <button
              onClick={() =>
                data?.hasMore &&
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              <MdArrowBackIos
                className={`rotate-180 text-teal-600 transition ${
                  data?.hasMore
                    ? 'hover:scale-95 hover:text-teal-500'
                    : 'cursor-default opacity-30'
                }`}
                size={50}
              />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3">
            <p className="text-xl">Loading members...</p>
          </div>
        ) : isError || (!isLoading && !data.guildMembers.length) ? (
          <div className="flex items-center gap-3">
            <p className="text-xl">No members found...</p>
          </div>
        ) : (
          <MemberList guildMembers={data.guildMembers} />
        )}
      </Panel>
    </>
  );
};

export default Members;
