import { FormEvent, useState } from 'react';
import Panel from './ui/Panel';
import { GoSearch } from 'react-icons/go';
import MemberList from './MemberList';
import { ImSpinner8 } from 'react-icons/im';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import type { AppRouterTypes } from '../utils/trpc';
import Pagination from './Pagination';

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

  const { data, isLoading, isError, status } =
    trpc.guildMember.getPaginatedMembers.useQuery({
      guildID,
      queryParams,
      ...pagination,
    });

  const initSearch = (e: FormEvent) => {
    e.preventDefault();

    setPagination((prev) => ({ ...prev, page: 1 }));
    setQueryParams((prev) => ({ ...prev, nickname }));
  };

  return (
    <>
      <Panel classNames="bg-gray-300 flex-1 flex flex-col">
        <div>
          <h2 className="h- text-3xl font-semibold">Members</h2>
          <hr className="h-1 rounded bg-black" />
        </div>

        <div className="w-fit sm:flex sm:justify-between">
          <form onSubmit={initSearch}>
            <div className="flex w-fit flex-wrap items-stretch gap-2 py-3 sm:flex-nowrap">
              <input
                value={nickname}
                placeholder="Search members..."
                onChange={(e) => setNickname(e.target.value)}
                type="text"
                className="h-10 rounded-md bg-slate-100 bg-opacity-60 p-1 text-xl"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-md bg-indigo-500 bg-opacity-70 p-1 px-5 transition hover:bg-indigo-600 hover:bg-opacity-70 active:bg-indigo-700"
                >
                  <p className="text-xl font-semibold">Search</p>
                  {isLoading ? (
                    <ImSpinner8 size={20} className="animate-spin" />
                  ) : (
                    <GoSearch size={20} />
                  )}
                </button>

                {/* <button className="relative  flex aspect-square h-10 items-center justify-center rounded-md bg-slate-200 bg-opacity-60 hover:bg-slate-300 hover:bg-opacity-60">
                  <BsThreeDotsVertical size={30} />
                </button> */}
              </div>
            </div>
          </form>
        </div>

        {isError ||
          (status === 'success' && data.guildMembers.length === 0) || (
            <Pagination
              hasMore={data?.hasMore}
              page={pagination.page}
              setPagination={setPagination}
            />
          )}

        {/* <div className="mb-3 flex gap-2">
          <button className="h-9 rounded-md bg-slate-600">asd</button>
          <button className="h-30 h-9 rounded-md bg-slate-600">asd2</button>
        </div> */}

        <MemberList
          guildMembers={data?.guildMembers}
          isLoading={isLoading}
          isError={isError}
        />
      </Panel>
    </>
  );
};

export default Members;
