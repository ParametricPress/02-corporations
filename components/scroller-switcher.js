// Simply switch between mobile/desktop scroller components,
// depending on the window size

import React from "react";
import { useWindowSize } from "./hooks";
import StickySideScroller from "./sticky-side-scroller";
import MobileScroller from "./mobile-scroller";

function ScrollerSwitcher(props) {
  const { width, height } = useWindowSize();

  return width > 720 ? (
    <StickySideScroller {...props} />
  ) : (
    <MobileScroller {...props} />
  );
}

export default ScrollerSwitcher;
