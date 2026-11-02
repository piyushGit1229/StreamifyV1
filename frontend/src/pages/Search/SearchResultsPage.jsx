import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchVideos } from "../../api/videoApi";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/sidebar/Sidebar";
import VideoCardRow from "../../components/video/VideoCardRow";
import Skeleton from "../../components/common/Skeleton";

export default function SearchResultsPage() {
  const [queryParams] = useSearchParams();
  const query = queryParams.get("q");

  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!query) return;

      setLoading(true);
      try {
        const res = await searchVideos(query, 1, 20);
        setVideos(res.data.data || []);
      } catch (e) {
        console.error("Search error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [query]);

  return (
    <div className="sf-screen sf-search-screen min-h-screen bg-[#0d0d0f] text-white flex">

      {/* SIDEBAR — FIXED WIDTH */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="sf-search-main flex flex-col w-full ml-70">
        {/* ml-64 = 256px margin-left → prevents overlap */}

        <Navbar />

        <div className="px-12 py-8 max-w-6xl w-full">

          <h1 className="text-2xl font-semibold mb-6">
            Results for: <span className="text-blue-400">"{query}"</span>
          </h1>

          {loading && (
            <div className="flex flex-col gap-6 mt-8" aria-label="Loading search results">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} variant="row" />
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <p className="text-gray-500 text-lg mt-10">No videos found.</p>
          )}

          {!loading && (
            <div className="flex flex-col gap-6">
              {videos.map((video) => (
                <VideoCardRow key={video._id} video={video} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
