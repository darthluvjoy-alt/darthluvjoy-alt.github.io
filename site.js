"use strict";

const landingSources = new URLSearchParams(window.location.search).getAll("src");
const source = landingSources.length === 1 ? landingSources[0].toLowerCase() : "";
const isPilotSource = /^(?:youtube-(?:alpha|skill|profile)|creator-[a-z0-9](?:[a-z0-9_-]{0,28}[a-z0-9])?)$/.test(source);

// Apple limits campaign tokens to 30 characters. Shorten only longer handles
// and include a stable suffix so creators sharing a prefix remain distinct.
function appleCampaign(source) {
  const full = "op18-" + source;
  if (full.length <= 30) return full;
  let hash = 2166136261;
  for (const char of source) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  }
  return full.slice(0, 22) + "-" + hash.toString(36).padStart(7, "0");
}

if (isPilotSource) {
  const pages = new Set(["/", "/guides/choose-your-starter/", "/guides/the-alpha/", "/press/"]);
  for (const link of document.querySelectorAll("a[href]")) {
    const url = new URL(link.href);
    if (link.dataset.store === "google") {
      url.searchParams.set("utm_source", source);
      const referrer = new URLSearchParams(url.searchParams.get("referrer"));
      referrer.set("utm_source", source);
      url.searchParams.set("referrer", referrer.toString());
    } else if (link.dataset.store === "apple") {
      url.searchParams.set("ct", appleCampaign(source));
    } else if (url.origin === window.location.origin && pages.has(url.pathname)) {
      url.searchParams.set("src", source);
    } else {
      continue;
    }
    link.href = url.href;
  }
}

// YouTube loads only after a visitor selects a trailer. Links work without JavaScript.
document.querySelectorAll("a[data-video]").forEach(link => {
  link.addEventListener("click", event => {
    if(event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const id = link.dataset.video;
    if(!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
    event.preventDefault();
    const frame = document.createElement("iframe");
    frame.className = "video-frame";
    frame.title = link.dataset.title || "Eclipse Relics trailer";
    frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
    frame.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    frame.allowFullscreen = true;
    link.replaceWith(frame);
    frame.focus();
  });
});
