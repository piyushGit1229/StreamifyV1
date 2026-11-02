import { Link } from "react-router-dom";
import useAmbientCardColor from "./useAmbientCardColor";
import MediaThumbnail from "../common/MediaThumbnail";
import { cachePublicVideo } from "../../api/publicVideoCache";

export default function VideoCardRow({ video }) {
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(video.thumbnailUrl);

  return (
    <Link
      to={`/watch/${video._id}`}
      state={{ video }}
      onClick={() => cachePublicVideo(video)}
      onPointerEnter={loadAmbientColor}
      onFocus={loadAmbientColor}
      style={{ "--sf-card-ambient": ambientColor }}
      className="sf-ambient-card flex gap-4 w-full transition-all p-3 rounded-xl"
    >
      {/* Thumbnail */}
      <div className="sf-ambient-thumb w-80 h-44 bg-black rounded-xl overflow-hidden flex-shrink-0">
        <MediaThumbnail
          src={video.thumbnailUrl}
          alt={video.title}
          title={video.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side info */}
      <div className="flex flex-col justify-start">
        {/* Title */}
        <h2 className="text-xl font-semibold text-white mb-1">
          {video.title}
        </h2>

        {/* Channel + views */}
        <p className="text-gray-400 text-sm mb-4">
          {video.owner.name} • {video.views || 0} views • {video.timeAgo}
        </p>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 max-w-2xl">
          {video.description || "No description available."}
        </p>
      </div>
    </Link>
  );
}
