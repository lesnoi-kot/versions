import * as d3 from "d3-array";

import { Source } from "./models";
import { getPublishedAt } from "./getters";

export function getGlobalMinMax(sources: Source[]): [Date, Date] {
  let minDate: Date = new Date();
  let maxDate: Date = new Date(0);

  sources.forEach((source) => {
    const tmpMin = d3.min(source.releases, getPublishedAt);
    const tmpMax = d3.max(source.releases, getPublishedAt);

    if (!tmpMin || !tmpMax) {
      return;
    }

    if (tmpMin < minDate) {
      minDate = tmpMin;
    }

    if (tmpMax > maxDate) {
      maxDate = tmpMax;
    }
  });

  return [minDate, maxDate];
}
