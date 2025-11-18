import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '../layouts/DashboardLayout';
import { fetchCurrentUser, getAnalytics } from '../api/client';
import { useState } from 'react';

const AnalyticsPage = () => {
  const { data: user } = useQuery(['me'], fetchCurrentUser);
  const [accountId, setAccountId] = useState<string | undefined>(user?.accounts?.[0]?.id);
  const { data } = useQuery(['analytics', accountId], () => getAnalytics(accountId || ''), {
    enabled: !!accountId
  });

  return (
    <DashboardLayout>
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Analytics</h2>
          <select
            className="border rounded px-2 py-1"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {user?.accounts?.map((a: any) => (
              <option value={a.id} key={a.id}>
                @{a.screenName}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-slate-500">Tweets posted</p>
            <p className="text-2xl font-semibold">{data?.tweetsPosted ?? 0}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-slate-500">Scheduled executed</p>
            <p className="text-2xl font-semibold">{data?.scheduledExecuted ?? 0}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-slate-500">Likes</p>
            <p className="text-2xl font-semibold">{data?.likes ?? 0}</p>
          </div>
          <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-slate-500">Retweets</p>
            <p className="text-2xl font-semibold">{data?.retweets ?? 0}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
