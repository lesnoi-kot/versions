import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAPI } from "context/api";
import { useSources } from "store/sources";

import Spinner from "components/Spinner";

export default function AddDatasets() {
  const queryClient = useQueryClient();
  const api = useAPI();
  const [link, setLink] = useState("");
  const { addSourceToGraph } = useSources();

  const { mutate, isError, error, isLoading } = useMutation({
    mutationFn: () => api.addSources(link),
    onSuccess(source) {
      addSourceToGraph(source.id);
      setLink("");

      queryClient.invalidateQueries({
        queryKey: ["datasets"],
      });

      queryClient.setQueryData(["dataset", source.id], () => {
        return source;
      });
    },
  });

  return (
    <>
      <h2 className="text-xl dark:text-white h-8">Add repo</h2>
      <input
        type="text"
        name="repoUrl"
        placeholder="Link to a Github repo"
        className="w-full p-2 rounded-sm text-sm border"
        value={link}
        onChange={(e) => {
          const name = e.target.value;
          setLink(name);
        }}
      />
      {isError && <div className="text-red-600">{String(error)}</div>}
      <div className="flex flex-col gap-3">
        {isLoading && <Spinner className="m-auto" />}
        <button
          disabled={isLoading}
          hidden={isLoading}
          onClick={() => {
            mutate();
          }}
        >
          Add
        </button>
      </div>
    </>
  );
}
