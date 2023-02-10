import { NextRouter } from 'next/router';
import { BsFillDoorOpenFill } from 'react-icons/bs';

const BackToServers = ({ router }: { router: NextRouter }) => {
  return (
    <div
      className="flex cursor-pointer items-center text-slate-600 hover:text-slate-800"
      onClick={() => router.push('/')}
    >
      <p className="flex items-center text-2xl">Back to servers</p>
      <BsFillDoorOpenFill size={30} />
    </div>
  );
};

export default BackToServers;
