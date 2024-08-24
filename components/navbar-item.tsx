"use client";

import { cn } from "@lib";
import Link from "next/link";
import { buttonVariants } from "@ui/button";
import { usePathname } from "next/navigation";

type NavbarItemProps = {
  label: string;
  link: string;
};

export default function NavbarItem({ label, link }: NavbarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === link;

  return (
    <div className="relative flex items-center">
      <Link
        href={link}
        className={cn(
          buttonVariants({
            variant: "ghost",
          }),
          "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
          {
            "text-foreground": isActive,
          },
        )}
      >
        {label}
      </Link>

      {isActive && (
        <div className="absolute bottom-0 left-1/2 hidden h-[2px] w-4/5 -translate-x-1/2 rounded-xl bg-foreground md:block" />
      )}
    </div>
  );
}
