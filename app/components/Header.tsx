"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

  const menu = [
    { name: "Pacotes", href: "/packs", icon: "📦" },
    { name: "Cartas", href: "/cards", icon: "🃏" },
    { name: "Contribuir", href: "/contribuir", icon: "🎁" },
    { name: "Vender", href: "/buylist", icon: "💰" },
  ];

  function isActive(href: string) {
    return pathname === href;
  }

  // SCROLL
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header suppressHydrationWarning className="w-full sticky top-0 z-[100]">
      {/* FUNDO FIXO */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300" />

      {/* BLUR + SOMBRA */}
      <div
        className={`absolute inset-0 transition-all duration-300
          ${
            scrolled
              ? "backdrop-blur-xl bg-yellow-300/60 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border-b border-black/10"
              : ""
          }
        `}
      />

      {/* CONTEÚDO */}
      <div className="relative max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-2 active:scale-95 transition"
        >
          <div className="w-9 h-9 rounded-lg bg-black text-yellow-300 flex items-center justify-center font-bold text-lg shadow">
            T
          </div>

          <span className="font-extrabold text-sm md:text-lg tracking-wide text-black drop-shadow-[1px_1px_0px_white]">
            TCG PARA TODOS
          </span>
        </Link>

        {/* MENU DESKTOP */}
        <nav className="hidden md:flex items-center gap-2">
          {menu.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-1.5 rounded-full text-sm border-2 flex items-center gap-1 transition active:scale-95
                  ${
                    active
                      ? "bg-black text-yellow-300 border-black shadow"
                      : "bg-white/80 text-black border-black/20 hover:bg-white"
                  }
                `}
              >
                <span>{item.icon}</span>
                {item.name}

                {item.badge && item.badge > 0 && (
                  <span className="ml-1 bg-black text-yellow-300 text-[10px] px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <Link
            href="/admin"
            className="ml-2 px-4 py-1.5 rounded-full text-sm border-2 flex items-center gap-1 transition active:scale-95 bg-black text-yellow-300 border-black shadow"
          >
            ⚙️ Admin
          </Link>
        </nav>

        {/* BOTÃO MOBILE */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-xl active:scale-90 transition"
        >
          ☰
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="relative md:hidden border-t bg-yellow-200">
          <div className="flex gap-2 overflow-x-auto px-4 py-4">
            {menu.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm border-2 flex items-center gap-1 active:scale-95 transition
                    ${
                      active
                        ? "bg-black text-yellow-300 border-black"
                        : "bg-white text-black border-black/20"
                    }
                  `}
                >
                  <span>{item.icon}</span>
                  {item.name}

                  {item.badge && item.badge > 0 && (
                    <span className="ml-1 bg-black text-yellow-300 text-[10px] px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href="/admin/dashboard"
              onClick={() => setOpen(false)}
              className="whitespace-nowrap px-4 py-2 rounded-full text-sm border-2 flex items-center gap-1 bg-black text-yellow-300 border-black"
            >
              ⚙️ Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
