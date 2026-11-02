import { FiThumbsUp, FiThumbsDown, FiShare2 } from "react-icons/fi";
import AddToPlaylist from "../../../components/common/AddToPlaylist";
import WatchPartyButton from "../../../components/watchParty/WatchPartyButton";
import { useGuestActions } from "../../../components/common/guestActionContext";

const VideoActions = ({ video, user, onLike, onDislike }) => {
  const { requireAuth } = useGuestActions();
  const isLiked = Boolean(user && video.isLiked);
  const isDisliked = Boolean(user && video.isDisliked);

  return (
    <div className="sf-video-actions flex items-center gap-2">
      {/* LIKE/DISLIKE CONTAINER */}
      <div className="flex items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-full shadow-lg overflow-hidden">
        <button
          onClick={() => { if (requireAuth()) onLike(); }}
          className={`sf-action-button sf-action-like flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                                  ${isLiked
                                    ? "is-active text-blue-400 hover:bg-blue-500/10"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }`}
        >
          <FiThumbsUp
            size={18}
            className={`transition-all duration-200 ${
              isLiked ? "fill-current text-blue-400" : "group-hover:scale-110"
            }`}
          />
          <span className="font-semibold">{video.likesCount?.toLocaleString() || 0}</span>
        </button>

        <div className="w-px h-5 bg-white/20"></div>

        <button
          onClick={() => { if (requireAuth()) onDislike(); }}
          className={`sf-action-button sf-action-dislike flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 group
                                  ${isDisliked
                                    ? "is-active text-red-400 hover:bg-red-500/10"
                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                  }`}
        >
          <FiThumbsDown
            size={18}
            className={`transition-all duration-200 ${
              isDisliked ? "fill-current text-red-400" : "group-hover:scale-110"
            }`}
          />
        </button>
      </div>

      {/* SHARE BUTTON */}
      <button
        onClick={() => navigator.share?.({ url: window.location.href, title: video.title })}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border border-white/10 shadow-lg backdrop-blur-sm bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 group"
      >
        <FiShare2
          size={18}
          className="transition-all duration-200 group-hover:scale-110"
        />
        <span className="font-medium">Share</span>
      </button>

      {/* ADD TO PLAYLIST BUTTON */}
      <AddToPlaylist videoId={video._id} />

      {/* WATCH PARTY BUTTON */}
      <WatchPartyButton videoId={video._id} />
    </div>
  );
};

export default VideoActions;
