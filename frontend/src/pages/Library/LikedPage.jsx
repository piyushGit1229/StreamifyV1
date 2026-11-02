import { useEffect, useState } from "react";
import { getLikedVideos } from "../../api/likedApi";
import AmbientVideoLink from "../../components/video/AmbientVideoLink";
import { useAuthStore } from "../../store/authStore";
import Skeleton from "../../components/common/Skeleton";
import MediaThumbnail from "../../components/common/MediaThumbnail";
import { useGuestActions } from "../../components/common/guestActionContext";
import {
  FiDownload,
  FiMoreHorizontal,
  FiPlay,
  FiShuffle
} from "react-icons/fi";

export default function LikedVideosPage() {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const { requireAuth } = useGuestActions();

  // Glow effect mouse tracking
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

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      requireAuth();
      return;
    }
    getLikedVideos()
      .then((res) => {
        const raw = res.data;
        const likedVideos = Object.values(raw)
          .filter((item) => item?.videoId)
          .map((item) => item.videoId);
        setLiked(likedVideos);
      })
      .finally(() => setLoading(false));
  }, [initialized, user, requireAuth]);

  if (loading) {
    return (
      <div className="sf-screen sf-collection-screen sf-liked-screen min-h-screen bg-black text-white p-10 flex gap-10">
        <div className="w-[380px] shrink-0 space-y-5">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <div className="flex-1 space-y-6">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} variant="row" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="sf-screen sf-collection-screen sf-liked-screen min-h-screen bg-black text-white p-10 flex gap-10 relative overflow-hidden">

      {/* ========= GLOW BACKGROUND ========= */}
      <BackgroundGlow mouse={mouse} />

      {/* ========= LEFT FIXED PANEL ========= */}
      <div className="sf-library-hero w-[380px] rounded-3xl p-6 bg-gradient-to-b from-[#1c2333] to-black border border-white/10 shadow-2xl sticky top-8 h-fit z-10">

        {/* Thumbnail Preview */}
        <div className="w-full h-48 rounded-xl overflow-hidden mb-6 shadow-lg">
          <MediaThumbnail
            src={liked[0]?.thumbnailUrl}
            title={liked[0]?.title || "Liked videos"}
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        <h2 className="text-3xl font-bold mb-2">Liked videos</h2>

        <p className="text-gray-400 capitalize text-sm">{user?.name}</p>
        <p className="text-gray-500 text-sm mt-1">
          {liked.length} videos • Updated today
        </p>

        {/* Icons */}
        <div className="flex items-center gap-4 mt-8">
          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FiDownload size={22} />
          </button>

          <button className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
            <FiMoreHorizontal size={22} />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 mt-8">
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-300 transition shadow-lg">
            <FiPlay size={20} /> Play All
          </button>

          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 text-white font-semibold hover:bg-white/20 transition shadow-lg">
            <FiShuffle size={20} /> Shuffle
          </button>
        </div>
      </div>

      {/* ========= RIGHT SCROLLABLE LIST ========= */}
      <div className="sf-library-list flex-1 max-h-[calc(100vh-40px)] overflow-y-auto pr-4 relative z-10">

        <div className="space-y-6">
          {liked.length === 0 && (
            <div className="sf-library-empty">
              <h2>No liked videos yet</h2>
              <p>Videos you like will be collected here.</p>
            </div>
          )}
          {liked.map((video, index) => (
            <LikedVideoRow key={video._id} index={index + 1} video={video} />
          ))}
        </div>

        <div className="h-20"></div> {/* padding bottom */}
      </div>
    </div>
  );
}

/* -----------------------------------
      GLOW BACKGROUND COMPONENT
----------------------------------- */
function BackgroundGlow({ mouse }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-[500px] h-[500px] bg-blue-600/20 blur-3xl rounded-full"
        style={{
          top: "12%",
          left: "8%",
          transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)`,
        }}
      />

      <div
        className="absolute w-[420px] h-[420px] bg-purple-600/25 blur-3xl rounded-full"
        style={{
          bottom: "8%",
          right: "10%",
          transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)`,
        }}
      />
    </div>
  );
}

/* -----------------------------------
      VIDEO ROW COMPONENT
----------------------------------- */
function LikedVideoRow({ video, index }) {
  return (
    <AmbientVideoLink
      to={`/watch/${video._id}`}
      video={video}
      className="sf-library-row flex gap-4 group p-3 rounded-xl transition"
    >
      {/* index number */}
      <div className="text-gray-500 w-6 text-right group-hover:text-white">
        {index}
      </div>

      {/* thumbnail */}
      <div className="sf-ambient-thumb relative w-48 h-28 rounded-xl overflow-hidden">
        <MediaThumbnail
          src={video.thumbnailUrl}
          title={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className="absolute bottom-1 right-1 bg-black/80 px-2 py-1 text-xs rounded">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* info */}
      <div className="flex flex-col justify-center">
        <h3 className="font-semibold group-hover:text-blue-400 transition line-clamp-1">
          {video.title}
        </h3>

        <p className="text-gray-400 text-sm">
          {video.owner?.name || "Unknown"}
        </p>

        <p className="text-gray-500 text-xs">{video.views} views</p>
      </div>

      <div className="flex-grow"></div>

      {/* menu */}
      <button className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-white">
        <FiMoreHorizontal size={22} />
      </button>
    </AmbientVideoLink>
  );
}

/* Utility */
function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
