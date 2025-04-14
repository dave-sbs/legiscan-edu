import { _EduTestSchemaResponse } from '@/schemas/typesense';

export default function BillCardItem({ bill }: { bill: _EduTestSchemaResponse }) {
  return (
    <li className="border-2 border-gray-700 rounded-xl py-4 px-5 flex flex-col gap-2 justify-between">
      <div>
        <div className="text-xs mb-0.5 flex items-center gap-1.5">
          <span className="font-semibold">{bill.state}</span>
          <span className="text-[10px]">|</span>
          <span>Bill #{bill.bill_number}</span>
        </div>
        <h2 className="font-bold text-lg mb-1">
          {bill.title}
        </h2>
        <div className="text-sm text-muted-foreground mb-2">
          {bill.description}
        </div>
        <div className="flex flex-wrap gap-1.5 text-xs mb-2">
          {bill.metadata_tags?.map((tag) => (
            <span key={tag} className="bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-1 text-xs text-gray-500 mb-2">
          <span><b>Sponsors:</b> {bill.sponsors?.join(', ') || 'N/A'}</span>
          <span><b>Introduced:</b> {bill.start_date || 'N/A'}</span>
          <span><b>Latest Update:</b> {bill.latest_update || 'N/A'}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {bill.state_link && (
          <a
            href={bill.state_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline text-blue-700 hover:text-blue-900"
          >
            State Bill Page
          </a>
        )}
        {bill.url && (
          <a
            href={bill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs underline text-blue-700 hover:text-blue-900"
          >
            Source
          </a>
        )}
      </div>
    </li>
  );
}
