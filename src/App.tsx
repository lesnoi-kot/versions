import Sidebar from "components/Sidebar/Sidebar";
import Timeline from "components/Timeline";

function App() {
  return (
    <>
      <h1 className="text-4xl">
        Versions
        <sup>
          <abbr
            className="ml-3 text-xl"
            title="Browse and compare GitHub repo's releases visually"
          >
            ?
          </abbr>
        </sup>
      </h1>
      <main className="flex gap-8 grow">
        <div className="w-1/4">
          <Sidebar />
        </div>
        <div className="w-3/4">
          <Timeline />
        </div>
      </main>
    </>
  );
}

export default App;
