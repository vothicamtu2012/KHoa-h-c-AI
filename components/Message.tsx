
import React from 'react';
import { BotIcon, UserIcon } from './Icons';
import type { ChatMessage } from '../types';

interface MessageProps {
  message: ChatMessage;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isModel = message.role === 'model';

  return (
    <div className={`flex items-start gap-4 ${isModel ? '' : 'justify-end'}`}>
      {isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <BotIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
      )}
      <div
        className={`max-w-xl rounded-xl px-4 py-3 shadow-md ${
          isModel
            ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200'
            : 'bg-blue-500 dark:bg-blue-600 text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
       {!isModel && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
        </div>
      )}
    </div>
  );
};
