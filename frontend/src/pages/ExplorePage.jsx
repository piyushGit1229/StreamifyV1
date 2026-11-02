import { useEffect, useState } from "react";
import { getExploreData } from "../api/exploreApi";
import { Link } from "react-router-dom";
import useAmbientCardColor from "../components/video/useAmbientCardColor";
import Skeleton from "../components/common/Skeleton";
import UserAvatar from "../components/common/UserAvatar";
import MediaThumbnail from "../components/common/MediaThumbnail";
import { cachePublicVideo } from "../api/publicVideoCache";

// React Icons
import {
  FiTrendingUp,
  FiMusic,
  FiCpu,
  FiMonitor,
  FiBookOpen,
  FiClock,
} from "react-icons/fi";

/* ------------------ CATEGORY LIST (NO EMOJIS) ------------------ */
const categories = [
  { key: "trending", label: "Trending", icon: <FiTrendingUp size={16} /> },
  { key: "topMusic", label: "Music", icon: <FiMusic size={16} /> },
  { key: "tech", label: "Tech", icon: <FiCpu size={16} /> },
  { key: "gaming", label: "Gaming", icon: <FiMonitor size={16} /> },
  { key: "education", label: "Education", icon: <FiBookOpen size={16} /> },
  { key: "recent", label: "Recent Uploads", icon: <FiClock size={16} /> },
];

const formatDuration = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default function ExplorePage() {
  const [data, setData] = useState({});
  const [selected, setSelected] = useState("trending");
  const [loading, setLoading] = useState(true);

  // 🔵 Blue Glow Parallax
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
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

  // Fetch Explore API
  useEffect(() => {
    getExploreData()
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  const videos = data[selected] || [];

  return (
    <div
      className="sf-screen sf-explore-screen sf-discovery-screen"
      style={{ "--sf-pointer-x": `${mouse.x}px`, "--sf-pointer-y": `${mouse.y}px` }}
    >
      <div className="sf-discovery-content">
        <header className="sf-page-heading-row sf-discovery-heading">
          <div>
            <span className="sf-eyebrow">FIND YOUR NEXT FAVORITE</span>
            <h1 className="sf-page-title">Explore</h1>
            <p>Fresh creators, new interests, and videos worth your time.</p>
          </div>
        </header>

        <div className="sf-category-rail" role="tablist" aria-label="Explore categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelected(cat.key)}
              role="tab"
              aria-selected={selected === cat.key}
              className={`sf-category-chip ${selected === cat.key ? "is-selected" : ""}`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="sf-video-grid sf-explore-grid">
            {Array.from({ length: 8 }, (_, index) => (
              <Skeleton key={index} variant="card" />
            ))}
          </div>
        )}

        <div className="sf-video-grid sf-explore-grid">
          {!loading && videos.map((v) => (
            <ExploreCard key={v._id} video={v} />
          ))}

          {!videos.length && !loading && (
            <p className="sf-empty-state">
              No videos found in this category.
            </p>
          )}
        </div>

        <PopularChannels channels={data.popularChannels || []} />
      </div>
    </div>
  );
}

/* ------------------ VIDEO CARD ------------------ */
function ExploreCard({ video }) {
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(video.thumbnailUrl);

  return (
    <Link
      to={`/watch/${video._id}`}
      state={{ video }}
      onClick={() => cachePublicVideo(video)}
      onPointerEnter={loadAmbientColor}
      onFocus={loadAmbientColor}
      style={{ "--sf-card-ambient": ambientColor }}
      className="sf-video-card sf-explore-card group"
    >
      <div className="sf-video-thumb">
        <MediaThumbnail src={video.thumbnailUrl} alt={video.title} title={video.title} loading="lazy" />
        <span className="sf-video-duration">{formatDuration(video.duration)}</span>
      </div>

      <div className="sf-video-info">
        <UserAvatar className="sf-video-avatar" src={video.owner?.avatar} name={video.owner?.name || "Creator"} alt="" />
        <div className="sf-video-copy">
          <p className="sf-video-title">{video.title}</p>
          <p className="sf-video-channel">{video.owner?.name}</p>
          <p className="sf-video-meta">{video.views || 0} views</p>
        </div>
      </div>
    </Link>
  );
}

/* ------------------ POPULAR CHANNELS ------------------ */
function PopularChannels({ channels }) {
  if (!channels.length) return null;

  return (
    <section className="sf-popular-channels">
      <div className="sf-section-heading">
        <div><span className="sf-eyebrow">CREATORS TO KNOW</span><h2>Popular channels</h2></div>
      </div>

      <div className="sf-channel-grid">
        {channels.map((ch) => (
          <Link
            key={ch._id}
            to={`/channel/${ch._id}`}
            className="sf-channel-card"
          >
            <UserAvatar src={ch.avatar} name={ch.name} className="sf-channel-avatar" />
            <p className="sf-channel-name">{ch.name}</p>
            <span className="sf-channel-meta">
              {ch.subscribersCount || 0} subs
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
