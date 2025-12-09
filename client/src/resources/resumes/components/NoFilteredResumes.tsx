import { SearchIcon } from '@client/common/icons/SearchIcon';

const NoFilteredResumes = () => {
  return (
    <div className="col-span-full h-[calc(100dvh-7rem)] flex flex-col items-center justify-center py-16">
      <div className="p-4 rounded-full bg-primary/10 border border-border mb-4">
        <SearchIcon className="size-8 text-secondary-text" />
      </div>
      <p className="text-primary font-medium mb-1">No resumes found</p>
      <p className="text-sm text-secondary-text">Try adjusting your filters</p>
    </div>
  );
};

export default NoFilteredResumes;
