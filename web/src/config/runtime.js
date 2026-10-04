(() => {
  const fallback = "https://veyraserver-xscy.onrender.com";
  let apiBase = fallback;
  try {
    const candidate = document.querySelector('meta[name="veyra-api"]')?.content || fallback;
    const url = new URL(candidate);
    if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.search || url.hash) throw new Error("invalid API origin");
    apiBase = url.href.replace(/\/$/, "");
  } catch {}
  window.VeyraRuntime = Object.freeze({ apiBase });
})();
