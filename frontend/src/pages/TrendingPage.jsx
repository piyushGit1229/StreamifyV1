import { useEffect, useState } from "react";
import { getHomeFeed } from "../api/feedApi";
import { getPublicTrendingVideos } from "../api/videoApi";
import { useAuthStore } from "../store/authStore";
import Skeleton from "../components/common/Skeleton";
import AmbientVideoLink from "../components/video/AmbientVideoLink";
import useAmbientCardColor from "../components/video/useAmbientCardColor";
import MediaThumbnail from "../components/common/MediaThumbnail";

export default function TrendingPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(videos[0]?.thumbnailUrl);

  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 12,
        y: (e.clientY / window.innerHeight - 0.5) * 12,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const loadTrending = user ? getHomeFeed().then((res) => res.data?.trending || [])
      : getPublicTrendingVideos().then((res) => res.data?.videos || []);

    loadTrending
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, [initialized, user]);

  if (loading) {
    return (
      <div className="sf-screen sf-trending-screen">
        <header className="sf-page-heading-row sf-discovery-heading">
          <div><span className="sf-eyebrow">WHAT'S MOVING</span><Skeleton className="h-10 w-64 mt-3" /><Skeleton className="h-5 w-80 max-w-full mt-3" /></div>
        </header>
        <div className="sf-trending-layout">
          <Skeleton className="w-full aspect-video rounded-2xl" />
          <div className="sf-trending-list">
            {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} variant="row" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!videos.length) {
    return (
      <div className="sf-screen sf-trending-screen">
        <header className="sf-page-heading-row sf-discovery-heading">
          <div><span className="sf-eyebrow">WHAT'S MOVING</span><h1 className="sf-page-title">Trending now</h1></div>
        </header>
        <div className="sf-empty-state sf-empty-panel">
          <span className="sf-empty-mark" aria-hidden="true">↗</span>
          <h2>No trending videos yet</h2>
          <p>Check back later for videos gaining attention.</p>
        </div>
      </div>
    );
  }

  const featured = videos[0];

  return (
    <div
      className="sf-screen sf-trending-screen"
      style={{ "--sf-pointer-x": `${mouse.x}px`, "--sf-pointer-y": `${mouse.y}px` }}
    >
      <header className="sf-page-heading-row sf-discovery-heading">
        <div>
          <span className="sf-eyebrow">WHAT'S MOVING</span>
          <h1 className="sf-page-title">Trending now</h1>
          <p>The videos finding an audience across Streamify.</p>
        </div>
      </header>

      <div className="sf-trending-layout">
        <div
          onPointerEnter={loadAmbientColor}
          className="sf-trending-feature"
          style={{ "--sf-card-ambient": ambientColor }}
        >
          <MediaThumbnail src={featured.thumbnailUrl} alt={featured.title} title={featured.title} loading="lazy" />
          <span className="sf-feature-kicker">FEATURED TREND</span>
          <div className="sf-trending-feature-copy">
            <span className="sf-feature-rank">#1 today</span>
            <h2>{featured.title}</h2>
            <p>{featured.owner?.name}</p>
          </div>
        </div>

        <div className="sf-trending-list">
          <div className="sf-section-heading">
            <div><span className="sf-eyebrow">POPULAR RIGHT NOW</span><h2>Top videos</h2></div>
          </div>
          <div className="sf-trending-items">
            {videos.map((video, index) => (
              <AmbientVideoLink
                to={`/watch/${video._id}`}
                video={video}
                key={video._id}
                className="sf-trending-item"
              >
                <span className="sf-trending-rank">{String(index + 1).padStart(2, "0")}</span>
                <div className="sf-trending-thumb">
                  <MediaThumbnail src={video.thumbnailUrl} alt={video.title} title={video.title} loading="lazy" />
                </div>
                <div className="sf-trending-copy">
                  <h3>{video.title}</h3>
                  <p>{video.owner?.name}</p>
                  <span>{video.views} views · {new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </AmbientVideoLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
