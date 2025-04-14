import { _EduTestSchemaResponse, _TypesenseQuery } from '@/schemas/typesense';
import BillCardItem from './BillCardItem';
import fetchBills from '@/lib/actions';

import { useInfiniteQuery } from '@tanstack/react-query';
import LoaderSVG from './LoaderSVG';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

import { SearchResponseHit } from 'typesense/lib/Typesense/Documents';

export default function EduTestList({
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
    queryKey: ['bills', queryKey],
    queryFn: fetchBills(searchParams),
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
      <ul className='w-full grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-lg:grid-cols-2'>
        {data.pages.map((page) =>
          page.data?.map((hit) => (
            <BillCardItem bill={hit.document} key={hit.document.bill_number + hit.document.state} />
          ))
        )}
      </ul>
      {isFetchingNextPage && hasNextPage ? (
        <LoaderSVG />
      ) : (
        <div className='w-full text-center text-sm mt-4'>
          No more bills found.
        </div>
      )}
      <div ref={ref} />
    </>
  );
}
