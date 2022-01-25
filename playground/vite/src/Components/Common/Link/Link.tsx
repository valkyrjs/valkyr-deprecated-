import React, { CSSProperties, ReactNode } from "react";

import { router } from "../../../Router";
import { isRelative } from "../../../Utils/Url";
import s from "./Link.module.scss";

type Props = {
  style?: CSSProperties;
  className?: string;
  href: string;
  target?: string;
  children: ReactNode;
};

/**
 * Renders an HTML `a` tag which invokes the router when clicked.
 *
 * This allows simplifies use of the router but also provides the
 * correct standard markup for links.
 *
 * @remarks
 *
 * If a URL is a relative path or if it is of the same host,
 * navigate to the url using the router. If not, then just rely
 * on the default HTML `<a href` behavior to do the navigating.
 */
export function Link({ style, className = "", href, target = "_self", children }: Props): JSX.Element {
  return (
    <a
      className={`${s.link} ${className}`.trim()}
      style={style}
      href={href}
      onClick={(event) => {
        if (isRelative(href)) {
          event.preventDefault();
          router.goTo(href);
        }
      }}
      target={target}
    >
      {children}
    </a>
  );
}
