import { Logo } from "@components";
import React, { PropsWithChildren } from "react";

type Props = {};

export default function AuthLayout({ children }: PropsWithChildren<Props>) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center py-16">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
}
