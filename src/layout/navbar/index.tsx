"use client";

import { navLinks } from "@/constants";
import {
  Box,
  Burger,
  Button,
  Drawer,
  Modal,
  Avatar,
  Group,
  Text,
  Divider,
  Badge,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import MobileMenu from "./components/MobileMenu";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthContext";
import Image from "next/image";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure();
  const pathName = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    closeModal();
  };

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
      className={`fixed z-10000 top-0 left-0 w-full py-3 bg-bg-primary md:bg-transparent transition-transform duration-300 ease-out ${
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
          {isAuthenticated && user ? (
            <Group
              gap="sm"
              className="hidden md:flex cursor-pointer hover:opacity-80 transition-opacity px-3 py-2 rounded-lg hover:bg-black/5"
              onClick={openModal}
            >
              {user.avatarUrl ? (
                <Avatar
                  src={user.avatarUrl}
                  alt={user.firstName || user.email || "User"}
                  size="sm"
                  radius="xl"
                />
              ) : (
                <Avatar
                  name={user.firstName || user.email || "User"}
                  size="sm"
                  radius="xl"
                />
              )}
              <div className="min-w-0">
                <Text size="sm" fw={500} className="font-sn-pro truncate">
                  {user.firstName || user.email || "User"}
                </Text>
                <Text size="xs" c="dimmed" className="font-sn-pro truncate">
                  {user.email}
                </Text>
              </div>
            </Group>
          ) : (
            <Link href="/sign-up" className="hidden md:block">
              <Button
                className="bg-black! font-sn-pro! text-white! rounded-full! hover:opacity-80! duration-200! cursor-pointer!"
                rightSection={<LogIn size={18} />}
                size="sm"
              >
                Sign Up
              </Button>
            </Link>
          )}
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

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title={
          <Text fw={700} className="font-sn-pro uppercase tracking-widest text-lg">
            User Profile
          </Text>
        }
        centered
        size="md"
      >
        {user && (
          <Box>
            <Group justify="center" mb="lg">
              {user.avatarUrl ? (
                <Avatar
                  src={user.avatarUrl}
                  alt={user.firstName || user.email || "User"}
                  size={80}
                  radius="xl"
                />
              ) : (
                <Avatar
                  name={user.firstName || user.email || "User"}
                  size={80}
                  radius="xl"
                />
              )}
            </Group>

            <Box className="space-y-4">
              <Box>
                <Text
                  size="xs"
                  c="dimmed"
                  fw={500}
                  className="font-sn-pro uppercase tracking-wider"
                >
                  Full Name
                </Text>
                <Text className="font-sn-pro">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || "Not provided"}
                </Text>
              </Box>

              <Box>
                <Text
                  size="xs"
                  c="dimmed"
                  fw={500}
                  className="font-sn-pro uppercase tracking-wider"
                >
                  Email
                </Text>
                <Text className="font-sn-pro">
                  {user.email || "Not provided"}
                </Text>
              </Box>

              {user.bio && (
                <Box>
                  <Text
                    size="xs"
                    c="dimmed"
                    fw={500}
                    className="font-sn-pro uppercase tracking-wider"
                  >
                    Bio
                  </Text>
                  <Text className="font-sn-pro text-sm">{user.bio}</Text>
                </Box>
              )}

              <Box>
                <Text
                  size="xs"
                  c="dimmed"
                  fw={500}
                  className="font-sn-pro uppercase tracking-wider"
                >
                  Role
                </Text>
                <Badge size="lg" variant="filled" className="capitalize">
                  {user.role || "Not provided"}
                </Badge>
              </Box>
            </Box>

            <Divider my="lg" />

            <Button
              fullWidth
              variant="filled"
              color="red"
              size="md"
              className="font-sn-pro! uppercase! tracking-wider!"
              leftSection={<LogOut size={18} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        )}
      </Modal>
    </nav>
  );
}
