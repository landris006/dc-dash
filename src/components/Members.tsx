import { FormEvent, MouseEventHandler, useEffect, useState } from 'react';
import Panel from './ui/Panel';
import MemberList from './MemberList';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import Pagination from './Pagination';
import { BsSortDownAlt, BsSortUpAlt } from 'react-icons/bs';
import { GrClose } from 'react-icons/gr';

const Members = () => {
  const guildID = useRouter().query.guildID as string;

  const [nickname, setNickname] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [nickameFilter, setNicknameFilter] = useState('');
  const [orderBy, setOrderBy] = useState<{ [key: string]: Ordering }>({
    nickname: 'asc',
    hoursActive: undefined,
    joinedAt: undefined,
  });

  const { data, isLoading, isError } =
    trpc.guildMember.getPaginatedMembers.useQuery(
      {
        guildID,
        queryParams: {
          nickname: nickameFilter,
          orderBy,
        },
        ...pagination,
      },
      {
        onSuccess: (data) => {
          if (!data.guildMembers.length) {
            setPagination((prev) => ({ ...prev, page: 1 }));
          }
        },
      }
    );

  const initSearch = (e: FormEvent) => {
    e.preventDefault();

    setNicknameFilter(nickname);
  };

  const handleOrderByChange = (key: string) => {
    setOrderBy((prev) => {
      const newOrderBy = Object.fromEntries(
        Object.entries(prev).map(([k]) => [k, undefined as Ordering])
      );

      newOrderBy[key] = prev[key] === 'asc' ? 'desc' : 'asc';

      return newOrderBy;
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setNicknameFilter(nickname);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [nickname]);

  return (
    <>
      <Panel classNames="bg-gray-300 flex-1 flex flex-col">
        <div>
          <h2 className="h- text-3xl font-semibold">Members</h2>
          <hr className="h-1 rounded bg-black" />
        </div>

        <div className="w-fit sm:flex sm:justify-between">
          <form onSubmit={initSearch}>
            <div className="flex w-fit flex-wrap items-stretch gap-2 py-3 md:flex-nowrap">
              <div className="flex">
                <input
                  value={nickname}
                  placeholder="Search members..."
                  onChange={(e) => setNickname(e.target.value)}
                  type="text"
                  className="h-10 rounded-md bg-slate-100 bg-opacity-60 p-1 text-xl"
                />
                <button className="-ml-6 w-5" onClick={() => setNickname('')}>
                  <GrClose />
                </button>
              </div>

              <div className="relative flex flex-col gap-2  sm:flex-row">
                <button
                  onClick={() => setFiltersOpen((prev) => !prev)}
                  className="
                    relative flex h-10 items-center justify-center
                    rounded-md bg-indigo-500 bg-opacity-70 px-3
                    transition hover:bg-indigo-600 hover:bg-opacity-70
                    active:bg-indigo-700 active:bg-opacity-70"
                >
                  <p className="mr-2 text-xl font-semibold">Sort</p>
                  {filtersOpen ? <GrClose /> : <BsSortDownAlt />}
                </button>

                {filtersOpen && (
                  <div
                    className={`
                      absolute left-1/2 top-full z-10 flex -translate-x-1/2
                      flex-col items-start gap-2 rounded-md bg-slate-200
                      p-2 text-lg sm:relative sm:left-0 sm:top-0 sm:z-auto
                      sm:grid sm:translate-x-0 sm:items-stretch sm:bg-transparent sm:p-0
                    `}
                    style={{
                      gridTemplateColumns: '1fr '.repeat(
                        Object.keys(orderBy).length
                      ),
                    }}
                  >
                    {Object.entries(orderBy).map(([key, value]) => (
                      <SortButton
                        key={key}
                        text={keyToLabelMap.get(key) ?? key}
                        value={value}
                        onClick={() => handleOrderByChange(key)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        <Pagination
          hasMore={data?.hasMore}
          page={pagination.page}
          setPagination={setPagination}
        />

        <MemberList
          guildMembers={data?.guildMembers}
          isLoading={isLoading}
          isError={isError}
          pagination={pagination}
        />
      </Panel>
    </>
  );
};

export default Members;

type Ordering = 'asc' | 'desc' | undefined;
const SortButton = ({
  text,
  value,
  onClick,
}: {
  text: string;
  value?: Ordering;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex
      w-full items-center justify-start rounded-md bg-slate-200
      bg-opacity-60 px-2
      text-xl hover:bg-slate-300
      hover:bg-opacity-60 active:bg-slate-400 active:bg-opacity-60 sm:justify-evenly"
    >
      <p className="mr-2 text-lg ">{text}</p>
      <div className={`${value === undefined && 'invisible'}`}>
        {value === 'asc' ? <BsSortDownAlt /> : <BsSortUpAlt />}
      </div>
    </button>
  );
};

const keyToLabelMap = new Map<string, string>([
  ['nickname', 'Nickname'],
  ['hoursActive', 'Level'],
  ['joinedAt', 'Join Date'],
]);
