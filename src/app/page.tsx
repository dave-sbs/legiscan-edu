import Chat from '@/components/Chat';
import ConversationContextProvider from '@/components/ConversationContext';
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react';


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="sticky top-0 px-4 xs:px-8 py-4 flex items-center bg-gray-100 z-10">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
          <h1 className="text-xl font-bold uppercase text-gray-900">
            Sporos
          </h1>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-white rounded-md shadow-md shadow-gray-200 xs:mx-8 xs:mb-4 px-4">
        <ConversationContextProvider>
          <Chat />
        </ConversationContextProvider>
      </div>
    </div>
  );
}