// URL validation and parsing utilities

export type ValidationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      error: string;
    };

/** Parse URLs from textarea input separated by newlines */
export const parseUrlsNewlines = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

/** Parse URLs from textarea when input is separated by commas */
export const parseUrlsCommas = (text: string): string[] =>
  text
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);

/** Try various parsing strategies */
export const parseUrls = (text: string): string[] => {
  const urlsCommas = parseUrlsCommas(text);
  if (urlsCommas.length > 0) {
    return urlsCommas;
  }

  const urlsNewlines = parseUrlsNewlines(text);
  if (urlsNewlines.length > 0) {
    return urlsNewlines;
  }

  return [];
};

export const getValidUrl = (input: string): URL | undefined => {
  try {
    return new URL(input);
  } catch {
    // If parsing fails, try adding https:// and parse again
    try {
      return new URL(`https://${input}`);
    } catch {
      return undefined;
    }
  }
};

/** Validate an array of maybe url strings */
export const validateUrls = (urls: string[]): ValidationResult => {
  if (urls.length === 0) {
    return { valid: false, error: "Please enter at least one URL" };
  }

  const invalidUrls = urls.map(getValidUrl).filter((url) => !url);

  if (invalidUrls.length > 0) {
    console.log("Invalid URLs:", invalidUrls);
    return {
      valid: false,
      error: `Invalid URLs found: ${invalidUrls.join(", ")}`,
    };
  }

  return { valid: true };
};

/** Generate a LinkBlitzer URL from a list of URLs */
export const generateBlitzLink = (urls: string[], baseUrl: string): string => {
  const params = new URLSearchParams();
  params.set("urls", urls.join("|"));
  return `${baseUrl}?${params.toString()}`;
};

/** Get URLs from query parameters */
export const getUrlsFromQuery = (): string[] => {
  const params = new URLSearchParams(window.location.search);
  const urlsParam = params.get("urls");
  return urlsParam?.length
    ? urlsParam.split("|").filter((url) => url.trim())
    : [];
};

/** Copy text to clipboard with modern API and fallback */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      return false;
    }
  }
};
