import React from "react";

import { router } from "../Router";
import { isRelative } from "../Utils/Url";

type Props = {
  children: React.ReactNode;
  className?: string;
  target?: string;
  href: string;
};

/**
 * Renders an HTML `a` tag which invokes the router when clicked.
 * This allows simplifies use of the router but also provides the correct standard markup for links.
 */
export function Link({ children, className, target = "_self", href }: Props): JSX.Element {
  return (
    <a className={className} href={href} onClick={handleClick(href)} target={target}>
      {children}
    </a>
  );
}

/**
 * Handle link click event.
 *
 * @remarks
 *
 * If a URL is a relative path or if it is of the same host, navigate to the url using the router.
 * If not, then just rely on the default HTML `<a href` behavior to do the navigating.
 */
function handleClick(href: string) {
  return (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
    if (isRelative(href)) {
      event.preventDefault();
      router.goTo(href);
    }
  };
}
