import { useEffect, useState } from 'react';
import { SearchIcon } from './icons';
import { useRouter } from 'next/navigation';

export default function Form({ q }: { q: string }) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    setQuery(q);
  }, [q]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`?q=${query}`);
      }}
      className='w-full flex gap-2.5 mb-4'
    >
      <input
        className='flex-1 px-4 py-3 border-2 border-gray-700 rounded-lg placeholder:font-light text-base shadow-md focus:outline-none focus:border-blue-600 transition'
        type='text'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search government policies, documents, laws..."
        aria-label="Search government information"
      />
      <button
        className='bg-neutral-900 aspect-square w-10 grid place-content-center rounded-lg hover:bg-neutral-800 transition'
        type='submit'
      >
        <SearchIcon className='size-5 fill-white' />
      </button>
    </form>
  );
}
