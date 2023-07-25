import * as d3 from "d3";
import tippy from "tippy.js";
import addYears from "date-fns/addYears";
import formatDate from "date-fns/format";
import { Instance } from "tippy.js";

import type { Source } from "models";
import { DEFAULT_ZOOM, MAX_ZOOM, useZoomSettings } from "store/timeline";
import { getGlobalMinMax } from "models/minmax";

import {
  BASE_SCALE_RANGE,
  LINE_COLOR,
  LINE_WIDTH,
  POINT_RADIUS,
  ROOT_MARGIN_BOTTOM,
  ROOT_MARGIN_LEFT,
  ROOT_MARGIN_TOP,
  TICK_PADDING,
  TIMELINE_GAP,
} from "./constants";

import { TimelineGroup, groupReleases } from "./timeline";
import styles from "./styles.module.css";

const originalTimeScale = d3
  .scaleTime()
  .domain([new Date(0), addYears(new Date(), 1)])
  .range([BASE_SCALE_RANGE, 0]);

export class D3Graph {
  private sources: Source[] = [];

  private timeScale: d3.ScaleTime<number, number>;
  private zoomBehaviour: d3.ZoomBehavior<SVGGElement, unknown>;

  private yAxis: d3.Axis<Date>;
  private yGridAxis: d3.Axis<Date>;

  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown>;
  private yGridAxisG: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;
  private yAxisG: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;

  private circlesContainer: d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    unknown
  >;
  private zoomContainer: d3.Selection<
    SVGGElement,
    unknown,
    HTMLElement,
    unknown
  >;
  private nameAxisG: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>;

  constructor(svgContainerSelector: string) {
    d3.select(svgContainerSelector).select("svg").remove();

    this.timeScale = originalTimeScale.copy();

    this.zoomBehaviour = d3
      .zoom<SVGGElement, unknown>()
      .scaleExtent([DEFAULT_ZOOM, MAX_ZOOM])
      .translateExtent([
        [0, 0],
        [0, Infinity],
      ])
      .on("zoom", this.onZoom.bind(this));

    this.svg = d3
      .select(svgContainerSelector)
      .append("svg")
      .attr("width", "100%")
      .attr(
        "height",
        BASE_SCALE_RANGE + ROOT_MARGIN_TOP + ROOT_MARGIN_BOTTOM + 1
      );

    const marginWrapper = this.svg
      .append("g")
      .attr("transform", `translate(${ROOT_MARGIN_LEFT}, ${ROOT_MARGIN_TOP})`);

    this.zoomContainer = marginWrapper
      .append("g")
      .attr("pointer-events", "all")
      .call(this.zoomBehaviour);

    this.zoomContainer
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("fill", "transparent");

    const axes = this.zoomContainer.append("g").attr("class", styles.axes);
    this.circlesContainer = this.zoomContainer.append("g");

    //
    // Axes
    //
    this.yAxis = d3
      .axisRight<Date>(this.timeScale)
      .tickPadding(TICK_PADDING)
      .ticks(10)
      .tickSizeOuter(0);

    this.yGridAxis = d3
      .axisLeft<Date>(this.timeScale)
      .tickFormat(() => "")
      .tickSizeInner(-(this.svg.node()?.clientWidth ?? 0))
      .ticks(10)
      .tickSizeOuter(0);

    this.yGridAxisG = axes
      .append("g")
      .classed(styles.gridAxis, true)
      .call(this.yGridAxis);

    this.yAxisG = axes.append("g").classed(styles.yAxis, true).call(this.yAxis);
    this.nameAxisG = this.svg.append("g").attr("class", styles.nameAxis);

    this.nameAxisG
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "100%")
      .attr("height", ROOT_MARGIN_TOP)
      .attr("class", styles.nameAxisMask);

    this.nameAxisG
      .append("line")
      .attr("x1", 0)
      .attr("y1", ROOT_MARGIN_TOP)
      .attr("x2", "100%")
      .attr("y2", ROOT_MARGIN_TOP + 1);

    window.addEventListener("resize", this.onWindowResize.bind(this));
  }

  update() {
    this.yGridAxisG.call(this.yGridAxis.scale(this.timeScale));
    this.yAxisG.call(this.yAxis.scale(this.timeScale));

    this.nameAxisG
      .selectAll("text")
      .data(this.sources, getSourceId)
      .join("text")
      .text((d) => d.name)
      .attr("x", (_, i) => (i + 1) * TIMELINE_GAP)
      .attr("y", Math.floor(ROOT_MARGIN_TOP / 1.5))
      .style("cursor", "pointer")
      .style("font-size", (d) => {
        if (d.name.length > 15) {
          return "0.6rem";
        }
        if (d.name.length > 10) {
          return "0.8rem";
        }
        return "1rem";
      })
      .on("click", (_, source) => {
        this.panToSources([source]);
      });

    this.nameAxisG
      .selectAll("line")
      .data(this.sources, (d, i) => (d ? getSourceId(d) : i))
      .join("line")
      .attr("x1", (_, i) => (i + 1.5) * TIMELINE_GAP)
      .attr("y1", ROOT_MARGIN_TOP)
      .attr("x2", (_, i) => (i + 1.5) * TIMELINE_GAP)
      .attr("y2", "100%");

    const sourceContainer = this.circlesContainer
      .selectAll("g")
      .data(this.sources, getSourceId)
      .join("g")
      .attr("transform", (_, i) => `translate(${(i + 1) * TIMELINE_GAP}, 0)`);

    sourceContainer
      .selectAll("path.timeline-axis")
      .data((d) =>
        d.minReleasePublishedAt && d.maxReleasePublishedAt
          ? [[d.minReleasePublishedAt, d.maxReleasePublishedAt]]
          : []
      )
      .join("path")
      .attr("class", "timeline-axis")
      .attr("d", ([minDate, maxDate]) => {
        return d3.line()([
          [0, this.timeScale(minDate)],
          [0, this.timeScale(maxDate)],
          [-POINT_RADIUS / 2, this.timeScale(maxDate)],
          [POINT_RADIUS / 2, this.timeScale(maxDate)],
          [0, this.timeScale(maxDate)],
        ]);
      })
      .style("stroke", LINE_COLOR)
      .attr("stroke-linecap", "round")
      .style("stroke-width", LINE_WIDTH);

    sourceContainer
      .selectAll("path.timeline-group-axis")
      .data((d) => groupReleases(d.releases, this.timeScale))
      .join("path")
      .attr("class", "timeline-group-axis")
      .on("mouseover", function (_, d) {
        // @ts-expect-error Tippy is present
        if (this._tippy) {
          // @ts-expect-error Tippy is present
          (this._tippy as Instance).destroy();
        }

        tippy(this as SVGCircleElement, {
          allowHTML: true,
          content: getPopupHTML(d),
          offset: [0, -20],
        });
      })
      .attr("d", (d) => {
        const minDate = d.releases[0].publishedAt;
        const maxDate = d.releases[d.releases.length - 1].publishedAt;

        return d3.line()([
          [0, this.timeScale(minDate)],
          [0, this.timeScale(maxDate)],
        ]);
      })
      .style("stroke", LINE_COLOR)
      .style("stroke-width", 2 * POINT_RADIUS)
      .attr("stroke-linecap", "round");
  }

  setSources(newSources: Source[]) {
    const delta = newSources.length - this.sources.length;
    this.sources = newSources;

    if (delta > 0) {
      this.panToSources(newSources);
    } else {
      this.update();
    }
  }

  // setZoom(k: number) {
  // const transform = d3 // @ts-expect-error Selection is ok
  //   .zoomTransform(this.zoomContainer);
  // this.zoomBehaviour.transform(this.zoomContainer, transform.scale(k));
  // this.update();
  // }

  onZoom({ transform }: d3.D3ZoomEvent<SVGGElement, unknown>) {
    this.timeScale = transform.rescaleY(originalTimeScale);
    useZoomSettings.getState().setValue(transform.k); // Notify zustand store
    this.update();
  }

  panToSources(sources: Source[]) {
    const [minDate, maxDate] = getGlobalMinMax(sources);
    const transform = d3 // @ts-expect-error Selection is ok
      .zoomTransform(this.zoomContainer)
      .translate(0, 0)
      .scale(1);
    this.timeScale = transform.rescaleY(originalTimeScale);
    const k =
      BASE_SCALE_RANGE / (this.timeScale(minDate) - this.timeScale(maxDate));

    this.zoomContainer
      .transition()
      .duration(500)
      .call(
        this.zoomBehaviour.transform,
        d3.zoomIdentity.scale(k).translate(0, -this.timeScale(maxDate))
      );
  }

  onWindowResize() {
    this.yGridAxis.tickSizeInner(-(this.svg.node()?.clientWidth ?? 0));
    this.yGridAxisG.call(this.yGridAxis);
  }

  cleanup() {
    window.removeEventListener("resize", this.onWindowResize);
  }
}

function getPopupHTML(group: TimelineGroup) {
  const multi = group.releases.length > 1;
  const first = group.releases[0],
    last = group.releases[group.releases.length - 1];

  return `
    <div>
      <p>${first.tagName}${multi ? ` &ndash; ${last.tagName}` : ""}</p>

      <p>
        ${formatDate(first.publishedAt, "PP")}
        ${multi ? ` &ndash; ${formatDate(last.publishedAt, "PP")}` : ""}
      </p>
    </div>
  `;
}

const getSourceId = (d: unknown) => (d as Source).id;
