const legacyHosts = new Set(["scorchapp.xyz", "www.scorchapp.xyz"]);

export function destinationFor(href) {
  const source = new URL(href);
  if (!legacyHosts.has(source.hostname) || !["http:", "https:"].includes(source.protocol)) {
    return null;
  }
  // Assign the components separately so a path cannot replace the fixed origin.
  const destination = new URL("https://catchfire.run");
  destination.pathname = source.pathname;
  destination.search = source.search;
  destination.hash = source.hash;
  return destination.href;
}

export function forwardLegacyPage(page) {
  const destination = destinationFor(page.location.href);
  if (!destination) return;
  page.document.getElementById("continue").href = destination;
  page.location.replace(destination);
}

if (typeof window !== "undefined") {
  forwardLegacyPage(window);
}
