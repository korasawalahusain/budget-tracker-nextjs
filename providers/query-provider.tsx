"use client";

import React, { PropsWithChildren, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

type Props = {};

export default function Provider({ children }: PropsWithChildren<Props>) {
  const [queryClient, _] = useState(() => new QueryClient({}));

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      <ReactQueryDevtools client={queryClient} initialIsOpen={false} />
    </QueryClientProvider>
  );
}
