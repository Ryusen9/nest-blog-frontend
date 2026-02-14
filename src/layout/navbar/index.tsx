"use client";

import { navLinks } from "@/constants";
import { Box, Burger, Button, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileMenu from "./components/MobileMenu";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [opened, { toggle }] = useDisclosure();

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
      className={`fixed top-0 left-0 w-full py-3 transition-transform duration-300 ease-out ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <Box className="max-w-7xl z-10000 mx-auto flex items-center justify-between px-4 md:px-0 md:pl-4 bg-bg-primary md:border md:rounded-full">
        <p className="font-russo-one text-2xl">Blog</p>
        <Box className="items-center hidden md:flex justify-center gap-5">
          {navLinks.map((link, idx) => (
            <Link key={idx} href={link.href} className="font-sn-pro text-sm">
              {link.name}
            </Link>
          ))}
        </Box>
        <Box className="flex gap-2 items-center justify-center">
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
