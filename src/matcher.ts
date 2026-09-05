const TRUMP_ACCOUNT_PATTERN = /\bTrump(?:['’]s)?\s+Account(s)?\b/gi;

export function replaceTrumpAccountMentions(text: string): string {
  return text.replace(TRUMP_ACCOUNT_PATTERN, (_match, pluralMarker: string | undefined) =>
    pluralMarker ? "530A IRAs" : "530A IRA"
  );
}
