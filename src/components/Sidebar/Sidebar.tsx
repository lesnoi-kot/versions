import AddDatasets from "./AddDatasets";
import AllDatasets from "./AllDatasets";
import SelectedDatasets from "./SelectedDatasets";
import Zoom from "./Zoom";

export default function Sidebar() {
  return (
    <div className="flex flex-col gap-8 pb-4">
      <div className="flex flex-col gap-2">
        <AllDatasets />
      </div>
      <SelectedDatasets />
      <div>
        <h2 className="text-xl dark:text-white mb-2">View</h2>
        <Zoom />
      </div>
      <div className="flex flex-col gap-2">
        <AddDatasets />
      </div>
    </div>
  );
}
