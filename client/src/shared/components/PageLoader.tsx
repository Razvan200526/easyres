import { useId } from 'react';

export const PageLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-4 max-w-[250px]">
        <div
          id={useId()}
          className="w-full text-primary before:bg-gradient-to-b before:from-primary-500 before:to-primary-950"
        />
      </div>
    </div>
  );
};
