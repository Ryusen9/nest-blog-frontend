"use client";
import { Box } from "@mantine/core";
import axios from "axios";
import { useEffect, useState } from "react";
import { FileText, Heart, MessageCircle, Users } from "lucide-react";

export default function SiteStatus() {
  const [usersCount, setUsersCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://localhost:8000/user/count");
        setUsersCount(userRes.data);
        const postsRes = await axios.get("http://localhost:8000/post/count");
        setPostsCount(postsRes.data);
        const likesRes = await axios.get("http://localhost:8000/like/count");
        setLikesCount(likesRes.data);
        const commentsRes = await axios.get("http://localhost:8000/comment/count");
        setCommentsCount(commentsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const userCount = usersCount;
  const postCount = postsCount;
  const likeCount = likesCount;
  const commentCount = commentsCount;
  const statusCards = [
    {
      label: "Members",
      value: userCount,
      icon: Users,
    },
    {
      label: "Posts",
      value: postCount,
      icon: FileText,
    },
    {
      label: "Likes",
      value: likeCount,
      icon: Heart,
    },
    {
      label: "Comments",
      value: commentCount,
      icon: MessageCircle,
    },
  ];
  return (
    <Box className="max-w-7xl mx-auto border-r border-l px-4 py-10">
      <Box className="w-full p-6 bg-black rounded-xl flex flex-col gap-3">
        <h2 className="text-sm font-sn-pro tracking-wider uppercase mb-4 text-white">
          Site Status
        </h2>
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <Box
                key={card.label}
                className="flex items-center justify-between gap-4 border border-white/15 px-5 py-4"
              >
                <Box className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                    {card.label}
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {card.value}
                  </p>
                </Box>
                <Box className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/80">
                  <Icon className="h-5 w-5" />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
