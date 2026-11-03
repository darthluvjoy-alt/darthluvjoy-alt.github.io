"use strict";
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
