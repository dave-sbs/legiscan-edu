import { _EduTestSchemaResponse } from '@/schemas/typesense';

export default function DocumentCardItem({ document }: { document: _EduTestSchemaResponse }) {
  const policyArea = document.metadata_tags && document.metadata_tags.length > 0 ? document.metadata_tags[0] : null;
  return (
    <li className="border border-gray-300 rounded-xl px-6 pt-4 pb-1 bg-white flex flex-col justify-between shadow-sm max-w-3xl w-full">
      <div>
        <h2 className="font-bold text-2xl mb-2 text-gray-900 truncate" title={document.title}>
          {document.title}
        </h2>
        <div className="text-base text-gray-700 mb-4 line-clamp-2">
          {document.description}
        </div>
        
        <div className="mt-2 mb-3 flex flex-row justify-between">
          {(document.state || policyArea) && (
            <div className="flex flex-row gap-2">
              {document.state && (
                <span className="inline-flex items-center bg-gray-100 border border-gray-200 text-gray-700 rounded-md px-3 py-1 text-sm">
                  <span className="text-gray-500 mr-1">state:</span>
                  <span className="font-medium">{document.state}</span>
                </span>
              )}
              {policyArea && (
                <span className="inline-flex items-center bg-gray-100 border border-gray-200 text-gray-700 rounded-md px-3 py-1 text-sm">
                  <span className="text-gray-500 mr-1">policy area:</span>
                  <span className="font-medium">{policyArea}</span>
                </span>
              )}
            </div>
          )}
          <div className="text-blue-600 text-sm font-medium py-1 hover:underline">
            Learn More →
          </div>
        </div>
      </div>
    </li>
  );
}
