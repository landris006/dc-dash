import { NextRouter } from 'next/router';
import { BsFillDoorOpenFill } from 'react-icons/bs';

const BackToServers = ({ router }: { router: NextRouter }) => {
  return (
    <div
      className="flex w-fit cursor-pointer items-center text-slate-600 hover:text-slate-800 dark:text-slate-200 dark:hover:text-slate-400"
      onClick={() => router.push('/')}
    >
      <p className="text-1xl flex items-center">Back to servers</p>
      <BsFillDoorOpenFill size={20} />
    </div>
  );
};

export default BackToServers;
