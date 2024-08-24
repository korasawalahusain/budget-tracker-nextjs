import React from "react";
import Link from "next/link";
import { PiggyBank } from "lucide-react";

type Props = {};

export function Logo({}: Props) {
  return (
    <Link href="/" className="flex h-full items-center gap-2 overflow-hidden">
      <PiggyBank className="stroke h-11 w-11 stroke-amber-500 stroke-[1.5]" />
      <p className="truncate bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent">
        HusainK&apos;s BudgetTracker
      </p>
    </Link>
  );
}

export function LogoMobile({}: Props) {
  return (
    <Link
      href="/"
      className="h-full content-center truncate bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tighter text-transparent"
    >
      HusainK&apos;s BudgetTracker
    </Link>
  );
}
