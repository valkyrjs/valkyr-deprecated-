import { JSX } from "solid-js/jsx-runtime";

import { router } from "~Services/Router";

type Props = {
  children: any;
  href: string;
  class?: string;
  target?: string;
};

/**
 * Renders an HTML `a` tag which invokes the router when clicked.
 * This allows simplifies use of the router but also provides the correct standard markup for links.
 */
export function Link({ children, href, class: className = "", target = "_self" }: Props): JSX.Element {
  if (target !== "_self") {
    return (
      <a class={className} href={href} target={target}>
        {children}
      </a>
    );
  }
  return (
    <a class={className} href={href} onClick={handleClick(href)} target={target}>
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
  return (event: MouseEvent): void => {
    event.stopPropagation();
    event.preventDefault();
    if (isRelative(href)) {
      event.preventDefault();
      router.goTo(href);
    }
  };
}

function isRelative(url: string): boolean {
  return (
    url.indexOf("http") !== 0 ||
    window.location.host === url.replace("http://", "").replace("https://", "").split("/")[0]
  );
}
