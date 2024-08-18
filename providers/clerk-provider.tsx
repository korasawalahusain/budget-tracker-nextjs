import { ClerkProvider } from "@clerk/nextjs";
import React, { PropsWithChildren } from "react";

type Props = {};

export default function Provider({ children }: PropsWithChildren<Props>) {
  return (
    <ClerkProvider
      afterSignOutUrl="/sign-in"
      signInFallbackRedirectUrl="/"
      signUpForceRedirectUrl="/wizard"
    >
      {children}
    </ClerkProvider>
  );
}
