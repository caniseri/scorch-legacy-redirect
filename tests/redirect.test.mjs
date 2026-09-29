import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { destinationFor, forwardLegacyPage } from "../redirect.mjs";

test("root and www move to the same HTTPS destination", () => {
  for (const host of ["scorchapp.xyz", "www.scorchapp.xyz"]) {
    for (const scheme of ["https", "http"]) {
      assert.equal(destinationFor(scheme + "://" + host + "/"), "https://catchfire.run/");
    }
  }
});

test("invitation path, token, attribution, repeated query values and fragment survive", () => {
  const suffix = "/invite/?token=12345678-1234-4234-8234-123456789abc&fid=abcdefab-1234-4234-8234-123456789abc&x=a%2Bb&x=c+d#preview";
  assert.equal(destinationFor("https://scorchapp.xyz" + suffix), "https://catchfire.run" + suffix);
});

test("legal and unknown paths are retained for the destination to handle", () => {
  for (const path of ["/privacy/", "/terms/", "/support/#saving", "/unknown/deep/path?source=legacy", "/encoded%20path?q=%26"]) {
    assert.equal(destinationFor("https://scorchapp.xyz" + path), "https://catchfire.run" + path);
  }
});

test("paths and queries cannot choose a different destination origin", () => {
  for (const suffix of ["//evil.example/a", "/%2F%2Fevil.example/", "/?next=https://evil.example"]) {
    assert.equal(new URL(destinationFor("https://scorchapp.xyz" + suffix)).origin, "https://catchfire.run");
  }
});

test("non-legacy hosts and protocols never redirect, avoiding loops", () => {
  for (const href of ["https://catchfire.run/", "https://scorchapp.xyz.evil.example/", "https://caniseri.github.io/", "https://localhost/", "ftp://scorchapp.xyz/"]) {
    assert.equal(destinationFor(href), null);
  }
});

test("fallback link preserves the same URL and replace avoids a back-button loop", () => {
  const link = { href: "" };
  let replaced;
  forwardLegacyPage({
    location: {
      href: "https://scorchapp.xyz/invite/?token=synthetic&fid=synthetic#join",
      replace: (value) => { replaced = value; },
    },
    document: { getElementById: (id) => { assert.equal(id, "continue"); return link; } },
  });
  assert.equal(replaced, "https://catchfire.run/invite/?token=synthetic&fid=synthetic#join");
  assert.equal(link.href, replaced);
});

test("known paths and the catch-all share a no-referrer, no-index fallback without analytics", () => {
  const page = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  for (const path of ["404.html", "invite/index.html", "privacy/index.html", "terms/index.html", "support/index.html", "demo/index.html", "pilot-routes/index.html"]) {
    assert.equal(readFileSync(new URL("../" + path, import.meta.url), "utf8"), page, path);
  }
  assert.match(page, /name="referrer" content="no-referrer"/);
  assert.match(page, /name="robots" content="noindex, follow"/);
  assert.match(page, /<noscript>/);
  assert.match(page, /src="\/redirect\.mjs"/);
  assert.doesNotMatch(page, /<script[^>]+src="https?:/);
  assert.doesNotMatch(page, /http-equiv="refresh"/);
});
