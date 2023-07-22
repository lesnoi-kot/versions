import { useSources } from "store/sources";
import { useSelectedSources } from "store/queries";
import Spinner from "components/Spinner";
import { Source } from "models";
import {
  DisplayType,
  useDatasetSettings,
  useDatasetsSettings,
} from "store/datasetSettings";

import Item from "./Item";

export default function SelectedDatasets() {
  const { isLoading, isSuccess, isError, sources } = useSelectedSources();

  if (sources.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-xl pb-2">Selected</h2>
      <div className="flex flex-col gap-4">
        {sources.map(
          (source) => source && <DatasetItem key={source.id} source={source} />
        )}
        {isLoading && <Spinner className="m-auto" />}
      </div>
    </div>
  );
}

function DatasetItem({ source }: { source: Source }) {
  const { deleteSourceFromGraph } = useSources();
  const setting = useDatasetSettings(source.id);
  const { setSetting } = useDatasetsSettings();

  return (
    <div>
      <Item key={source.id} source={source}>
        <button
          className="ml-auto px-3 py-1"
          title="Remove dataset"
          onClick={() => {
            deleteSourceFromGraph(source.id);
          }}
        >
          &times;
        </button>
      </Item>
      <div className="text-sm">
        <label>
          <input
            type="checkbox"
            name={`monotonic_${source.id}`}
            checked={setting.monotonic}
            onChange={(e) => {
              setSetting(source.id, {
                ...setting,
                monotonic: e.target.checked,
              });
            }}
          />
          <span className="pointer-events-none">&nbsp;Monotonic releases</span>
        </label>

        <fieldset className="flex flex-row gap-2">
          {(["major", "minor", "all"] as DisplayType[]).map((value) => (
            <label key={value}>
              <input
                type="radio"
                name={`display_${source.id}`}
                value={value}
                checked={setting.display === value}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSetting(source.id, { ...setting, display: value });
                  }
                }}
              />
              &nbsp;{value}
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
