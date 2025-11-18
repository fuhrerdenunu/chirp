import { useQuery } from '@tanstack/react-query';
import { fetchColumnFeed } from '../api/client';

interface Props {
  column: any;
}

const ColumnView = ({ column }: Props) => {
  const { data, isLoading, refetch } = useQuery(['column', column.id], () => fetchColumnFeed(column.id));
  return (
    <div className="bg-white rounded-lg shadow p-4 w-80 min-w-[20rem] flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold capitalize">{column.type}</h3>
          <p className="text-xs text-slate-500">{column.config?.query || column.config?.listId || ''}</p>
        </div>
        <button className="text-sm text-sky-600" onClick={() => refetch()}>
          Refresh
        </button>
      </div>
      <div className="flex-1 overflow-auto space-y-3">
        {isLoading && <p>Loading…</p>}
        {data?.data?.map((tweet: any) => (
          <div key={tweet.id} className="border rounded p-2 hover:bg-slate-50">
            <div className="text-sm font-semibold">{tweet.author?.name || 'Author'}</div>
            <div className="text-xs text-slate-500">@{tweet.author?.username}</div>
            <p className="text-sm mt-1 whitespace-pre-wrap">{tweet.text}</p>
            <div className="text-xs text-slate-400">{new Date(tweet.created_at ?? Date.now()).toLocaleString()}</div>
          </div>
        ))}
        {!isLoading && !data?.data?.length && <p className="text-sm text-slate-500">No tweets found.</p>}
      </div>
    </div>
  );
};

export default ColumnView;
