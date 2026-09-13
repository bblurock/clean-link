import { Action, ActionPanel, Clipboard, Form, getPreferenceValues, openExtensionPreferences, showHUD, showToast, Toast } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import { cleanUrl, validateCleanOptions, type CleanOptions, type CleanResult } from "./clean-url";

interface LinkPreferences extends CleanOptions {
  useClipboardOnLaunch: boolean;
}

function actionIcon(name: "copy" | "paste" | "clipboard" | "rules") {
  return { source: { light: `actions/${name}.png`, dark: `actions/${name}@dark.png` } };
}

export default function Command() {
  const preferences = getPreferenceValues<LinkPreferences>();
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRevision = useRef(0);
  const actionInProgress = useRef(false);

  function changeInput(value: string) {
    inputRevision.current += 1;
    setInput(value);
    setSubmitted(false);
  }

  useEffect(() => {
    if (!preferences.useClipboardOnLaunch) return;
    let active = true;
    const revision = inputRevision.current;
    void Clipboard.readText().then((text) => {
      if (!active || inputRevision.current !== revision || !text) return;
      try {
        cleanUrl(text);
        setInput(text.trim());
      } catch {
        // Ordinary clipboard text should leave a quiet, empty form.
      }
    }).catch(() => { /* Manual input remains available if clipboard access fails. */ });
    return () => { active = false; };
  }, [preferences.useClipboardOnLaunch]);

  let result: CleanResult | undefined;
  let inputError: string | undefined;
  let settingsError: string | undefined;
  try {
    validateCleanOptions(preferences);
  } catch (cause) {
    settingsError = (cause as Error).message;
  }
  if (!settingsError) {
    try {
      result = cleanUrl(input, preferences);
    } catch (cause) {
      inputError = (cause as Error).message;
    }
  }

  async function finish(mode: "copy" | "paste") {
    setSubmitted(true);
    if (!result || actionInProgress.current) return;
    actionInProgress.current = true;
    setBusy(true);
    try {
      if (mode === "paste") await Clipboard.paste(result.url);
      else await Clipboard.copy(result.url);
      const count = result.removed.length;
      const message = count ? ` — ${count} tracking ${count === 1 ? "parameter" : "parameters"} removed` : " unchanged";
      await showHUD(`Link ${mode === "paste" ? "pasted" : "copied"}${message}`);
    } catch {
      await showToast({ style: Toast.Style.Failure, title: `Could not ${mode} the link` });
    } finally {
      actionInProgress.current = false;
      setBusy(false);
    }
  }

  async function useClipboard() {
    const revision = ++inputRevision.current;
    try {
      const text = await Clipboard.readText();
      if (inputRevision.current !== revision) return;
      changeInput(text ?? "");
      setSubmitted(true);
    } catch {
      await showToast({ style: Toast.Style.Failure, title: "Could not read the clipboard" });
    }
  }

  const hasCustomRules = Boolean(preferences.additionalParameters?.trim() || preferences.keepParameters?.trim());
  const status = !result ? undefined : result.notice
    ? result.notice
    : result.removed.length
      ? `${result.removed.length} tracking ${result.removed.length === 1 ? "parameter" : "parameters"} removed: ${result.removed.join(", ")}`
      : "No matching tracking parameters. The link will be copied unchanged.";

  return (
    <Form
      navigationTitle="Tidy Link"
      isLoading={busy}
      actions={
        <ActionPanel>
          {!settingsError && <ActionPanel.Section>
            <Action.SubmitForm title="Copy Link" icon={actionIcon("copy")} onSubmit={() => finish("copy")} />
            <Action title="Paste Link" icon={actionIcon("paste")} shortcut={{ modifiers: ["cmd", "shift"], key: "return" }} onAction={() => finish("paste")} />
          </ActionPanel.Section>}
          <ActionPanel.Section>
            <Action title="Use Link from Clipboard" icon={actionIcon("clipboard")} shortcut={{ modifiers: ["cmd", "shift"], key: "v" }} onAction={useClipboard} />
            <Action title="Configure Rules" icon={actionIcon("rules")} shortcut={{ modifiers: ["cmd", "shift"], key: "p" }} onAction={openExtensionPreferences} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      <Form.TextField
        id="url"
        title="Link"
        placeholder="Paste an https:// link"
        value={input}
        onChange={changeInput}
        error={submitted ? inputError : undefined}
        autoFocus
      />
      {settingsError ? <Form.Description title="Check Your Rules" text={`${settingsError} Open Configure Rules (⌘⇧P), then reopen Tidy Link.`} /> : <>
        <Form.Description title="Result" text={result?.url ?? "Your link preview will appear here."} />
        {status && <Form.Description title={result?.notice ? "Protected Link" : "Changes"} text={status} />}
      </>}
      <Form.Separator />
      <Form.Description title="Rules" text={hasCustomRules ? "Built-in rules + your custom rules. Always-keep rules take priority." : "Built-in tracking rules. Add your own with Configure Rules (⌘⇧P)."} />
      <Form.Description text="⌘Return to copy · ⌘⇧Return to paste. Works locally; short links are not expanded." />
    </Form>
  );
}
