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
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-4 text-xl font-semibold text-foreground">Service History</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className="pb-3 font-medium text-muted-foreground">Date</th>
              <th className="pb-3 font-medium text-muted-foreground">Type</th>
              <th className="pb-3 font-medium text-muted-foreground">Mileage</th>
              <th className="pb-3 font-medium text-muted-foreground">Description</th>
              <th className="pb-3 font-medium text-muted-foreground">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {records.map((record, index) => (
              <tr key={index} className="text-foreground">
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
