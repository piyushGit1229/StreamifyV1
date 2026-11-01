import { useEffect, useState } from "react";
import { getHomeFeed } from "../../api/feedApi";
import VideoCard from "../../components/video/VideoCard";
import Skeleton from "../../components/common/Skeleton";

export default function HomePage() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getHomeFeed()
      .then((res) => {
        const { fromsubsrciption, trending, recommended } = res.data;

        // Merge + Remove duplicates by _id
        const all = [...fromsubsrciption, ...trending, ...recommended];

        const unique = Array.from(
          new Map(all.map((v) => [v._id, v])).values()
        );

        setVideos(unique);
      })
      .catch(() => setVideos([]));
  }, []);

  if (videos.length === 0)
    return (
      <div className="sf-content sf-home-grid grid gap-x-6 gap-y-9">
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );

  const featuredVideos = videos.slice(0, 100);

  return (
    <div className="sf-content">
      <div className="sf-home-grid grid gap-x-6 gap-y-9">
        {featuredVideos.map((v) => (
          <VideoCard key={v._id} video={v} />
        ))}
      </div>
    </div>
  );
}
