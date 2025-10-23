interface ServiceRecord {
  date: string;
  type: string;
  mileage?: number;
  description: string;
  cost?: number;
}

interface ServiceHistoryProps {
  records: ServiceRecord[];
}

export function ServiceHistory({ records }: ServiceHistoryProps) {
  if (!records || records.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-xl font-semibold text-white">Service History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-800">
            <tr>
              <th className="pb-3 font-medium text-gray-400">Date</th>
              <th className="pb-3 font-medium text-gray-400">Type</th>
              <th className="pb-3 font-medium text-gray-400">Mileage</th>
              <th className="pb-3 font-medium text-gray-400">Description</th>
              <th className="pb-3 font-medium text-gray-400">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {records.map((record, index) => (
              <tr key={index} className="text-gray-300">
                <td className="py-3">{record.date}</td>
                <td className="py-3">{record.type}</td>
                <td className="py-3">
                  {record.mileage
                    ? `${record.mileage.toLocaleString()} mi`
                    : "-"}
                </td>
                <td className="py-3">{record.description}</td>
                <td className="py-3">
                  {record.cost ? `$${record.cost.toLocaleString()}` : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
