import Link from "next/link";
import { navLinks } from "@/constants";

const MobileMenu = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-between w-full bg-bg-primary px-4 pb-8 pt-6">
      <div className="flex h-full flex-col">
        <div className="flex items-end justify-between">
          <p className="font-russo-one text-lg tracking-wide text-black">
            Menu
          </p>
          <p className="font-sn-pro text-xs uppercase tracking-[0.2em] text-black/60">
            Navigate
          </p>
        </div>

        <div className="mt-6 flex flex-1 flex-col">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center justify-between border-b border-black/10 py-3 font-sn-pro text-base text-black transition duration-200 hover:opacity-70"
            >
              <span className="font-semibold">{link.name}</span>
              <span className="text-sm text-black/40">0{index + 1}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/login"
          className="rounded-full bg-black px-5 py-3 text-center font-sn-pro text-sm font-semibold uppercase tracking-[0.2em] text-white transition duration-200 hover:opacity-85"
        >
          Sign In
        </Link>
        <Link
          href="/contact"
          className="rounded-full border border-black/20 bg-transparent px-5 py-3 text-center font-sn-pro text-sm font-semibold uppercase tracking-[0.2em] text-black transition duration-200 hover:bg-black hover:text-white"
        >
          Start a project
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
