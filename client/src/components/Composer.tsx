import { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getScheduledTweets, postTweetNow, scheduleTweet, fetchCurrentUser } from '../api/client';

interface Props {
  onClose: () => void;
}

const Composer = ({ onClose }: Props) => {
  const queryClient = useQueryClient();
  const { data: user } = useQuery(['me'], fetchCurrentUser);
  const [mode, setMode] = useState<'now' | 'schedule'>('now');
  const [text, setText] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [thread, setThread] = useState<string[]>(['']);
  const [accountId, setAccountId] = useState(user?.accounts?.[0]?.id ?? '');

  const mutation = useMutation((payload: any) => (mode === 'now' ? postTweetNow(payload) : scheduleTweet(payload)), {
    onSuccess: () => {
      queryClient.invalidateQueries(['scheduled']);
      setText('');
      onClose();
    }
  });

  const submit = () => {
    const payload: any = { twitterAccountId: accountId, text };
    if (mode === 'schedule') payload.scheduledAt = scheduledAt;
    if (thread.some((t) => t.trim())) payload.threadParts = thread.filter((t) => t.trim()).map((t) => ({ text: t }));
    mutation.mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[30rem] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Compose</h2>
          <button onClick={onClose}>Close</button>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-slate-700">Account</label>
          <select
            className="w-full border rounded px-2 py-1"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
          >
            {user?.accounts?.map((a: any) => (
              <option key={a.id} value={a.id}>
                @{a.screenName}
              </option>
            ))}
          </select>
        </div>
        <textarea
          className="w-full border rounded p-2 h-24"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's happening?"
        />
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Thread parts</span>
            <button className="text-sky-600 text-sm" onClick={() => setThread([...thread, ''])}>
              Add part
            </button>
          </div>
          {thread.map((part, idx) => (
            <textarea
              key={idx}
              className="w-full border rounded p-2 h-20"
              value={part}
              onChange={(e) => {
                const next = [...thread];
                next[idx] = e.target.value;
                setThread(next);
              }}
              placeholder={`Tweet ${idx + 1}`}
            />
          ))}
        </div>
        <div className="flex space-x-4 items-center">
          <label className="flex items-center space-x-2 text-sm">
            <input type="radio" checked={mode === 'now'} onChange={() => setMode('now')} />
            <span>Tweet now</span>
          </label>
          <label className="flex items-center space-x-2 text-sm">
            <input type="radio" checked={mode === 'schedule'} onChange={() => setMode('schedule')} />
            <span>Schedule</span>
          </label>
          {mode === 'schedule' && (
            <input
              type="datetime-local"
              className="border rounded px-2 py-1"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          )}
        </div>
        <button
          onClick={submit}
          className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
          disabled={mutation.isLoading}
        >
          {mode === 'now' ? 'Tweet' : 'Schedule'}
        </button>
        {mutation.isError && <p className="text-sm text-red-600">Something went wrong.</p>}
      </div>
    </div>
  );
};

export default Composer;
