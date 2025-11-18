import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { cancelScheduled, getScheduledTweets } from '../api/client';

const ScheduledPage = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery(['scheduled'], getScheduledTweets);
  const cancel = useMutation((id: string) => cancelScheduled(id), {
    onSuccess: () => queryClient.invalidateQueries(['scheduled'])
  });
  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-semibold">Scheduled Tweets</h2>
        <div className="bg-white shadow rounded-lg divide-y">
          {data?.map((item: any) => (
            <div key={item.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{item.text}</p>
                <p className="text-sm text-slate-500">{new Date(item.scheduledAt).toLocaleString()}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 rounded bg-slate-100 capitalize">{item.status}</span>
                {item.status === 'pending' && (
                  <button className="text-sm text-red-600" onClick={() => cancel.mutate(item.id)}>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
          {!data?.length && <p className="p-4 text-slate-500">No scheduled tweets yet.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScheduledPage;
