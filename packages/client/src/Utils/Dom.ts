export function setPageTitle(app: string, title: string, separator = "|"): void {
  document.title = `${app} ${separator} ${title}`;
}
