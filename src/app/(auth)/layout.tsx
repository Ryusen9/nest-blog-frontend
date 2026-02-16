import { MainBackground } from "@/components";
import { Box } from "@mantine/core";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Box>
      <MainBackground>{children}</MainBackground>
    </Box>
  );
}
