"use client";
import {
  Box,
  Button,
  Pagination,
  Pill,
  SegmentedControl,
  Select,
} from "@mantine/core";
import axios from "axios";
import { ArrowRightIcon, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type TagsType = {
  name: string;
  id: number;
};

type BlogsType = {
  id: number;
  title: string;
  slug: string;
  user: { firstName: string; id: number; email: string };
  thumbnail: string;
  published: boolean;
  tags: Array<{ name: string; id: number }>;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  commentsCount: number;
};

const BlogsPage = () => {
  const [sortBy, setSortBy] = useState<string>("Latest");
  const [tags, setTags] = useState<TagsType[]>([]);
  const [selectedTags, setSelectedTags] = useState<string>("ALL");
  const [blogs, setBlogs] = useState<BlogsType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [take, setTake] = useState<number>(12);
  const [totalCount, setTotalCount] = useState<number>(0);
  const takeOptions = [10, 12, 15, 20, 25];
  const totalPages = Math.ceil(totalCount / take);
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:8000/tag");
        setTags(res.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const params: Record<string, string | number | boolean> = {
          skip: (safePage - 1) * take,
          take,
          published: true,
          sortBy: "createdAt",
          sortOrder: sortBy,
        };
        if (selectedTags && selectedTags !== "ALL") {
          params.selectedTag = selectedTags;
        }
        const res = await axios.get("http://localhost:8000/post", { params });
        setBlogs(res.data ?? []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, [sortBy, selectedTags, safePage, take]);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const countParams: Record<string, string | number | boolean> = {
          published: true,
        };
        if (selectedTags && selectedTags !== "ALL") {
          countParams.selectedTag = selectedTags;
        }
        const res = await axios.get("http://localhost:8000/post/count", {
          params: countParams,
        });
        setTotalCount(Number(res.data ?? 0));
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    };
    fetchCount();
  }, [selectedTags]);

  return (
    <Box className="min-h-screen w-full pt-30 pb-10">
      <Box className="max-w-7xl mx-auto px-4">
        <Box className="mx-auto">
          <p className="text-center uppercase tracking-wider font-russo-one text-6xl">
            All The Blogs <br /> from experts!
          </p>
          <p className="text-center text-sm text-gray-500 font-sn-pro tracking-wider">
            explore a wide range of blogs covering various topics, from
            technology and lifestyle to health and finance.
          </p>
        </Box>
        <Box className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mt-15 uppercase">
          {/* filters */}
          <p className="font-russo-one text-sm tracking-wider">categories</p>
          <Box className="flex flex-wrap items-center gap-3">
            <Select
              size="xs"
              placeholder="Sort by"
              data={["Latest", "Oldest"]}
              value={sortBy}
              onChange={(value) => {
                setSortBy(value || "Latest");
                setPage(1);
              }}
            />
            <Select
              size="xs"
              placeholder="Show"
              data={takeOptions.map(String)}
              value={String(take)}
              onChange={(value) => {
                setTake(Number(value ?? takeOptions[0]));
                setPage(1);
              }}
            />
          </Box>
        </Box>
        <Box className="w-full flex items-center justify-center mt-4">
          <SegmentedControl
            value={selectedTags}
            onChange={(value) => {
              setSelectedTags(value);
              setPage(1);
            }}
            color="black"
            data={[
              { label: "ALL", value: "ALL" },
              ...tags.map((tag) => ({
                label: tag.name.toUpperCase(),
                value: tag.name,
              })),
            ]}
          />
        </Box>
        <Box className="mt-15 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((blog, idx) => (
            <Box
              className="group flex h-85 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-linear-to-b from-white to-neutral-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
              key={idx}
            >
              <Box className="relative h-56 overflow-hidden">
                <Image
                  src={blog.thumbnail}
                  alt={blog.title}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
                <Box className="absolute inset-0 bg-linear-to-t from-black/40 via-black/5 to-transparent" />
              </Box>
              <Box className="flex h-full flex-col gap-3 p-4">
                <Box className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="rounded-full border border-neutral-200 bg-white/80 px-2.5 py-1 font-medium">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-rose-100 bg-rose-50 px-2 py-1 font-semibold text-rose-600">
                      <Heart className="h-3.5 w-3.5" aria-hidden />
                      {blog.likesCount}
                    </span>
                    <span className="flex items-center gap-1 rounded-full border border-sky-100 bg-sky-50 px-2 py-1 font-semibold text-sky-600">
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                      {blog.commentsCount}
                    </span>
                  </span>
                </Box>
                <h3 className="font-russo-one text-lg leading-snug capitalize text-neutral-900">
                  {blog.title}
                </h3>
                <Box className="text-sm text-neutral-600">
                  <span className="font-semibold text-neutral-800">
                    {blog.user?.firstName}
                  </span>
                  <span className="text-neutral-400"> · </span>
                  <span>{blog.user?.email}</span>
                </Box>
                <Box className="mt-auto flex flex-wrap gap-2">
                  {blog.tags.map((t) => (
                    <Pill
                      key={t.id}
                      className="border border-neutral-200 bg-white/90 shadow-sm"
                    >
                      {t.name}
                    </Pill>
                  ))}
                </Box>
                <Box className="mt-3 flex items-center justify-end">
                  <Link href={`http://localhost:3000/blogs/${blog.slug}`}>
                    <Button
                      size="xs"
                      rightSection={<ArrowRightIcon size={16} />}
                      className="bg-black! text-white! font-sn-pro!"
                    >
                      Read More
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
        {totalPages > 1 ? (
          <Box className="mt-10 flex items-center justify-center">
            <Pagination
              value={safePage}
              onChange={setPage}
              total={totalPages}
              radius="xl"
              color="dark"
            />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};
export default BlogsPage;
