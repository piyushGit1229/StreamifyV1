const CACHE_PREFIX = "streamify:public-video:";
const CACHE_INDEX = "streamify:public-video-index";
const MAX_CACHED_VIDEOS = 12;

export function cachePublicVideo(video) {
  if (!video?._id || typeof window === "undefined") return;

  try {
    const index = JSON.parse(window.sessionStorage.getItem(CACHE_INDEX) || "[]")
      .filter((id) => id !== video._id);
    index.push(video._id);
    while (index.length > MAX_CACHED_VIDEOS) {
      window.sessionStorage.removeItem(`${CACHE_PREFIX}${index.shift()}`);
    }
    window.sessionStorage.setItem(CACHE_INDEX, JSON.stringify(index));
    window.sessionStorage.setItem(`${CACHE_PREFIX}${video._id}`, JSON.stringify(video));
  } catch {
    // Public playback should still work if browser storage is unavailable.
  }
}

export function getCachedPublicVideo(videoId) {
  if (!videoId || typeof window === "undefined") return null;

  try {
    const video = JSON.parse(window.sessionStorage.getItem(`${CACHE_PREFIX}${videoId}`) || "null");
    return video?._id === videoId ? video : null;
  } catch {
    return null;
  }
}
