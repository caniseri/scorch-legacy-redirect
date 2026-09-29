# Scorch Legacy Redirect

Compatibility site for scorchapp.xyz and www.scorchapp.xyz after the Catchfire rename.
GitHub Pages publishes the root of main. The application website remains in caniseri/scorch-site.

- Browser navigation uses a fixed https://catchfire.run origin, preserving the path, query string and fragment.
- Invitations keep token and fid parameters. No analytics, storage, external scripts, or real invitation fixtures are included.
- location.replace prevents a back-button redirect loop. A visible fallback link receives the same destination before navigation.
- Root, invite, support, demo, routes, privacy and terms have explicit pages; 404.html handles other paths.
- This is a JavaScript redirect, not a server-side HTTP 301. Without JavaScript, a visitor must retain the path/query when replacing the old hostname; the fallback page states this limitation.
- DNS and email records remain unchanged. The old domain's Pages binding moves here only when the Catchfire site is ready.

Run npm test with Node 20 or newer. There are no package dependencies.

The flame mark is the existing Scorch/Catchfire brand asset, copied from caniseri/scorch-site.
Code and artwork are provided for operating these owned domains, not licensed for reuse.
