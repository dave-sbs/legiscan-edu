/**
 * Component to be displayed prior to user inputting any questions.
 * 
 * Has default questions to help users start of conversation. Later will be changed to a dynamic content generator based on conversation and interest history for each customer
 */

import { Message, chat } from '@/lib/actions';
import { useConversationState } from './ConversationContext';
import { FormProps } from './Form';

const INITIAL_MESSAGES = [
  "Education",
  "Economy",
  "HealthCare",
  "Defense"
];

export default function EmptyChat({ onRequest }: FormProps) {
    const [, setConversation] = useConversationState();

    const sendMessage = (message: string) => async () => {
        const userMessage: Message = { message, sender: 'user', sources: [] };
        onRequest(userMessage);
    
        const formData = new FormData();
        formData.set('message', message);
        const response = await chat(formData);
        if (!response) return;
    
        setConversation({
          id: response.id,
          messages: [
            userMessage,
            {
              message: response.message,
              sender: 'ai',
              sources: response.sources,
            },
          ],
        });
    };

    return (
    <div className="flex flex-col flex-grow items-center justify-center">
        <h2 className="text-2xl font-semibold text-center">
        Sporos
        </h2>
        <p className="mt-4 text-gray-700 text-center max-w-lg text-balance">
        Unified access to all government data.
        </p>
        <div className="w-full flex justify-center mt-6 mb-12">
            <div className="bg-blue-600 text-white text-xl md:text-2xl font-bold px-8 py-4 rounded-xl shadow-md">
            60,000+ <span className="font-normal text-base align-middle">official documents at your fingertips</span>
            </div>
        </div>
        <div className="grid xs:grid-cols-2 gap-2 mt-14">
        {INITIAL_MESSAGES.map((message, i) => (
            <button
            className="rounded-lg bg-gray-100 py-3 xs:py-2 px-4 text-xs text-left text-gray-900 hover:bg-gray-200 transition-colors"
            key={i}
            onClick={sendMessage(message)}
            >
            {message}
            </button>
        ))}
        </div>
    </div>
    );
}

