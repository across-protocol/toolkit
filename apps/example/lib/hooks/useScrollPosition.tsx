import { useState } from "react";
import { useEventListener } from "usehooks-ts";

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEventListener("scroll", () => setScrollPosition(window.scrollY));

  return scrollPosition;
}
