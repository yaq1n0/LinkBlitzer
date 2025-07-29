const w = (t) => {
    try {
      const e = new URL(t);
      return e.protocol === "http:" || e.protocol === "https:";
    } catch {
      return !1;
    }
  },
  v = (t) =>
    t
      .split(
        `
`,
      )
      .map((e) => e.trim())
      .filter((e) => e.length > 0),
  y = (t) => {
    if (t.length === 0)
      return { valid: !1, error: "Please enter at least one URL" };
    const e = t.filter((n) => !w(n));
    return e.length > 0
      ? { valid: !1, error: `Invalid URLs found: ${e.join(", ")}` }
      : { valid: !0, error: null };
  },
  C = (t, e) => {
    const n = new URLSearchParams();
    return (n.set("urls", t.join("|")), `${e}?${n.toString()}`);
  },
  B = async (t) => {
    try {
      return (await navigator.clipboard.writeText(t), !0);
    } catch {
      try {
        const e = document.createElement("textarea");
        return (
          (e.value = t),
          document.body.appendChild(e),
          e.select(),
          document.execCommand("copy"),
          document.body.removeChild(e),
          !0
        );
      } catch {
        return !1;
      }
    }
  },
  L = {
    chrome: {
      name: "Chrome",
      url: "https://support.google.com/chrome/answer/95472",
      instructions: `1. Click the three dots menu (⋮) → Settings
2. Click "Privacy and security" → "Site settings"
3. Click "Pop-ups and redirects"
4. Add this site to "Allowed to send pop-ups"`,
    },
    firefox: {
      name: "Firefox",
      url: "https://support.mozilla.org/en-US/kb/pop-blocker-settings-exceptions-troubleshooting",
      instructions: `1. Click the menu button (☰) → Settings
2. Click "Privacy & Security"
3. Under Permissions, click "Exceptions..." next to "Block pop-up windows"
4. Add this site to the exceptions list`,
    },
    safari: {
      name: "Safari",
      url: "https://support.apple.com/102524",
      instructions: `1. Safari → Settings (or Preferences)
2. Click "Websites" tab
3. Click "Pop-up Windows" on the left
4. Set this site to "Allow"`,
    },
    edge: {
      name: "Microsoft Edge",
      url: "https://support.microsoft.com/en-us/microsoft-edge/block-pop-ups-in-microsoft-edge-1d8ba4f8-f385-9a0b-e944-aa47339b6bb5",
      instructions: `1. Click the three dots menu (⋯) → Settings
2. Click "Cookies and site permissions"
3. Click "Pop-ups and redirects"
4. Click "Add" under Allow section and add this site`,
    },
  },
  P = () => {
    const t = navigator.userAgent.toLowerCase();
    return t.includes("edg/") || t.includes("edge/")
      ? "edge"
      : t.includes("chrome/") && !t.includes("edg/")
        ? "chrome"
        : t.includes("firefox/")
          ? "firefox"
          : t.includes("safari/") && !t.includes("chrome/")
            ? "safari"
            : "chrome";
  },
  g = () =>
    new Promise((t) => {
      const e = window.open(
        "",
        "_blank",
        "width=1,height=1,left=-1000,top=-1000",
      );
      if (!e) {
        t(!0);
        return;
      }
      setTimeout(() => {
        try {
          const n =
            e.innerHeight === 0 ||
            e.innerWidth === 0 ||
            e.outerHeight === 0 ||
            e.outerWidth === 0 ||
            e.closed;
          (e.close(), t(n));
        } catch {
          try {
            e.close();
          } catch {}
          t(!0);
        }
      }, 100);
    }),
  l = (t) => {
    const e = document.querySelector(".popup-banner");
    e && e.remove();
    const n = document.createElement("div");
    if (
      ((n.className = `popup-banner ${t ? "popup-blocked" : "popup-ready"}`), t)
    ) {
      const u = P(),
        r = L[u];
      n.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">⚠️</div>
        <div class="banner-text">
          <strong>POPUPS BLOCKED</strong><br>
          You need to allow popups for this site to work properly.
          <details class="popup-instructions">
            <summary>Click for ${r.name} instructions</summary>
            <div class="instructions-content">
              <p><strong>Quick steps:</strong></p>
              <pre>${r.instructions}</pre>
              <p><a href="${r.url}" target="_blank" rel="noopener">View detailed guide →</a></p>
            </div>
          </details>
        </div>
        <button class="banner-retest" data-retest>Retest</button>
      </div>
    `;
    } else
      n.innerHTML = `
      <div class="banner-content">
        <div class="banner-icon">✅</div>
        <div class="banner-text">
          <strong>READY TO BLITZ</strong><br>
          Popups are enabled. Your LinkBlitzer links will work perfectly!
        </div>
      </div>
    `;
    const i = document.querySelector(".container");
    i?.insertBefore(n, i.firstChild);
  },
  x = (t) => {
    const n = new URLSearchParams(window.location.search).get("urls");
    if (!n) return;
    const i = n.split("|").filter((r) => r.trim());
    if (i.length === 0) return;
    if (
      i.filter((r) => {
        try {
          const p = new URL(r);
          return p.protocol !== "http:" && p.protocol !== "https:";
        } catch {
          return !0;
        }
      }).length > 0
    ) {
      (alert("Invalid links found"), (window.location.href = t));
      return;
    }
    (i.forEach((r) => {
      window.open(r, "_blank");
    }),
      (window.location.href = t));
  },
  k = window.location.origin,
  a = { isBlocked: void 0 },
  b = document.getElementById("urls-input"),
  s = document.getElementById("generated-link"),
  o = document.getElementById("copy-btn"),
  d = document.getElementById("error-message"),
  h = (t) => {
    ((d.textContent = t), d.classList.remove("hidden"));
  },
  m = () => {
    d.classList.add("hidden");
  },
  c = () => {
    const t = v(b.value),
      e = y(t);
    if (a.isBlocked === !0) {
      ((s.value = ""),
        (s.placeholder = "Enable popups first to generate links"),
        (o.disabled = !0),
        h(
          "Popups are blocked. Please allow popups for this site before creating links.",
        ));
      return;
    }
    if (!e.valid) {
      ((s.value = ""),
        (s.placeholder = "All links must be valid..."),
        (o.disabled = !0),
        t.length > 0 ? h(e.error || "Invalid URLs") : m());
      return;
    }
    if (a.isBlocked === null) {
      ((s.value = ""),
        (s.placeholder = "Testing popup permissions..."),
        (o.disabled = !0));
      return;
    }
    m();
    const n = C(t, k);
    ((s.value = n), (s.placeholder = ""), (o.disabled = !1));
  },
  E = async () => {
    const t = s.value;
    if (!t) return;
    if (await B(t)) {
      const n = o.textContent;
      ((o.textContent = "Copied!"),
        setTimeout(() => {
          o.textContent = n;
        }, 1e3));
    }
  },
  S = async (t) => {
    const e = t.target;
    if (e.hasAttribute("data-retest")) {
      ((e.textContent = "Testing..."), (e.disabled = !0));
      try {
        const n = await g();
        ((a.isBlocked = n), l(n), c());
      } finally {
        ((e.textContent = "Retest"), (e.disabled = !1));
      }
    }
  },
  f = async () => {
    if (new URLSearchParams(window.location.search).has("urls")) {
      x(k);
      return;
    }
    (b.addEventListener("input", c),
      o.addEventListener("click", E),
      document.addEventListener("click", S));
    try {
      const e = await g();
      ((a.isBlocked = e), l(e), c());
    } catch (e) {
      (console.error("Failed to test popup permissions:", e),
        (a.isBlocked = !0),
        l(!0),
        c());
    }
  };
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", f)
  : f();
