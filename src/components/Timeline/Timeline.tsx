import { useEffect, useMemo, useRef } from "react";

import { useZoomSettings } from "store/timeline";
import { useSelectedSources } from "store/queries";
import { Source } from "models";

import { D3Graph } from "./D3Graph";
import { useDatasetsSettings } from "store/datasetSettings";
import { filterTags, monotonicTags } from "./timeline";

export default function Timeline() {
  const { sources } = useSelectedSources();
  // const { zoom } = useZoomSettings();
  const settings = useDatasetsSettings();
  const updateGraph = useRef<D3Graph>();

  const filteredSources = useMemo(() => {
    const loadedSources = sources
      .filter((source): source is Source => !!source)
      .filter((source) => source.releases.length > 0)
      .map((source) => {
        const { monotonic, display } = settings.getSetting(source.id);
        let releases = filterTags(source.releases, display);
        releases = monotonic ? monotonicTags(releases) : releases;

        return { ...source, releases };
      });

    return loadedSources;
  }, [sources, settings]);

  useEffect(() => {
    updateGraph.current = new D3Graph("#timeline");

    return () => {
      updateGraph.current?.cleanup();
    };
  }, []);

  useEffect(() => {
    updateGraph.current?.setSources(filteredSources);
  }, [filteredSources]);

  // useEffect(() => {
  //   updateGraph.current?.setZoom(zoom);
  // }, [zoom]);

  return <div id="timeline" className="h-full"></div>;
}
