import { useEffect, useRef, useState } from "react";
import { ImSpinner8 } from "react-icons/im";

const calculatePosition = (element: HTMLParagraphElement | null) => {
  if (!element) {
    return;
  }

  const { left, right } = element.getBoundingClientRect();

  if (left < 0) {
    element.style.transform = "translateX(0)";
    element.style.left = "0px";
  }

  if (right > window.innerWidth) {
    element.style.transform = "translateX(0)";
    element.style.right = "0px";
  }
};

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

  useEffect(() => {
    calculatePosition(tooltipElement.current);

    window.addEventListener("resize", () =>
      calculatePosition(tooltipElement.current)
    );
    window.removeEventListener("resize", () =>
      calculatePosition(tooltipElement.current)
    );
  }, []);

  return (
    <div className="relative">
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
        className="absolute left-1/2 -top-9 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-white p-1 shadow-xl"
        style={{
          visibility: isHovered ? "visible" : "hidden",
        }}
      >
        {tooltipText}
      </p>
    </div>
  );
};

export default Stat;
