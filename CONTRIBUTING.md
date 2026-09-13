# Contributing to TidyShareLink

Small, well-explained improvements are welcome: a tracking rule with evidence, a clearer message, a reproducible bug, or a Traditional Chinese translation correction.

## Run it

Use Node.js 22.22.2+ and npm. The Raycast interface requires macOS and Raycast; the URL-cleaning tests and type checks also run without Raycast.

```sh
npm ci
npm run typecheck
npm test
npm run dev
```

Open **Tidy Link** in Raycast to check the interface. After editing, run `npm run build` to check the production bundle. The Raycast CLI writes the local extension into your Raycast configuration directory.

## Changes to rules

1. Explain the parameter's purpose and provide evidence that it can be removed.
2. Scope rules to the relevant website and path when the name has other meanings. For example, YouTube's `t` is a playback timestamp.
3. Add tests in `tests/clean-url.test.ts` for removal and preservation, including a different domain when relevant.
4. Preserve retained query encoding, order, repeated values, fragments, and common signed-link protection.

Use invented values in examples. Do not submit personal share tokens, signed URLs, access credentials, or private messages in public issues or tests.

## Product boundaries

- Link cleaning runs locally. Do not introduce automatic URL fetching, analytics, or a history database.
- Clipboard preview never automatically copies or pastes.
- Always-keep rules override removal rules; signed-link protection takes precedence over both.
- Unknown parameters remain untouched unless a user explicitly adds a removal rule.
- Network expansion needs a separately discussed design with explicit user action and honest tracking limits.
- Keep the native Raycast form focused and keyboard-friendly.

## Icons

The approved source and utility SVGs are included. Run `npm run icons` to regenerate PNG assets and the size preview. Sharp is a development-only dependency; it is not imported by the extension. See [the icon notes](design/ICONS.md).

## Pull requests

Describe the user-visible change, why it is needed, and how you checked it. Include a screenshot for interface changes and a safe before/after example for cleaning rules. Keep unrelated changes separate.

By contributing, you agree that your contributions are provided under the project's [MIT license](LICENSE).
