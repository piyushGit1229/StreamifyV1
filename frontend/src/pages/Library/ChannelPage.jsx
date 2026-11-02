import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AmbientVideoLink from "../../components/video/AmbientVideoLink";
import Skeleton from "../../components/common/Skeleton";
import UserAvatar from "../../components/common/UserAvatar";
import MediaThumbnail from "../../components/common/MediaThumbnail";
import { useAuthStore } from "../../store/authStore";
import { useGuestActions } from "../../components/common/guestActionContext";
import { axiosInstance } from "../../api/axiosInstance";
import { FiEye, FiVideo, FiCalendar, FiUserPlus, FiCheckCircle } from "react-icons/fi";

export default function ChannelPage() {
  const { channelId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const { requireAuth } = useGuestActions();

  useEffect(() => {
    async function fetchChannel() {
      try {
        const res = await axiosInstance.get(`/subscriptions/channel/${channelId}`);
        setData(res.data);
      } catch (err) {
        console.error("CHANNEL ERROR:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchChannel();
  }, [channelId]);

  if (loading) {
    return (
      <div className="sf-screen sf-channel-screen sf-channel-page">
        <Skeleton className="sf-channel-banner-skeleton" />
        <div className="sf-channel-content">
          <div className="sf-channel-profile-skeleton">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3"><Skeleton className="h-7 w-56" /><Skeleton className="h-4 w-36" /></div>
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="sf-channel-video-grid">
            {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} variant="card" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="sf-screen sf-channel-screen sf-channel-page">
        <div className="sf-channel-content">
          <div className="sf-channel-empty-state">
            <span className="sf-channel-empty-mark"><FiVideo aria-hidden="true" /></span>
            <h1>Channel unavailable</h1>
            <p>This creator page could not be loaded. Try again in a moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const { channel, videos, stats } = data;
  const subscribersCount = stats.subscribersCount || 0;
  const totalVideos = stats.totalVideos || 0;
  const totalViews = stats.totalViews || 0;

  return (
    <div className="sf-screen sf-channel-screen sf-channel-page">
      <header className="sf-channel-banner">
        {channel.channelBanner ? (
          <img src={channel.channelBanner} alt={`${channel.name} channel banner`} />
        ) : (
          <div className="sf-channel-banner-placeholder"><span>{channel.name}</span></div>
        )}
        <div className="sf-channel-banner-shade" />
        <span className="sf-channel-banner-label">CREATOR CHANNEL</span>
      </header>

      <div className="sf-channel-content">
        <section className="sf-channel-profile">
          <div className="sf-channel-identity">
            <UserAvatar src={channel.avatar} name={channel.name} className="sf-channel-profile-avatar" />
            <div className="sf-channel-profile-copy">
              <span className="sf-channel-eyebrow">STREAMIFY CREATOR</span>
              <h1>{channel.name}</h1>
              {channel.email && <p>{channel.email}</p>}
              <div className="sf-channel-quick-stats">
                <span>{subscribersCount.toLocaleString()} subscribers</span>
                <i aria-hidden="true" />
                <span>{totalVideos} videos</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => { if (!requireAuth()) return; }}
            className={`sf-channel-subscribe ${user && channel.isSubscribed ? "is-subscribed" : ""}`}
          >
            {user && channel.isSubscribed ? <><FiCheckCircle aria-hidden="true" /> Subscribed</> : <><FiUserPlus aria-hidden="true" /> Subscribe</>}
          </button>
        </section>

        <section className="sf-channel-stats" aria-label="Channel information">
          <div className="sf-channel-stat">
            <span className="sf-channel-stat-icon"><FiCalendar aria-hidden="true" /></span>
            <span><small>CREATOR SINCE</small><strong>{new Date(channel.createdAt).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</strong></span>
          </div>
          <div className="sf-channel-stat">
            <span className="sf-channel-stat-icon"><FiEye aria-hidden="true" /></span>
            <span><small>TOTAL CHANNEL VIEWS</small><strong>{totalViews.toLocaleString()}</strong></span>
          </div>
          <div className="sf-channel-stat">
            <span className="sf-channel-stat-icon"><FiVideo aria-hidden="true" /></span>
            <span><small>VIDEOS</small><strong>{totalVideos}</strong></span>
          </div>
        </section>

        <section className="sf-channel-videos">
          <div className="sf-channel-videos-heading">
            <div><span className="sf-channel-eyebrow">FROM THIS CREATOR</span><h2>Videos</h2></div>
            <span className="sf-channel-video-count">{totalVideos} {totalVideos === 1 ? "video" : "videos"}</span>
          </div>

          {!videos?.length ? (
            <div className="sf-channel-empty-state sf-channel-no-videos">
              <span className="sf-channel-empty-mark"><FiVideo aria-hidden="true" /></span>
              <h3>No videos yet</h3>
              <p>New uploads from {channel.name} will appear here.</p>
            </div>
          ) : (
            <div className="sf-channel-video-grid">
              {videos.map((video) => (
                <AmbientVideoLink to={`/watch/${video._id}`} video={video} key={video._id} className="sf-channel-video-card">
                  <div className="sf-channel-video-thumb">
                    <MediaThumbnail src={video.thumbnailUrl} title={video.title} className="sf-channel-video-image" />
                    <span className="sf-channel-duration">{formatDuration(video.duration)}</span>
                  </div>
                  <div className="sf-channel-video-copy">
                    <h3>{video.title}</h3>
                    <p>{(video.views || 0).toLocaleString()} views <span aria-hidden="true">·</span> {video.uploadedAgo || "Recently"}</p>
                  </div>
                </AmbientVideoLink>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function formatDuration(sec) {
  if (!sec) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
