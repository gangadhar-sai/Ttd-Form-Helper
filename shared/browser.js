// Cross-browser namespace shim.
// Chrome/Edge expose `chrome`; Firefox and Safari expose `browser` (and also
// alias `chrome` for most APIs). Preferring `browser` when present keeps the
// promise-based behaviour on Firefox/Safari while staying callback-compatible
// on Chromium, since every call site here uses callbacks.
const nativeApi = globalThis.browser ?? globalThis.chrome;

export const api = nativeApi ?? {
  runtime: {
    id: "tfh-local-dev",
    getURL: (path) => new URL("../" + path, import.meta.url).href,
    openOptionsPage: () => window.open("../options/index.html", "_blank"),
    onMessage: { addListener: () => {} },
    sendMessage: () => Promise.resolve({ ok: true }),
  },
  storage: {
    local: {
      get: (keys, cb) => {
        try {
          const res = {};
          const list = Array.isArray(keys) ? keys : [keys];
          list.forEach((k) => {
            const v = localStorage.getItem("tfh_" + k);
            if (v !== null) try { res[k] = JSON.parse(v); } catch { res[k] = v; }
          });
          cb(res);
        } catch { cb({}); }
      },
      set: (obj, cb) => {
        try {
          Object.entries(obj).forEach(([k, v]) => localStorage.setItem("tfh_" + k, JSON.stringify(v)));
          cb && cb();
        } catch { cb && cb(); }
      },
      remove: (keys, cb) => {
        try {
          const list = Array.isArray(keys) ? keys : [keys];
          list.forEach((k) => localStorage.removeItem("tfh_" + k));
          cb && cb();
        } catch { cb && cb(); }
      },
      clear: (cb) => {
        try { localStorage.clear(); } catch {}
        cb && cb();
      },
    },
    session: {
      get: (keys, cb) => cb && cb({}),
      set: (obj, cb) => cb && cb({}),
      remove: (keys, cb) => cb && cb({}),
    },
    onChanged: {
      addListener: () => {},
      removeListener: () => {},
    },
  },
  tabs: {
    query: (q, cb) => cb && cb([]),
    sendMessage: (id, msg, cb) => cb && cb({ ok: true, filled: 0 }),
  },
  action: {
    onClicked: { addListener: () => {} },
  },
};

/** chrome.storage.session is Chrome 102+, Firefox 115+, Safari 16.4+. */
export const hasSessionStorage = !!(api && api.storage && api.storage.session);

export function runtimeId() {
  try {
    return api.runtime && api.runtime.id;
  } catch {
    return null;
  }
}

