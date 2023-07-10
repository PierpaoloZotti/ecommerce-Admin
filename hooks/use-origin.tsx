import { useState, useEffect } from "react";

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false);

  // We control if window is available, so if the window's location exists, if false we pass an empty string
  const origin =
    typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return origin;
};
