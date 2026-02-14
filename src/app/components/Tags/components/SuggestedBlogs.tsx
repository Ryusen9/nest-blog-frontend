import { Box, Pill } from "@mantine/core";
import axios from "axios";
import { Heart, MessageCircle } from "lucide-react";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import noFile from "../../../../../public/lottie/NoFile.json";

type SuggestedBlogsProps = {
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

const SuggestedBlogs = ({ tag }: { tag: string }) => {
  const [blogs, setBlogs] = useState<Array<SuggestedBlogsProps>>([]);
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(
          "https://nest-blog-backend-5rpa.onrender.com/post?take=9&published=true",
        );
        setBlogs(res.data ?? []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, [tag]);
  const filteredBlogs = blogs.filter(
    (blog) => tag === "All" || blog.tags?.some((t) => t.name === tag),
  );
  return (
    <Box className="mt-6">
      {filteredBlogs.length === 0 ? (
        <Box className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white/80 px-6 py-10 text-center">
          <Box className="w-64 max-w-full">
            <Lottie animationData={noFile} loop autoplay />
          </Box>
          <p className="font-russo-one text-lg text-neutral-800">
            No posts found
          </p>
          <p className="text-sm text-neutral-500">
            Try another tag to discover more stories.
          </p>
        </Box>
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBlogs.map((blog, idx) => (
            <Box
              className="group flex h-85 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-linear-to-b from-white to-neutral-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-xl"
              key={idx}
            >
              <Box className="relative aspect-video overflow-hidden">
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
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
export default SuggestedBlogs;
