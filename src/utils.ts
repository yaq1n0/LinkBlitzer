// URL validation and parsing utilities

export interface ValidationResult {
  valid: boolean;
  error: string | null;
}

/** Check if a string is a valid HTTP/HTTPS URL */
export const isValidUrl = (maybeUrl: string): boolean => {
  try {
    const url = new URL(maybeUrl);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

/** Parse URLs from textarea input (one per line) */
export const parseUrls = (text: string): string[] => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
};

/** Validate an array of URLs */
export const validateUrls = (urls: string[]): ValidationResult => {
  if (urls.length === 0) {
    return { valid: false, error: "Please enter at least one URL" };
  }

  const invalidUrls = urls.filter((url) => !isValidUrl(url));
  if (invalidUrls.length > 0) {
    return {
      valid: false,
      error: `Invalid URLs found: ${invalidUrls.join(", ")}`,
    };
  }

  return { valid: true, error: null };
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
