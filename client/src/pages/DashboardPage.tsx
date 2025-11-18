import { useQuery } from '@tanstack/react-query';
import { createColumn, getColumns } from '../api/client';
import ColumnView from '../components/ColumnView';
import DashboardLayout from '../layouts/DashboardLayout';

const DashboardPage = () => {
  const { data: columns, refetch } = useQuery(['columns'], getColumns);

  const addSearchColumn = async () => {
    await createColumn({ type: 'search', twitterAccountId: columns?.[0]?.twitterAccountId, config: { query: 'reactjs' } });
    refetch();
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Columns</h2>
          <button className="px-3 py-2 bg-slate-200 rounded" onClick={addSearchColumn}>
            Add search column
          </button>
        </div>
        <div className="flex space-x-4 overflow-x-auto">
          {columns?.map((column: any, index: number) => (
            <ColumnView key={column.id} column={column} />
          ))}
          {!columns?.length && <p className="text-slate-500">No columns yet. Add one above.</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
