import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useEffect, useState } from "react";

// check wide screen
function checkIsDesktop() {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true);

  return window.innerWidth >= 768 && !isStandalone;
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(checkIsDesktop);

  useEffect(() => {
    const update = () => setDesktop(checkIsDesktop());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return desktop;
}

// toaster
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

function DesktopPreview() {
  const isDesktop = useIsDesktop();

  if (!isDesktop) {
    return (
      <>
        <Toaster {...toasterProps} />
        <Outlet />
      </>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#050507] overflow-hidden">
      {/* background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(61,161,212,0.05)_0%,transparent_70%)]" />

      {/* phone frame */}
      <div className="relative desktop-shell-entrance h-[min(calc(100vh-64px),820px)] aspect-[9/17]">
        {/* outer edge */}
        <div className="absolute inset-0 rounded-[52px] bg-[linear-gradient(160deg,#3e3e48,#1a1a20,#32323a)] p-[2.5px]">
          {/* black bezel */}
          <div className="w-full h-full rounded-[50px] bg-black p-2 overflow-hidden">
            {/* screen glass - transform contains fixed-positioned children (like BottomNav) */}
            <div
              className="w-full h-full rounded-[42px] overflow-hidden relative bg-[#0b0b10]"
              style={{ transform: "translateZ(0)" }}
            >
              {/* screen content */}
              <div className="absolute inset-0 overflow-y-auto overflow-x-hidden desktop-phone-screen">
                <Toaster {...toasterProps} />
                <Outlet />
              </div>

              {/* home indicator */}
              <div className="absolute bottom-[7px] left-1/2 -translate-x-1/2 z-30 w-[36%] h-1 rounded-full bg-[rgba(255,255,255,0.18)]" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-[rgba(255,255,255,0.28)] text-[0.72rem] whitespace-nowrap font-[DM_Sans,sans-serif]">
        📱 This is a mobile preview using a demo account - the app works best on
        a phone. Feel free to explore!
      </p>
    </div>
  );
}

export default DesktopPreview;
