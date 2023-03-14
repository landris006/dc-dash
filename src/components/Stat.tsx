import { useRef, useState } from 'react';
import { BsTriangleFill } from 'react-icons/bs';
import { ImSpinner8 } from 'react-icons/im';

const Stat = ({
  prefix,
  value,
  tooltipText,
  suffix,
}: {
  prefix: React.ReactNode | string;
  value: number | string | undefined;
  tooltipText: string;
  suffix?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const tooltipElement = useRef<HTMLParagraphElement>(null);

  return (
    <div className="relative w-min">
      <span
        onMouseOver={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex items-center gap-1 whitespace-nowrap"
      >
        {value == undefined ? (
          <ImSpinner8 size={28} className="animate-spin" />
        ) : (
          <>
            {prefix} {value} {suffix}
          </>
        )}
      </span>

      <p
        ref={tooltipElement}
        className="absolute left-1/2 -top-10 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-white p-1 shadow-xl"
        style={{
          visibility: isHovered ? 'visible' : 'hidden',
        }}
      >
        {tooltipText}

        <BsTriangleFill
          size={10}
          className="pointer-events-none absolute left-1/2 -bottom-2 -translate-x-1/2 rotate-180 text-white"
        />
      </p>
    </div>
  );
};

export default Stat;
