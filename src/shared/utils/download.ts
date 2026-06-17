export function downloadByUrl(url: string) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.click();
}
