import * as d3 from "d3";

export const BASE_SCALE_RANGE = 700;

export const TIMELINE_GAP = 120;
export const TICK_PADDING = 10;
export const ROOT_MARGIN_LEFT = 0;
export const ROOT_MARGIN_TOP = 40;
export const ROOT_MARGIN_BOTTOM = 0;
export const POINT_RADIUS = 10;

export const POINT_COLOR = "#ffc14b";
export const LINE_COLOR = POINT_COLOR;
export const LINE_WIDTH = 3;

export const AXIS_STROKE = "black";

export const ZOOM_SCALE_BREAKPOINTS = [
  [30, d3.timeYear.every(1)],
  [60, d3.timeMonth.every(6)],
  [90, d3.timeMonth.every(1)],
  [120, d3.timeWeek.every(1)],
  [Infinity, d3.timeDay.every(1)],
] as const;

export function getTickInterval(zoom: number): d3.AxisTimeInterval | null {
  for (const [threshold, interval] of ZOOM_SCALE_BREAKPOINTS) {
    if (zoom <= threshold) {
      return interval;
    }
  }

  return d3.timeDay.every(1);
}
