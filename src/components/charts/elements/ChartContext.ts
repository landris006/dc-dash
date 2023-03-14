import React from 'react';
import { createContext, RefObject, SetStateAction } from 'react';

const defaultWidth = 960;
const defaultHeight = 600;
const defaultMargin = { top: 20, right: 20, bottom: 75, left: 75 };
const defaultValues = {
  width: defaultWidth,
  height: defaultHeight,
  margin: { top: 20, right: 20, bottom: 75, left: 75 },
  innerWidth: defaultWidth - defaultMargin.left - defaultMargin.right,
  innerHeight: defaultHeight - defaultMargin.top - defaultMargin.bottom,
  containerRef: null as RefObject<HTMLDivElement> | null,
  svgRef: null as RefObject<SVGSVGElement> | null,
  allowInteractions: true,
  setAllowInteractions: (() => {
    throw new Error('setAllowInteractions not set');
  }) as React.Dispatch<SetStateAction<boolean>>,
};

export const ChartContext = createContext(defaultValues);
