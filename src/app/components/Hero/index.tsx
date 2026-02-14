import { Box, Button } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <Box className="min-h-[50vh] lg:min-h-[70vh] flex flex-col items-center justify-center border-b">
      <p className="font-russo-one text-3xl md:text-6xl lg:text-8xl text-center uppercase">
        Global Platform <br /> for NEWS!
      </p>
      <Link href={"/blogs"}>
        <Button
          className="font-sn-pro! hover:bg-black! hover:text-white! mt-3 rounded-full! text-black! transition-colors! duration-200! border-black! uppercase!"
          rightSection={<ChevronRight size={18} />}
          variant="outline"
        >
          Explore Now
        </Button>
      </Link>
    </Box>
  );
}
