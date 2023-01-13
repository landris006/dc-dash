import { useState } from "react";
import Panel from "./ui/Panel";
import { GoSearch } from "react-icons/go";
import MemberList from "./MemberList";

const Members = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <Panel classNames="bg-gray-300 flex-1 flex flex-col">
        <div>
          <h2 className="h- text-3xl font-semibold">Members</h2>
          <hr className="h-1 rounded bg-black" />
        </div>

        <div className="flex items-center gap-2 py-3">
          <input
            value={searchQuery}
            placeholder="Search members..."
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            type="text"
            className="h-10 rounded-md p-1 text-xl"
          />
          <GoSearch size={30} />
        </div>

        <MemberList />
      </Panel>
    </>
  );
};

export default Members;
