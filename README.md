<p align="center">
  <img src="assets/clean-link-final.png" width="88" height="88" alt="TidyShareLink: cream clipped paper with an ink link and a yellow corner on blue">
</p>
<h1 align="center">TidyShareLink</h1>
<p align="center">Cleaner links, ready to share.</p>
<p align="center">A free, open-source Raycast extension that removes common tracking parameters on your Mac.<br>Preview what changes, then copy or paste.</p>
<p align="center">
  <a href="#install">Install on Mac</a> ·
  <a href="README.zh-TW.md">繁體中文</a> ·
  <a href="#privacy-and-limits">Privacy</a> ·
  <a href="CONTRIBUTING.md">Contribute</a>
</p>
<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-355FC0" alt="MIT license"></a>
  <a href="https://github.com/bblurock/tidy-share-link/actions/workflows/ci.yml"><img src="https://github.com/bblurock/tidy-share-link/actions/workflows/ci.yml/badge.svg" alt="Automated checks"></a>
</p>

<p align="center"><a href="https://github.com/bblurock/tidy-share-link/releases/download/v0.1.0/tidysharelink-product-video.mp4"><img src="docs/images/demo.gif" width="750" alt="TidyShareLink demo: copy a browser URL, preview tracking-parameter removal in Raycast, then copy the result back to the browser."></a></p>

<p align="center">A 10-second walkthrough: copy a link, tidy it in Raycast, and paste the result. Edited with <a href="https://github.com/getopenscreen/openscreen">OpenScreen</a>. <a href="https://github.com/bblurock/tidy-share-link/releases/download/v0.1.0/tidysharelink-product-video.mp4">Full-quality video (MP4)</a> · <a href="docs/images/preview.jpg">Static screenshot</a>.</p>

```text
Before   https://example.com/?id=42&fbclid=demo
After    https://example.com/?id=42
```

## A small tool for everyday sharing

- **See what changes.** The cleaned link and removed parameter names appear together before you copy.
- **Keep the useful parts.** Built-in rules preserve timestamps, playlists, unknown parameters, and fragments. Common signed links are left unchanged.
- **Make it yours.** Add parameter names or prefix rules, and set exceptions for parameters you always want to keep.

No link fetching, analytics, or URL history of its own. Cleaning runs locally.

## Install

**Install from source on your Mac.** TidyShareLink is not in the Raycast Store yet. There is no one-click Store install for this release.

### 1. Set up Raycast and Node.js

- [Download Raycast](https://www.raycast.com/), move it to Applications, and open it to finish setup. Keep Raycast running during installation.
- Install [Node.js](https://nodejs.org/en/download) **22.22.2 or newer** with npm. Node 24 also works. Reopen Terminal after installing Node.js.
- Open **Terminal** from Applications → Utilities and check:

  ```sh
  node --version
  npm --version
  ```

If either command is missing, finish installing Node.js before continuing. Raycast's [Import Extension command requires signing in](https://developers.raycast.com/basics/getting-started); complete any Raycast sign-in prompt during setup. TidyShareLink has no separate account.

### 2. Download TidyShareLink

If Git is installed, run these commands in Terminal:

```sh
git clone https://github.com/bblurock/tidy-share-link.git
cd tidy-share-link
```

**Without Git:** choose **Code → Download ZIP** on this GitHub page and unzip it. In Terminal, type `cd ` (including the space), drag the extracted folder from Finder into Terminal, then press Return. Choose the folder containing `package.json`.

### 3. Build and add it to Raycast

Run these commands from the project folder:

```sh
npm ci
npm run dev
```

`npm ci` installs the project's dependencies. `npm run dev` runs Raycast's `ray develop` command: it builds TidyShareLink and **automatically imports the extension into your local Raycast installation**. You do not need to copy files into Raycast or install the Raycast CLI separately. See [Raycast's CLI documentation](https://developers.raycast.com/information/developer-tools/cli#development).

Wait for the successful build message. The terminal keeps running to watch for code changes; that is expected.

### 4. Confirm it works

Open Raycast with your usual shortcut and search **Tidy Link** or **TidyShareLink**. Open the **Tidy Link** command, paste this example, and confirm that the result keeps `id=42` and removes `fbclid`:

```text
https://example.com/?id=42&fbclid=demo
```

Choose **Copy Link** to copy the result. You can also find the extension under **Raycast Settings → Extensions → TidyShareLink**.

### 5. Stop the installer

After the command works, return to Terminal and press **Ctrl+C**. You can close Terminal. The extension stays installed, including after restarting your Mac; you do not run `npm run dev` every time you use it. Raycast documents [using extensions after stopping development mode](https://developers.raycast.com/basics/create-your-first-extension#use-your-extension).

Keep the source folder if you want to update or customize the extension later.

### Installation help

| What you see | What to do |
| --- | --- |
| `npm: command not found` or an unsupported Node version | Install a supported Node.js version, reopen Terminal, and check `node --version`. |
| An error about missing `package.json` | Return to step 2 and open Terminal in the extracted/cloned project folder. |
| `npm ci` or the build fails | Resolve the first error shown in Terminal before looking for the command in Raycast. Include that error when reporting an issue. |
| The build succeeds, but Tidy Link is missing | Confirm Raycast is running. Search for **Import Extension** in Raycast, select the project folder containing `package.json`, and follow its prompts. Sign in if requested, then run `npm run dev` from that folder again. |
| You still see the old Clean Link name | Update your source checkout and run `npm run dev` again. The original v0.1.0 release archives predate the rename; use the main-branch download above for TidyShareLink. |

### Use it

Opening **Tidy Link** previews a complete HTTP/HTTPS URL from your clipboard when that preference is enabled. You can also paste a link into the **Link** field. Review the result, then choose an action:

| Action | Shortcut |
| --- | --- |
| Copy and close Raycast | ⌘Return |
| Paste into the previously active app | ⌘⇧Return |
| Load a link from the clipboard | ⌘⇧V |
| Configure rules | ⌘⇧P |
| Show all actions | ⌘K |

Clipboard preview never automatically copies or pastes.

### Update or uninstall

To update a Git checkout, run `git pull --ff-only`, `npm ci`, and `npm run dev` from its folder, then stop with Ctrl+C once registered. Keep any local changes safe before updating. ZIP installations can download and extract the new version, then repeat installation. There is no automatic update checker.

To remove the extension, open **Raycast Settings → Extensions**, select **TidyShareLink**, and use its removal action. Deleting the source folder alone does not remove the registered command.

## Customize your rules

Open **Configure Rules** with **⌘⇧P**, or find TidyShareLink in Raycast Settings → Extensions. Reopen the command after changing preferences.

| Setting | Example | Behavior |
| --- | --- | --- |
| Additional Parameters to Remove | `campaign_id, track_*` | Adds removal rules on every website |
| Parameters to Always Keep | `ref, campaign_id` | Overrides built-in and additional removal rules |
| Start with Clipboard | Enabled by default | Previews the current clipboard URL on launch |

Names are case-insensitive and can be separated by commas or whitespace. A final `*` matches a prefix: `track_*` matches `track_source`, but not `track`. Letters, digits, `_`, `-`, `.`, and `~` are supported. Enter names only, without `?`, `&`, or `=value`.

A bare `*`, regular expressions, and wildcards in the middle are rejected. Invalid settings show an explanation and prevent copying until corrected. Leave the rule fields empty to use the built-in defaults. Common signed-link protection takes priority over all custom rules.

## What gets cleaned?

| Link | Built-in behavior |
| --- | --- |
| Any website | Removes `utm_*` and common identifiers including `fbclid`, `gclid`, and `msclkid` |
| YouTube | Removes `si`; keeps video IDs, `t`, playlists, and playback position parameters |
| Instagram | Removes `igsh` and the general `igshid` rule |
| Facebook | Removes `mibextid` and general tracking parameters |
| Spotify track links | Removes `si` on `open.spotify.com` |
| X / Twitter post links | Removes `s` and `t` on numeric status paths |
| Common signed/access-token links | Leaves the whole URL unchanged and explains why |

[Read the full rule set](src/clean-url.ts). Retained query values keep their original encoding, order, and duplicates. Unknown parameters, paths, and fragments remain intact. Removal is conservative; it does not guarantee every tracker is removed or every website remains compatible.

## Privacy and limits

The extension does not open the pasted URL, make network requests to resolve it, execute page scripts, send analytics, or save its own URL history. It reads the clipboard on launch only when enabled, or when you choose **Use Link from Clipboard**. Copy/paste actions write the result; Raycast's own clipboard-history settings still apply.

Installing and updating dependencies contacts npm and GitHub. Raycast's own services are separate from this extension's local cleaning behavior.

**Short links stay short.** Opaque links such as `threads.com/share/...`, `bit.ly/...`, and `t.co/...` are not expanded. The destination may exist only on the provider's server. Looking it up can itself be logged, even without browser cookies. A clean-looking URL is not proof that it contains no tracking.

There is no redirect unwrapping in this release, including wrappers that embed a destination. Tracking inside paths or fragments is also left intact. Signed-link detection is a heuristic, not a guarantee of compatibility. Review unusual links before sharing.

## Help shape it

Found a parameter we missed? [Suggest a rule](https://github.com/bblurock/tidy-share-link/issues/new?template=tracking_rule.yml) with a safe example and evidence that it can be removed. [Report a bug](https://github.com/bblurock/tidy-share-link/issues/new?template=bug_report.yml), improve a translation, or share the project with someone who would use it.

Made by [Benson Lu](https://github.com/bblurock). Follow along there for more small tools.

## Development

```sh
npm ci
npm test
npm run typecheck
npm run build
```

The URL logic is in [`src/clean-url.ts`](src/clean-url.ts); the native Raycast form is in [`src/clean-link.tsx`](src/clean-link.tsx). Tests and type checks run without Raycast. Building/registering the extension uses the Raycast CLI and writes to its local configuration directory on macOS.

Run `npm run icons` to export the included artwork and editable utility SVGs. See the [contribution guide](CONTRIBUTING.md), [icon design notes](design/ICONS.md), and [changelog](CHANGELOG.md).

## License and credits

[MIT](LICENSE). Free to use, modify, and share.

Built with the [Raycast API](https://developers.raycast.com/). Dependencies retain their own licenses. The app artwork was created with AI image generation and refined through visual review; the selected source and utility SVGs are included. Its warm paper, ink, and blue direction follows Benson's Open Studio design principles.
