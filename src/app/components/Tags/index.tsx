"use client";
import { Box, Pill, Select } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import SuggestedBlogs from "./components/SuggestedBlogs";

export default function CategoryTags() {
  const [tags, setTags] = useState<Array<{ name: string }>>([]);
  const [activeTag, setActiveTag] = useState<string>("All");
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get("http://localhost:8000/tag");
        setTags(res.data ?? []);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    fetchTags();
  }, []);
  const handleTagClick = (tagName: string) => {
    setActiveTag(tagName);
  };
  const tagNames = [
    "All",
    ...tags
      .map((tag) => tag.name)
      .filter((name): name is string => Boolean(name)),
  ];
  const getTagClasses = (tagName: string) =>
    `font-sn-pro! uppercase ${
      activeTag === tagName
        ? "bg-black! text-white!"
        : "bg-transparent! text-black! border border-black"
    }`;
  return (
    <Box className="w-full border-b">
      <Box className="max-w-7xl lg:border-l lg:border-r px-4 py-6 mx-auto">
        <Box className="w-full flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="font-sn-pro text-sm uppercase font-semibold">
            Categories
          </p>
          <Box className="hidden lg:flex items-center justify-center gap-2 flex-wrap">
            <Pill
              onClick={() => handleTagClick("All")}
              className={getTagClasses("All")}
            >
              All
            </Pill>
            {tags.map((tag, idx) => (
              <Pill
                onClick={() => handleTagClick(tag.name)}
                className={getTagClasses(tag.name)}
                key={`${tag.name}-${idx}`}
              >
                {tag.name}
              </Pill>
            ))}
          </Box>
          <Box className="block lg:hidden">
            <Select
              placeholder="Pick one"
              data={tagNames}
              value={activeTag}
              onChange={(value) => handleTagClick(value ?? "All")}
            />
          </Box>
        </Box>
        <Box>
          <SuggestedBlogs tag={activeTag} />
        </Box>
      </Box>
    </Box>
  );
}
