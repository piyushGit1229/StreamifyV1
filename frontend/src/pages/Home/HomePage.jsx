import { useEffect, useState } from "react";
import { getHomeFeed } from "../../api/feedApi";
import { getExploreData } from "../../api/exploreApi";
import { useAuthStore } from "../../store/authStore";
import VideoCard from "../../components/video/VideoCard";
import Skeleton from "../../components/common/Skeleton";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);

  useEffect(() => {
    if (!initialized) return;

    const loadFeed = async () => {
      setLoading(true);
      try {
        if (user) {
          const res = await getHomeFeed();
          const { fromsubsrciption = [], trending = [], recommended = [] } = res.data;
          const all = [...fromsubsrciption, ...trending, ...recommended];
          setVideos(Array.from(new Map(all.map((video) => [video._id, video])).values()));
        } else {
          // /feed/home requires authentication; /explore is the existing public discovery endpoint.
          const res = await getExploreData();
          const data = res.data?.data || {};
          const publicVideos = [data.trending, data.topMusic, data.tech, data.gaming, data.education, data.recent]
            .flatMap((items) => Array.isArray(items) ? items : []);
          setVideos(Array.from(new Map(publicVideos.map((video) => [video._id, video])).values()));
        }
      } catch {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [initialized, user]);

  if (loading)
    return (
      <div className="sf-content sf-home-page">
        <div className="sf-page-heading-row">
          <div>
            <span className="sf-eyebrow">STREAMIFY · YOUR FEED</span>
            <h1 className="sf-page-title">Discover something worth watching.</h1>
          </div>
        </div>
        <div className="sf-home-grid">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    );

  if (videos.length === 0) return (
    <div className="sf-content sf-home-page">
      <div className="sf-page-heading-row"><div><span className="sf-eyebrow">STREAMIFY · YOUR FEED</span><h1 className="sf-page-title">Discover something worth watching.</h1></div></div>
      <p className="sf-empty-state">No videos are available right now. Please try again shortly.</p>
    </div>
  );

  const featuredVideos = videos.slice(0, 100);

  return (
    <div className="sf-content sf-home-page">
      <div className="sf-page-heading-row">
        <div>
          <span className="sf-eyebrow">STREAMIFY · YOUR FEED</span>
          <h1 className="sf-page-title">Discover something worth watching.</h1>
        </div>
      </div>
      <div className="sf-home-grid">
        {featuredVideos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
}
