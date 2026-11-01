const block = "sf-skeleton rounded-lg";

const Skeleton = ({ className = "", variant = "default" }) => {
  if (variant === "video") {
    return (
      <div className={`space-y-5 ${className}`} aria-hidden="true">
        <div className={`${block} aspect-video w-full`} />
        <div className="space-y-3">
          <div className={`${block} h-7 w-3/4`} />
          <div className={`${block} h-4 w-1/2`} />
          <div className={`${block} h-4 w-1/4`} />
          <div className="flex items-center gap-4 pt-2">
            <div className={`${block} h-12 w-12 rounded-full`} />
            <div className="flex-1 space-y-2">
              <div className={`${block} h-4 w-32`} />
              <div className={`${block} h-3 w-24`} />
            </div>
            <div className={`${block} h-10 w-28 rounded-full`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "comment") {
    return (
      <div className={`flex gap-3 ${className}`} aria-hidden="true">
        <div className={`${block} h-10 w-10 shrink-0 rounded-full`} />
        <div className="flex-1 space-y-2">
          <div className={`${block} h-4 w-32`} />
          <div className={`${block} h-4 w-full`} />
          <div className={`${block} h-4 w-3/4`} />
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`space-y-3 ${className}`} aria-hidden="true">
        <div className={`${block} aspect-video w-full rounded-xl`} />
        <div className="flex gap-3 pt-1">
          <div className={`${block} h-10 w-10 shrink-0 rounded-full`} />
          <div className="min-w-0 flex-1 space-y-2">
            <div className={`${block} h-4 w-full`} />
            <div className={`${block} h-3 w-2/3`} />
            <div className={`${block} h-3 w-1/2`} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "row") {
    return (
      <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
        <div className={`${block} aspect-video w-44 shrink-0 rounded-xl`} />
        <div className="min-w-0 flex-1 space-y-3">
          <div className={`${block} h-5 w-3/4`} />
          <div className={`${block} h-3 w-1/3`} />
          <div className={`${block} h-3 w-1/2`} />
        </div>
      </div>
    );
  }

  return <div className={`${block} ${className}`} aria-hidden="true" />;
};

export default Skeleton;
