import { DEFAULT_ZOOM, MAX_ZOOM, useZoomSettings } from "store/timeline";

export default function Zoom() {
  const { increase, decrease, setValue, zoom } = useZoomSettings();

  return (
    <div className="flex flex-row gap-2">
      <button className="px-2 py-1" onClick={increase} title="Zoom in">
        +
      </button>
      <button className="px-2 py-1" onClick={decrease} title="Zoom out">
        –
      </button>
      <input
        type="range"
        id="volume"
        name="volume"
        min={DEFAULT_ZOOM}
        max={MAX_ZOOM}
        step={1}
        value={zoom}
        onChange={(e) => {
          setValue(Number(e.target.value));
        }}
        className="w-full"
      />
    </div>
  );
}
