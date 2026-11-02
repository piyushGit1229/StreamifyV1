import { useEffect, useState } from "react";
import { getMyPlaylists, createPlaylist } from "../../api/playlistApi";
import { Link } from "react-router-dom";
import MediaThumbnail from "../../components/common/MediaThumbnail";
import { useGuestActions } from "../../components/common/guestActionContext";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const { requireAuth } = useGuestActions();

  useEffect(() => {
    if (!requireAuth()) return;
    getMyPlaylists().then((res) => setPlaylists(res.data.playlists || []));
  }, [requireAuth]);

  const handleCreate = async () => {
    if (!requireAuth()) return;
    if (!newName.trim()) return;
    const res = await createPlaylist({ name: newName });
    setPlaylists((prev) => [res.data.playlist, ...prev]);
    setShowModal(false);
    setNewName("");
  };

  return (
    <div className="sf-screen sf-collection-screen sf-playlists-screen min-h-screen bg-black text-white relative overflow-hidden">

      {/* ---------- BACKGROUND GLOW ORBS ---------- */}
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-blue-600/20 blur-[120px]"></div>
      <div className="absolute top-40 right-0 w-[350px] h-[350px] rounded-full bg-purple-600/20 blur-[140px]"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[160px]"></div>

      <div className="relative z-10 px-10 py-10">

        {/* -------------------------------- HEADER -------------------------------- */}
        <div className="sf-library-heading flex justify-between items-center mb-12">
          <div className="sf-library-heading-copy">
            <span className="sf-library-eyebrow">YOUR VIDEO COLLECTIONS</span>
            <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">Playlists</h1>
            <p>Keep your favorite videos organized for the next watch.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="sf-library-primary-action px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700
                       text-sm font-semibold shadow-lg shadow-blue-500/20
                       transition-all scale-100 hover:scale-[1.03]"
          >
            + New Playlist
          </button>
        </div>

        {/* -------------------------- EMPTY STATE -------------------------- */}
        {playlists.length === 0 && (
          <div className="sf-library-empty sf-playlist-empty mt-20">
            <h2 className="text-2xl font-semibold mb-2">No playlists yet</h2>
            <p className="text-gray-400 mb-6">Create your first playlist now.</p>

            <button
              onClick={() => setShowModal(true)}
              className="sf-library-primary-action px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700
                         text-sm font-semibold shadow-lg shadow-blue-500/20
                         transition"
            >
              Create Playlist
            </button>
          </div>
        )}

        {/* -------------------------- PLAYLIST GRID -------------------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {playlists.map((p) => {
            // Pick thumbnail of latest video
            const latestThumb =
              p.videos.length > 0
                ? p.videos[p.videos.length - 1].thumbnailUrl
                : null;

            return (
              <Link
                to={`/playlist/${p._id}`}
                key={p._id}
                className="sf-playlist-card relative group bg-[#0c0c0f]/60 backdrop-blur-xl
                           border border-white/10 rounded-2xl p-4
                           shadow-[0_8px_30px_rgb(0,0,0,0.3)]
                           transition-all hover:border-white/20
                           hover:shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
              >
                {/* THUMBNAIL */}
                <div className="sf-playlist-thumb w-full h-48 rounded-xl overflow-hidden mb-4 bg-[#1a1a1a]">
                  <MediaThumbnail
                    src={latestThumb}
                    title={p.name}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* PLAYLIST INFO */}
                <h3 className="text-xl font-semibold group-hover:text-blue-400 transition">
                  {p.name}
                </h3>

                <p className="text-gray-400 text-sm mt-1">
                  {p.videos.length} videos
                </p>

                <p className="text-blue-500 mt-3 text-sm group-hover:underline">
                  View playlist →
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* -------------------------- CREATE PLAYLIST MODAL -------------------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md
                        flex justify-center items-center z-50">
          <div className="bg-[#0d0d12] w-[380px] p-7 rounded-2xl
                          border border-white/10 shadow-2xl">

            <h2 className="text-2xl font-bold mb-5">Create Playlist</h2>

            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Playlist name"
            className="sf-playlist-input w-full p-3 rounded-xl bg-black border border-white/20
                         focus:border-blue-500 outline-none text-white mb-6
                         transition"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="sf-modal-secondary flex-1 py-2.5 rounded-xl bg-white/10
                           hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleCreate}
                className="sf-library-primary-action flex-1 py-2.5 rounded-xl bg-blue-600
                           hover:bg-blue-700 transition font-semibold"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
