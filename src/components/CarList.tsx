import { _EduTestSchemaResponse, _TypesenseQuery } from '@/schemas/typesense';
import DocumentCardItem from './BillCardItem'; // Will rename BillCardItem to DocumentCardItem in a follow-up step
import fetchDocuments from '@/lib/actions'; // Will rename fetchBills to fetchDocuments if needed

import { useInfiniteQuery } from '@tanstack/react-query';
import LoaderSVG from './LoaderSVG';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

import { SearchResponseHit } from 'typesense/lib/Typesense/Documents';

export default function DocumentList({
  initialData,
  searchParams,
  queryKey,
}: {
  initialData: { data: SearchResponseHit<_EduTestSchemaResponse>[]; nextPage: number | null };
  searchParams: _TypesenseQuery;
  queryKey: string;
}) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['documents', queryKey],
    queryFn: fetchDocuments(searchParams),
    initialData: { pages: [initialData], pageParams: [1] },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  if (status === 'error') {
    console.log(error);
    return 'Error';
  }
  return (
    <>
      {/* <ul className='w-full grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-lg:grid-cols-2'> */}
      <ul className='w-full flex flex-col gap-6 items-center'>
        {data.pages.map((page) =>
          page.data?.map((hit) => (
            <DocumentCardItem document={hit.document} key={hit.document.title + (hit.document.url || '')} />
          ))
        )}
      </ul>
      {isFetchingNextPage && hasNextPage ? (
        <LoaderSVG />
      ) : (
        <div className='w-full text-center text-sm mt-4'>
          No more documents found.
        </div>
      )}
      <div ref={ref} />
    </>
  );
}
