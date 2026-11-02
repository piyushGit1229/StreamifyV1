import { Link } from "react-router-dom";
import { FiPlay } from "react-icons/fi";
import useAmbientCardColor from "./useAmbientCardColor";
import UserAvatar from "../common/UserAvatar";
import MediaThumbnail from "../common/MediaThumbnail";
import { cachePublicVideo } from "../../api/publicVideoCache";

export default function VideoCard({ video }) {
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(video.thumbnailUrl);

  return (
    <Link
      to={`/watch/${video._id}`}
      state={{ video }}
      onClick={() => cachePublicVideo(video)}
      onPointerEnter={loadAmbientColor}
      onFocus={loadAmbientColor}
      style={{ "--sf-card-ambient": ambientColor }}
      className="sf-video-card group"
    >
      <div className="sf-video-thumb">
        <MediaThumbnail src={video.thumbnailUrl} alt={video.title} title={video.title} loading="lazy" />
        <span className="sf-video-duration">{formatDuration(video.duration)}</span>
        <span className="sf-video-play" aria-hidden="true"><FiPlay size={18} fill="currentColor" /></span>
      </div>

      <div className="sf-video-info">
        <UserAvatar src={video.owner?.avatar} name={video.owner?.name || "Creator"} alt="" className="sf-video-avatar" />
        <div className="sf-video-copy">
          <p className="sf-video-title">{video.title}</p>
          <p className="sf-video-channel">{video.owner?.name}</p>
          <p className="sf-video-meta">{video.views || 0} views <span aria-hidden="true">·</span> {timeAgo(video.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}

function formatDuration(sec) {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function timeAgo(date) {
  if (!date) return "";
  const diff = (Date.now() - new Date(date)) / 1000;
  const days = diff / 86400;

  if (days < 1) return "Today";
  if (days < 7) return `${Math.floor(days)} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}
