import { Link } from 'react-router-dom';
import Composer from '../components/Composer';
import { useState } from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [composerOpen, setComposerOpen] = useState(false);
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl">Chirp Deck</span>
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/">
            Columns
          </Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/scheduled">
            Scheduled
          </Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/analytics">
            Analytics
          </Link>
        </div>
        <button
          onClick={() => setComposerOpen(true)}
          className="px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          Compose
        </button>
      </nav>
      <main className="flex-1 overflow-auto">{children}</main>
      {composerOpen && <Composer onClose={() => setComposerOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;
