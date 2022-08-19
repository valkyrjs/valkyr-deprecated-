export function setPageTitle(title: string): void {
  document.title = `Ideate | ${title}`;
}

export function convertToText(html: string): string {
  // Create a new div element
  const tempDivElement = document.createElement("div");

  // Set the HTML content with the given value
  tempDivElement.innerHTML = html;

  // Retrieve the text property of the element
  return tempDivElement.textContent || tempDivElement.innerText || "";
}
