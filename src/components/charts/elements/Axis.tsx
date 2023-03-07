import React, { SVGProps, useEffect, useRef } from 'react';
import { Axis } from 'd3-axis';
import { NumberValue, select } from 'd3';

interface Props extends SVGProps<SVGGElement> {
  axis: Axis<Date | NumberValue>;
}

const Axis = ({ axis, ...props }: Props) => {
  const axisElement = useRef<SVGGElement>(null);

  useEffect(() => {
    if (axisElement.current) {
      select(axisElement.current).call(axis);
    }
  }, [axis]);

  return <g ref={axisElement} {...props}></g>;
};

export default Axis;
