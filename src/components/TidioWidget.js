import React, { useEffect } from 'react';

/**
 * Replace with your exact script URL (the same one you put in index.html)
 * e.g. //code.tidio.co/kxmefq2rftxfzoffc2r9n4j21pnznmoe.js
 */
const TIDIO_SRC = '//code.tidio.co/kxmefq2rftxfzoffc2r9n4j21pnznmoe.js';

const TidioWidget = () => {
  // ---- Helpers ----
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

  const clearTidioCookies = () => {
    if (!isBrowser) return;
    const all = document.cookie.split(';');
    const host = window.location.hostname;
    const parts = host.split('.');
    const domains = [];

    // current domain + parent domain (e.g., example.com, .example.com)
    if (parts.length >= 2) {
      const base = parts.slice(-2).join('.');
      domains.push(base, '.' + base);
    }
    domains.push(host); // exact host

    all.forEach(raw => {
      const name = raw.split('=')[0].trim();
      if (!name.toLowerCase().startsWith('tidio')) return;

      // expire cookie for multiple domain variants
      domains.forEach(d => {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${d}`;
      });
      // fallback (no domain)
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  };

  const clearTidioStorage = () => {
    if (!isBrowser) return;
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.toLowerCase().includes('tidio')) localStorage.removeItem(k);
      });
    } catch {}
    try {
      Object.keys(sessionStorage).forEach(k => {
        if (k.toLowerCase().includes('tidio')) sessionStorage.removeItem(k);
      });
    } catch {}
  };

  const removeExistingTidio = () => {
    if (!isBrowser) return;

    // remove script tags
    document.querySelectorAll(`script[src*="code.tidio.co"]`).forEach(n => n.parentNode?.removeChild(n));

    // remove Tidio containers/iframes if present
    const containers = [
      '#tidio-chat',
      'iframe[src*="code.tidio.co"]',
      'iframe[id*="tidio"]'
    ];
    containers.forEach(sel => {
      document.querySelectorAll(sel).forEach(n => n.parentNode?.removeChild(n));
    });

    // drop global references
    try { delete window.tidioChatApi; } catch {}
    try { delete window.tidioChatInit; } catch {}
  };

  const injectTidioScript = () => {
    if (!isBrowser) return;
    const s = document.createElement('script');
    s.src = TIDIO_SRC;
    s.async = true;
    document.body.appendChild(s);
  };

  // ---- Reset on each load ----
  useEffect(() => {
    if (!isBrowser) return;

    // 1) wipe session traces
    clearTidioCookies();
    clearTidioStorage();

    // 2) remove any existing instance
    removeExistingTidio();

    // 3) re‑inject fresh script
    // slight delay ensures DOM is clean before re-adding
    const t = setTimeout(injectTidioScript, 50);

    // Optional: expose a manual reset handler
    window.resetTidioChat = () => {
      clearTidioCookies();
      clearTidioStorage();
      removeExistingTidio();
      injectTidioScript();
    };

    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.message === "Script error.") {
        e.preventDefault();
      }
    };
    window.addEventListener("error", handler);
    return () => window.removeEventListener("error", handler);
  }, []);

  return null;
};

export default TidioWidget;
