import { cn } from "@lib";
import { Skeleton } from "@ui/skeleton";
import React, { PropsWithChildren } from "react";

type Props = {
  isLoading: boolean;
  fullWidth?: boolean;
};

export default function SkeletonWrapper({
  children,
  fullWidth,
  isLoading,
}: PropsWithChildren<Props>) {
  if (!isLoading) return children;

  return (
    <Skeleton
      className={cn({
        "w-full": fullWidth,
      })}
    >
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
