import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAPI } from "context/api";
import { useSources } from "store/sources";

import Item from "./Item";
import Spinner from "components/Spinner";

const PAGE_COUNT = 10;

export default function AllDatasets() {
  const api = useAPI();
  const [page, setPage] = useState(0);
  const [name, setName] = useState("");

  const { isLoading, isSuccess, data } = useQuery({
    queryFn: () => api.getSources({ page, name, count: PAGE_COUNT }),
    queryKey: ["datasets", { page, name }],
    keepPreviousData: true,
  });
  const { data: sources = [], totalCount = 0 } = data || {};
  const maxPage = Math.ceil(totalCount / PAGE_COUNT);
  const { selectedSources, addSourceToGraph } = useSources();

  return (
    <>
      <h2 className="text-xl dark:text-white h-8">Repositories</h2>
      <input
        type="text"
        name="sourceName"
        placeholder="Find"
        className="w-full p-2 rounded-sm border"
        value={name}
        onChange={(e) => {
          const name = e.target.value;
          setName(name);
        }}
      />
      <div className="flex flex-col gap-3">
        {isLoading && <Spinner className="m-auto" />}
        {isSuccess && sources.length === 0 && <span>Nothing was found</span>}
        {sources.map((source) => (
          <Item key={source.id} source={source}>
            <div className="ml-auto">
              {selectedSources.includes(source.id) ? (
                <span
                  title="Dataset is added"
                  className="px-1 py-1 cursor-default text-gray-700"
                >
                  ✓
                </span>
              ) : (
                <button
                  title="Add the dataset"
                  className="px-2 py-1"
                  onClick={() => {
                    addSourceToGraph(source.id);
                  }}
                >
                  +
                </button>
              )}
            </div>
          </Item>
        ))}
      </div>

      <div className="flex flex-row items-center mt-2">
        <button
          className="leading-none"
          disabled={page === 0}
          onClick={() => {
            setPage((page) => page - 1);
          }}
          title="Previous page"
        >
          🡠
        </button>
        <div className="text-sm grow text-center text-gray-700 dark:text-gray-100">
          {page + 1}/{maxPage}
        </div>
        <button
          disabled={page + 1 === maxPage}
          onClick={() => {
            setPage((page) => page + 1);
          }}
          className="leading-none"
          title="Next page"
        >
          🡢
        </button>
      </div>
    </>
  );
}
