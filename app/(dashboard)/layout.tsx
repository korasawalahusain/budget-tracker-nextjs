import { Navbar } from "@components";
import React, { PropsWithChildren } from "react";

type Props = {};

export default function DashboardLayout({
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="relative flex h-screen w-full flex-col">
      <Navbar />
      <div className="w-full">{children}</div>
    </div>
  );
}
