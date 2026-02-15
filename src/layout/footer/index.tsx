import { Box } from "@mantine/core";

const quickLinks = [
  { label: "Home", href: "#" },
  { label: "Categories", href: "#" },
  { label: "Popular", href: "#" },
  { label: "About", href: "#" },
];

const topics = ["Design", "Tech", "Culture", "Writing", "Guides", "Reviews"];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <Box className="absolute inset-0 opacity-30">
        <Box className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <Box className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-white/5 blur-2xl" />
        <Box className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-white/10 to-transparent" />
      </Box>

      <Box className="relative mx-auto max-w-7xl px-4 py-16">
        <Box className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <Box className="space-y-6">
            <Box className="inline-flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-white" />
              <span className="text-xl uppercase tracking-[0.3em] text-white/70">
                Nest Blog
              </span>
            </Box>
            <p className="max-w-md text-sm leading-relaxed text-white/70">
              A curated journal of ideas, craft, and culture. Sharp writing,
              bold visuals, and weekly insights for creators who build with
              intention.
            </p>

            <Box className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] text-white/60">
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-white/20 px-3 py-2"
                >
                  {topic}
                </span>
              ))}
            </Box>
          </Box>

          <Box className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.35em] text-white/70">
              Explore
            </h3>
            <ul className="space-y-3 text-sm">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    className="group inline-flex items-center gap-3 text-white/80 transition hover:text-white"
                    href={link.href}
                  >
                    <span className="h-px w-6 bg-white/30 transition group-hover:w-10 group-hover:bg-white" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <Box className="pt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                Follow
              </p>
              <Box className="mt-3 flex gap-4 text-sm">
                <a className="text-white/70 hover:text-white" href="#">
                  Instagram
                </a>
                <a className="text-white/70 hover:text-white" href="#">
                  X
                </a>
                <a className="text-white/70 hover:text-white" href="#">
                  YouTube
                </a>
              </Box>
            </Box>
          </Box>

          <Box className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.35em] text-white/70">
              Newsletter
            </h3>
            <p className="text-sm text-white/70">
              Get a concise weekly brief. No noise, just the best stories and
              behind-the-scenes notes.
            </p>
            <form className="space-y-4">
              <Box className="flex items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-3">
                <input
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
                  placeholder="Email address"
                  type="email"
                />
                <button
                  className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-white/90"
                  type="button"
                >
                  Join
                </button>
              </Box>
              <p className="text-xs text-white/40">
                By subscribing you agree to our privacy policy.
              </p>
            </form>
          </Box>
        </Box>

        <Box className="mt-12 flex flex-col gap-4 border-t border-white/15 pt-8 text-xs uppercase tracking-[0.25em] text-white/50 md:flex-row md:items-center md:justify-between">
          <span>Copyright {new Date().getFullYear()} Nest Blog</span>
          <Box className="flex gap-6">
            <a className="hover:text-white" href="#">
              Terms
            </a>
            <a className="hover:text-white" href="#">
              Privacy
            </a>
            <a className="hover:text-white" href="#">
              Contact
            </a>
          </Box>
        </Box>
      </Box>
    </footer>
  );
}
