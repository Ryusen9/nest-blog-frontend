"use client";

import { navLinks } from "@/constants";
import { Box, Burger, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileMenu from "./components/MobileMenu";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [opened, { toggle }] = useDisclosure();
  const pathName = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const threshold = window.innerHeight * 0.5;
      const isScrollingDown = currentY > lastScrollY.current;

      if (currentY > threshold && isScrollingDown) {
        setIsHidden(true);
      } else if (!isScrollingDown) {
        setIsHidden(false);
      }

      lastScrollY.current = currentY;
    };

    lastScrollY.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed z-10000 top-0 left-0 w-full py-3 transition-transform duration-300 ease-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Box className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-0 md:pl-4 md:rounded-full">
        <p className="font-russo-one text-2xl">Blog</p>
        <Box className="items-center hidden md:flex justify-center gap-5 border py-3 px-6 rounded-full backdrop-blur-lg">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className={`font-sn-pro text-sm hover:text-black relative group ${pathName === link.href ? "text-black" : "text-gray-700"}`}
            >
              {link.name}
              <span
                className={`absolute left-0 -bottom-0.5 w-full h-0.5 bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left ${pathName === link.href ? "scale-x-100" : ""}`}
              ></span>
            </Link>
          ))}
        </Box>
        <Box className="flex gap-2 pr-4 items-center justify-center">
          <Link href="/login" className="hidden md:block">
            <Button
              className="bg-black! font-sn-pro! text-white! rounded-full! hover:opacity-80! duration-200! cursor-pointer!"
              rightSection={<LogIn size={18} />}
              size="sm"
            >
              Sign In
            </Button>
          </Link>
          <Box className="block md:hidden">
            <Burger
              size="sm"
              opened={opened}
              onClick={toggle}
              aria-label="Toggle navigation"
            />
          </Box>
        </Box>
      </Box>
      <Drawer
        opened={opened}
        onClose={toggle}
        position="right"
        overlayProps={{ opacity: 0, blur: 0 }}
        withCloseButton={false}
        styles={{
          inner: {
            top: 50,
            height: "calc(100% - 32px)",
          },
          content: {
            background: "var(--bg-primary)",
          },
          body: { padding: 0 },
        }}
      >
        <MobileMenu />
      </Drawer>
    </nav>
  );
}
