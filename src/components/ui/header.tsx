/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { headerPaths } from "@/constants/router";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import UserHeader from "./user-header";
import AIChatBox from "@/components/AIChatBox";

export default function Header() {
  return (
    <div className="w-full mx-auto px-4 md:px-6 lg:px-8 fixed z-10 top-0 bg-white dark:bg-black">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-16 w-16" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link
              id="home"
              href="/homeplus"
              className="mr-6 hidden lg:flex"
              prefetch={false}
            >
              <Icon className="h-30 w-20 dark:filter dark:invert" />
              <span className="sr-only">ShadCN</span>
            </Link>

            <div className="grid gap-2 py-6">
              {headerPaths.map((path, index) => (
                <Link
                  key={index}
                  href={path.link}
                  className="flex w-full items-center py-2 text-lg font-semibold"
                  prefetch={false}
                >
                  {path.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <Link
          href="/homeplus "
          className="mr-6 hidden lg:flex"
          prefetch={false}
        >
          <Icon className="h-30 w-20 dark:filter dark:invert" />
          <span className="sr-only">ShadCN</span>
        </Link>

        <div className="flex-grow hidden lg:flex justify-center">
          <NavigationMenu>
            <NavigationMenuList>
              {headerPaths.map((path, index) => (
                <NavigationMenuLink key={index} asChild>
                  <Link
                    href={path.link}
                    className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
                    prefetch={false}
                  >
                    {path.label}
                  </Link>
                </NavigationMenuLink>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex gap-4">
          <div id="dark-mode">
            <ModeToggle />
          </div>
          <div id="avatar">
            <UserHeader />
          </div>
          <AIChatBox />
        </div>
      </header>
    </div>
  );
}

function MenuIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function Icon(props: any) {
  return (
    <div className="flex items-center">
      {/* <Link href={item.link}> */}
      <Image
        priority
        src="/image/homeplus-logo.svg"
        height={0}
        width={0}
        alt="HomePlus-logo"
        {...props}
        // href=""
      />
      <p className="text-lg font-semibold lig">HOMEPLUS</p>
      {/* </Link> */}
    </div>
  );
}

function XIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
