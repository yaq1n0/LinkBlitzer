import {
  parseUrls,
  validateUrls,
  generateBlitzLink,
  copyToClipboard,
} from "./utils.ts";

import {
  testPopupPermission,
  showPopupBanner,
  handleBlitz,
  type PopupState,
} from "./popups.ts";

// Configuration
const BASE_URL = window.location.origin;

// Application state
const state: PopupState = {
  popupsBlocked: undefined,
};

// DOM Elements (RAW JS RAHHHHH)
const urlsInput = document.getElementById("urls-input") as HTMLTextAreaElement;
const generatedLink = document.getElementById(
  "generated-link"
) as HTMLInputElement;
const copyBtn = document.getElementById("copy-btn") as HTMLButtonElement;
const errorMessage = document.getElementById("error-message") as HTMLElement;

/** Show error message */
const showError = (message: string): void => {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
};

/** Hide error message */
const hideError = (): void => {
  errorMessage.classList.add("hidden");
};

/** Update the generated link based on current input */
const updateGeneratedLink = (): void => {
  const urls = parseUrls(urlsInput.value);
  const validation = validateUrls(urls);

  // Testing popup permissions
  if (state.popupsBlocked === undefined) {
    generatedLink.value = "";
    generatedLink.placeholder = "Testing popup permissions...";
    copyBtn.disabled = true;
    return;
  }

  // if popups blocked
  if (state.popupsBlocked) {
    generatedLink.value = "";
    generatedLink.placeholder = "Enable popups first to generate links";
    copyBtn.disabled = true;
    showError(
      "Popups are blocked. Please allow popups for this site before creating links."
    );
    return;
  }

  // If urls invalid
  if (!validation.valid) {
    generatedLink.value = "";
    generatedLink.placeholder = "All links must be valid...";
    copyBtn.disabled = true;

    if (urls.length > 0) {
      showError(validation.error || "Invalid URLs");
    } else {
      hideError();
    }
    return;
  }

  hideError();
  const link = generateBlitzLink(urls, BASE_URL);
  generatedLink.value = link;
  generatedLink.placeholder = "";
  copyBtn.disabled = false;
};

/** Handle copy button click */
const handleCopyClick = async (): Promise<void> => {
  const link = generatedLink.value;
  if (!link) return;

  const success = await copyToClipboard(link);
  if (success) {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1000);
  }
};

/** Handle popup retest button click */
const handleRetestClick = async (event: Event): Promise<void> => {
  const target = event.target as HTMLButtonElement;
  if (!target.hasAttribute("data-retest")) return;

  target.textContent = "Testing...";
  target.disabled = true;

  try {
    const isBlocked = await testPopupPermission();
    state.popupsBlocked = isBlocked;
    showPopupBanner(isBlocked);
    updateGeneratedLink();
  } finally {
    target.textContent = "Retest";
    target.disabled = false;
  }
};

/** Initialize the application */
const initializeApp = async (): Promise<void> => {
  // Handle blitz mode if query params exist
  const params = new URLSearchParams(window.location.search);
  if (params.has("urls")) {
    handleBlitz(BASE_URL);
    return;
  }

  // Normal create mode setup
  urlsInput.addEventListener("input", updateGeneratedLink);
  copyBtn.addEventListener("click", handleCopyClick);

  // Event delegation for popup retest buttons
  document.addEventListener("click", handleRetestClick);

  // Test popup permissions on load
  try {
    const isBlocked = await testPopupPermission();
    state.popupsBlocked = isBlocked;
    showPopupBanner(isBlocked);
    updateGeneratedLink();
  } catch (error) {
    console.error("Failed to test popup permissions:", error);
    // Assume popups are blocked if test fails
    state.popupsBlocked = true;
    showPopupBanner(true);
    updateGeneratedLink();
  }
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}
