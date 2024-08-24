import React from "react";
import { Menu } from "lucide-react";
import { Button } from "@ui/button";
import NavbarItem from "./navbar-item";
import { UserButton } from "@clerk/nextjs";
import { Logo, LogoMobile, ThemeSwitcher } from "@components";
import { Sheet, SheetContent, SheetTrigger } from "@ui/sheet";

const ITEMS = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

type Props = {};

export default function Navbar({}: Props) {
  return (
    <div className="h-[80px] min-h-[60px] border-separate border-b bg-background">
      <DesktopNavbar />
      <MobileNavbar />
    </div>
  );
}

function DesktopNavbar() {
  return (
    <nav className="container hidden h-full w-full items-center justify-between gap-4 md:flex">
      <div className="flex h-full w-full items-center gap-4 overflow-hidden">
        <Logo />
        <div className="flex h-full">
          {ITEMS.map((item, index) => (
            <NavbarItem key={index} label={item.label} link={item.link} />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}

function MobileNavbar({}: Props) {
  return (
    <nav className="container flex h-full w-full items-center justify-between gap-2 md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[90%]">
          <div className="flex w-full flex-col gap-8">
            <LogoMobile />
            <div className="flex flex-col gap-1">
              {ITEMS.map((item, index) => (
                <NavbarItem key={index} label={item.label} link={item.link} />
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <LogoMobile />

      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <UserButton />
      </div>
    </nav>
  );
}
