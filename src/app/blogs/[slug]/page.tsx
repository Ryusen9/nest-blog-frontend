"use client";
import { Box, Modal } from "@mantine/core";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type BlogTag = {
  id: number;
  name: string;
};

type BlogUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  avatarUrl: string;
};

type BlogComment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type BlogLike = {
  id: number;
};

type Blog = {
  id: number;
  slug: string;
  title: string;
  user: BlogUser;
  content: string;
  thumbnail: string;
  published: boolean;
  tags: BlogTag[];
  likes: BlogLike[];
  comments: BlogComment[];
  createdAt: string;
  updatedAt: string;
};

const formatDate = (value?: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const WithSlug = () => {
  const params = useParams<{ slug: string }>();
  const slugValue = Array.isArray(params?.slug)
    ? params?.slug[0]
    : params?.slug;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!slugValue) return;
    const fetchBlog = async () => {
      try {
        const blogRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${slugValue}`);
        const blogData = await blogRes.json();
        setBlog(blogData);
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [slugValue]);
  const contentValue = blog?.content ?? "";
  const contentBlocks = useMemo(() => {
    if (!contentValue) return [];
    return contentValue.split("\n").filter(Boolean);
  }, [contentValue]);
  const modalUser = blog?.user;

  return (
    <Box className="min-h-screen pt-24 pb-10">
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        centered
        title=""
        withCloseButton={false}
        size="lg"
      >
        <Box className="relative overflow-hidden rounded-3xl border border-black/10">
          <Box className="absolute inset-0 bg-linear-to-br from-black/5 via-transparent to-black/10" />
          <Box className="absolute -top-14 -right-5 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
          <Box className="relative p-8">
            <Box className="flex items-start justify-between gap-6">
              <Box>
                <p className="text-xs uppercase tracking-[0.35em] text-black/50">
                  Author Profile
                </p>
                <h3 className="mt-3 text-3xl font-russo-one uppercase text-black">
                  {modalUser
                    ? `${modalUser.firstName} ${modalUser.lastName}`
                    : "Loading author"}
                </h3>
                <p className="mt-2 text-sm text-black/70">
                  {modalUser?.email ?? ""}
                </p>
              </Box>
              <button
                aria-label="Close"
                className="h-10 w-10 rounded-full border border-black/15 text-black/60 transition hover:border-black/30 hover:text-black"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                ✕
              </button>
            </Box>

            <Box className="mt-6 flex flex-wrap items-center gap-6">
              <Box className="relative h-24 w-24 overflow-hidden rounded-full border border-black/15">
                {modalUser?.avatarUrl ? (
                  <Image
                    alt={`${modalUser.firstName} ${modalUser.lastName}`}
                    className="h-full w-full object-cover"
                    src={modalUser.avatarUrl}
                    width={96}
                    height={96}
                  />
                ) : null}
              </Box>
              <Box className="max-w-md text-sm leading-relaxed text-black/70">
                {modalUser?.bio ?? ""}
              </Box>
            </Box>

            <Box className="mt-6 grid gap-3 rounded-2xl border border-black/10 bg-black/5 p-4 text-xs uppercase tracking-[0.3em] text-black/50">
              <span>Focused on thoughtful storytelling</span>
              <span>Writing from the quiet side of the web</span>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Box className="max-w-7xl mx-auto px-4">
        <Box className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Box className="space-y-8">
            <Box className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-black/60">
                {blog?.published ? "Published" : "Draft"}
              </p>
              <h1 className="text-4xl font-russo-one uppercase leading-tight text-black md:text-5xl">
                {blog?.title ?? "Loading post"}
              </h1>
              <p className="text-sm uppercase tracking-[0.25em] text-black/60">
                {formatDate(blog?.createdAt)}
              </p>
            </Box>

            <Box className="flex flex-wrap gap-3">
              {blog?.tags?.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-black/20 px-3 py-2 text-xs uppercase tracking-[0.2em]"
                >
                  {tag.name}
                </span>
              ))}
            </Box>

            <Box className="flex flex-wrap items-center gap-6 text-sm text-black/70">
              <button
                className="h-10 w-10 overflow-hidden rounded-full border border-black/10"
                onClick={() => setIsModalOpen(true)}
                type="button"
              >
                {blog?.user?.avatarUrl ? (
                  <Image
                    alt={`${blog.user.firstName} ${blog.user.lastName}`}
                    className="h-full w-full object-cover"
                    src={blog.user.avatarUrl}
                    width={60}
                    height={60}
                  />
                ) : null}
              </button>
              <Box>
                <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                  Author
                </p>
                <p className="text-sm font-semibold text-black">
                  {blog?.user
                    ? `${blog.user.firstName} ${blog.user.lastName}`
                    : ""}
                </p>
                <p className="text-xs">{blog?.user?.email ?? ""}</p>
              </Box>
            </Box>
          </Box>

          <Box className="relative">
            <Box className="relative overflow-hidden rounded-3xl border border-black/10">
              {blog?.thumbnail ? (
                <Image
                  width={800}
                  height={450}
                  alt={blog?.title ?? "Blog thumbnail"}
                  className="h-full w-full object-cover"
                  src={blog.thumbnail}
                />
              ) : null}
              <Box className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
              <Box className="absolute bottom-6 left-6 right-6">
                <p className="text-xs uppercase tracking-[0.35em] text-white/70">
                  Featured story
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {blog?.user?.bio ?? ""}
                </p>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="mt-14 grid gap-10 lg:grid-cols-[1fr_280px]">
          <Box className="space-y-6 text-base leading-relaxed text-black/80">
            {contentBlocks.length > 0
              ? contentBlocks.map((block, index) => (
                  <p key={`${block}-${index}`}>{block}</p>
                ))
              : "Loading content..."}
          </Box>

          <Box className="space-y-6">
            <Box className="rounded-2xl border border-black/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                Post Info
              </p>
              <Box className="mt-4 space-y-3 text-sm text-black/70">
                <p>Slug: {blog?.slug ?? slugValue}</p>
                <p>Updated: {formatDate(blog?.updatedAt)}</p>
                <p>Status: {blog?.published ? "Live" : "Draft"}</p>
              </Box>
            </Box>

            <Box className="rounded-2xl border border-black/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-black/50">
                Community
              </p>
              <Box className="mt-4 grid gap-3">
                <Box className="flex items-center justify-between text-sm">
                  <span className="text-black/60">
                    {" "}
                    <Heart className="inline mr-1 text-red-400" /> Likes
                  </span>
                  <span className="font-semibold text-black">
                    {blog?.likes?.length ?? 0}
                  </span>
                </Box>
                <Box className="flex items-center justify-between text-sm">
                  <span className="text-black/60">
                    {" "}
                    <MessageCircle className="inline mr-1 text-blue-400" />{" "}
                    Comments
                  </span>
                  <span className="font-semibold text-black">
                    {blog?.comments?.length ?? 0}
                  </span>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WithSlug;
