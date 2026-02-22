// Popup detection and browser-specific guidance

export type BrowserType = "chrome" | "firefox" | "safari" | "edge";

export interface BrowserGuide {
  name: string;
  url: string;
  instructions: string;
}

export interface PopupState {
  popupsBlocked?: boolean; // undefined = untested, true = blocked, false = allowed
}

// Browser support links for popup disabling instructions
export const BROWSER_POPUP_GUIDES: Record<BrowserType, BrowserGuide> = {
  chrome: {
    name: "Chrome",
    url: "https://support.google.com/chrome/answer/95472",
    instructions:
      '1. Click the three dots menu (⋮) → Settings\n2. Click "Privacy and security" → "Site settings"\n3. Click "Pop-ups and redirects"\n4. Add this site to "Allowed to send pop-ups"',
  },
  firefox: {
    name: "Firefox",
    url: "https://support.mozilla.org/en-US/kb/pop-blocker-settings-exceptions-troubleshooting",
    instructions:
      '1. Click the menu button (☰) → Settings\n2. Click "Privacy & Security"\n3. Under Permissions, click "Exceptions..." next to "Block pop-up windows"\n4. Add this site to the exceptions list',
  },
  safari: {
    name: "Safari",
    url: "https://support.apple.com/102524",
    instructions:
      '1. Safari → Settings (or Preferences)\n2. Click "Websites" tab\n3. Click "Pop-up Windows" on the left\n4. Set this site to "Allow"',
  },
  edge: {
    name: "Microsoft Edge",
    url: "https://support.microsoft.com/en-us/microsoft-edge/block-pop-ups-in-microsoft-edge-1d8ba4f8-f385-9a0b-e944-aa47339b6bb5",
    instructions:
      '1. Click the three dots menu (⋯) → Settings\n2. Click "Cookies and site permissions"\n3. Click "Pop-ups and redirects"\n4. Click "Add" under Allow section and add this site',
  },
};

/** Detect the user's browser based on user agent */
export const detectBrowser = (): BrowserType => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes("edg/")) {
    return "edge";
  }
  if (userAgent.includes("chrome/")) {
    return "chrome";
  }
  if (userAgent.includes("firefox/")) {
    return "firefox";
  }
  if (userAgent.includes("safari/")) {
    return "safari";
  }

  return "chrome"; // Default fallback
};

/** Test if popup permissions are allowed by attempting to open a tiny window */
export const testPopupPermission = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Try to open a tiny popup window
    const testWindow = window.open(
      "",
      "_blank",
      "width=1,height=1,left=-1000,top=-1000",
    );

    if (!testWindow) {
      // Most browsers: window.open returns null when blocked
      resolve(true); // blocked
      return;
    }

    // Chrome-specific detection: Chrome returns a window object even when blocked
    setTimeout(() => {
      try {
        // Check if window has dimensions (not blocked) or is minimized (blocked)
        const isBlocked =
          testWindow.innerHeight === 0 ||
          testWindow.innerWidth === 0 ||
          testWindow.outerHeight === 0 ||
          testWindow.outerWidth === 0 ||
          testWindow.closed;

        testWindow.close();
        resolve(isBlocked);
      } catch (error) {
        // Cross-origin or access denied - likely blocked
        try {
          testWindow.close();
        } catch (e) {
          // Ignore close errors
        }
        resolve(true);
      }
    }, 100);
  });
};

/** Create and show popup status banner */
export const showPopupBanner = (isBlocked: boolean): void => {
  // Remove any existing banners
  const existingBanner = document.querySelector(".popup-banner");
  if (existingBanner) {
    existingBanner.remove();
  }

  const banner = document.createElement("div");
  banner.className = `popup-banner ${isBlocked ? "popup-blocked" : "popup-ready"}`;

  if (isBlocked) {
    const browser = detectBrowser();
    const browserInfo = BROWSER_POPUP_GUIDES[browser];

    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">⚠️</div>
        <div class="banner-text">
          <strong>POPUPS BLOCKED</strong><br>
          You need to allow popups for this site to work properly.
          <details class="popup-instructions">
            <summary>Click for ${browserInfo.name} instructions</summary>
            <div class="instructions-content">
              <p><strong>Quick steps:</strong></p>
              <pre>${browserInfo.instructions}</pre>
              <p><a href="${browserInfo.url}" target="_blank" rel="noopener">View detailed guide →</a></p>
            </div>
          </details>
        </div>
        <button class="banner-retest" data-retest>Retest</button>
      </div>
    `;
  } else {
    banner.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">✅</div>
        <div class="banner-text">
          <strong>READY TO BLITZ</strong><br>
          Popups are enabled. Your LinkBlitzer links will work perfectly!
        </div>
      </div>
    `;
  }

  // Insert banner at top of container
  const container = document.querySelector(".container");
  container?.insertBefore(banner, container.firstChild);
};

/** Handle the blitz action - open URLs from query params */
export const handleBlitz = (baseUrl: string): void => {
  const params = new URLSearchParams(window.location.search);
  const urlsParam = params.get("urls");

  if (!urlsParam) return;

  const urls = urlsParam.split("|").filter((url) => url.trim());

  if (urls.length === 0) return;

  // Check for invalid URLs
  const invalidUrls = urls.filter((url) => {
    try {
      const testUrl = new URL(url);
      return testUrl.protocol !== "http:" && testUrl.protocol !== "https:";
    } catch {
      return true;
    }
  });

  if (invalidUrls.length > 0) {
    alert("Invalid links found");
    window.location.href = baseUrl;
    return;
  }

  // Open all valid URLs
  urls.forEach((url) => {
    window.open(url, "_blank");
  });

  // Redirect back to base
  window.location.href = baseUrl;
};
