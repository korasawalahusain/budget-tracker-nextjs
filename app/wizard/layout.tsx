import React, { PropsWithChildren } from "react";

type Props = {};

export default function WizardLayout({ children }: PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
}
