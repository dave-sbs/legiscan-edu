import Link from 'next/link';

export default function Heading() {
  return (
    <div className="flex flex-col items-center gap-4 mt-12 mb-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
        Unifying U.S. Government Information
      </h1>
      <p className="text-lg md:text-xl text-center text-gray-700 max-w-2xl">
        Instant access to government policies, simplified and personalized for you.
      </p>
    </div>
  );
}
