import { useState } from "react";

const Stat = ({
  prefix,
  value,
  tooltip,
  suffix,
}: {
  prefix: React.ReactNode | string;
  value: number | string;
  tooltip: string;
  suffix?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <span
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-1 whitespace-nowrap"
      >
        {prefix} {value} {suffix}
      </span>
      <p
        className="absolute left-1/2 -top-9 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-white p-1 shadow-xl"
        style={{
          visibility: isHovered ? "visible" : "hidden",
        }}
      >
        {tooltip}
      </p>
    </div>
  );
};

export default Stat;
