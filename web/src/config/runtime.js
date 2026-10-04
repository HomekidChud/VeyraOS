(() => {
  const fallback = "https://veyraserver-xscy.onrender.com";
  let apiBase = fallback;
  try {
    const candidate = document.querySelector('meta[name="veyra-api"]')?.content || fallback;
    const url = new URL(candidate);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error("invalid API origin");
    apiBase = url.href.replace(/\/$/, "");
  } catch {}
  const apiKey = document.querySelector('meta[name="veyra-api-key"]')?.content?.trim() || "";
  window.VeyraRuntime = Object.freeze({ apiBase, apiKey });
})();
