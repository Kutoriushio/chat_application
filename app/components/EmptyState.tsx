import React from "react";

const EmptyState = () => {
  return (
    <div className="bg-gray-100 h-full items-center flex justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="text-center items-center flex flex-col">
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          Select a chat or start a new conversation
        </h3>
      </div>
    </div>
  );
};

export default EmptyState;
