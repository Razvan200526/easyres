import { Skeleton } from '@heroui/react';

export const SuggestionsListSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Header title skeleton */}
      <Skeleton className="w-2/5 rounded-lg">
        <div className="h-7 w-2/5 rounded-lg bg-default-300" />
      </Skeleton>

      {/* Suggestions list skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border-l-2 border-default-300/50 pl-4">
            {/* Bullet point title skeleton */}
            <div className="mb-2">
              <Skeleton className="w-1/4 rounded-lg">
                <div className="h-5 w-1/4 rounded-lg bg-default-400" />
              </Skeleton>
            </div>

            {/* Content skeleton */}
            <div className="space-y-2">
              <Skeleton className="w-full rounded-lg">
                <div className="h-3 w-full rounded-lg bg-default-200" />
              </Skeleton>
              <Skeleton className="w-5/6 rounded-lg">
                <div className="h-3 w-5/6 rounded-lg bg-default-200" />
              </Skeleton>
              {index === 1 && (
                <>
                  <Skeleton className="w-4/5 rounded-lg">
                    <div className="h-3 w-4/5 rounded-lg bg-default-200" />
                  </Skeleton>
                  <Skeleton className="w-3/5 rounded-lg">
                    <div className="h-3 w-3/5 rounded-lg bg-default-200" />
                  </Skeleton>
                </>
              )}
              <Skeleton className="w-2/3 rounded-lg">
                <div className="h-3 w-2/3 rounded-lg bg-default-200" />
              </Skeleton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
