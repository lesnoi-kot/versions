import Spinner from "components/Spinner";
import { Source } from "models";

type Props = {
  source: Source;
  children?: React.ReactNode;
};

export default function Item({ children, source }: Props) {
  return (
    <div className="flex flex-row w-full items-center gap-3">
      <a title={source.description} href={source.url} target="_blank">
        {source.name}
      </a>
      <div>{source.isFetching && <Spinner className="scale-75" />}</div>
      {children}
    </div>
  );
}
