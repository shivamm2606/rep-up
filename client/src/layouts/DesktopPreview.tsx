import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

// --- detection helpers ---
function getIsStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true)
  );
}

function getIsDesktop() {
  return window.innerWidth >= 768 && !getIsStandalone();
}

function getIsMobileBrowser() {
  return window.innerWidth < 768 && !getIsStandalone();
}

function useDeviceMode() {
  const [mode, setMode] = useState<"desktop" | "mobilePWA" | "mobileBrowser">(
    () => {
      if (getIsDesktop()) return "desktop";
      if (getIsMobileBrowser()) return "mobileBrowser";
      return "mobilePWA";
    },
  );

  useEffect(() => {
    const update = () => {
      if (getIsDesktop()) setMode("desktop");
      else if (getIsMobileBrowser()) setMode("mobileBrowser");
      else setMode("mobilePWA");
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return mode;
}

// --- toaster config ---
const toasterProps = {
  position: "bottom-center" as const,
  theme: "dark" as const,
  style: { bottom: "82px" },
  toastOptions: {
    style: {
      background: "#16161e",
      border: "1px solid #24242e",
      color: "#f0f0f5",
      fontSize: "13px",
      fontWeight: 600,
      borderRadius: "14px",
      padding: "12px 16px",
      maxWidth: "380px",
    },
  },
};

// --- main component ---
function DesktopPreview() {
  const mode = useDeviceMode();

  // --- mobile (PWA or browser) → render app directly ---
  if (mode === "mobilePWA" || mode === "mobileBrowser") {
    return (
      <>
        <Toaster {...toasterProps} />
        <Outlet />
      </>
    );
  }

  // --- desktop → phone preview frame + left-side message ---
  return (
    <div className="fixed inset-0 flex items-center bg-[#050507] overflow-hidden">
      {/* background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(61,161,212,0.05)_0%,transparent_70%)]" />

      {/* left side message */}
      <div className="flex-1 flex flex-col items-start justify-center pl-[8%] pr-8 max-w-[520px]">
        {/* logo / brand */}
        <div className="mb-8">
          <p className="text-[11px] font-bold text-[#6b6b80] tracking-[0.15em] uppercase mb-2">
            Mobile App Preview
          </p>
          <h1 className="text-[20px] font-black text-[#f0f0f5] tracking-[-0.03em] leading-[1.15]">
            RepUp
          </h1>
          <p className="text-[12px] text-[#6b6b80] font-semibold mt-2 leading-relaxed max-w-[340px]">
            This is a mobile-first PWA designed for phones.
            <br />
            You're viewing a preview using a demo account.
          </p>
        </div>

        {/* features */}
        <div className="flex flex-col gap-3 mb-8">
          {[
            { icon: "📱", text: "Install on your phone for the full experience" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3 text-[13px] text-[#8b8b9a] font-semibold"
            >
              <span className="text-[16px]">{icon}</span>
              {text}
            </div>
          ))}
        </div>

        <p className="text-[11px] text-[rgba(255,255,255,0.55)] font-medium">
          Feel free to explore, this is a live demo!
        </p>
      </div>

      {/* phone frame — right side */}
      <div className="flex items-center justify-center pr-[6%]">
        <div className="relative desktop-shell-entrance h-[min(96vh,960px)] aspect-[9/18]">
          {/* outer edge */}
          <div className="absolute inset-0 rounded-[52px] bg-[linear-gradient(160deg,#3e3e48,#1a1a20,#32323a)] p-[2.5px]">
            {/* black bezel */}
            <div className="w-full h-full rounded-[50px] bg-black p-2 overflow-hidden">
              {/* screen glass - transform contains fixed-positioned children */}
              <div
                className="w-full h-full rounded-[42px] overflow-hidden relative bg-[#0b0b10]"
                style={{ transform: "translateZ(0)" }}
              >
                {/* Toaster outside scroll area */}
                <Toaster {...toasterProps} />

                {/* screen content */}
                <div className="absolute inset-0 overflow-y-auto overflow-x-hidden desktop-phone-screen">
                  <Outlet />
                </div>

                {/* home indicator */}
                <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 z-30 w-[36%] h-1 rounded-full bg-[rgba(255,255,255,0.18)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopPreview;
