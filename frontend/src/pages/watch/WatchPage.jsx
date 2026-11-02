import { useParams } from "react-router-dom";
import { useWatchPage } from "./hooks/useWatchPage";
import { useAuthStore } from "../../store/authStore";
import VideoPlayerCard from "./components/VideoPlayerCard";
import VideoMetadata from "./components/VideoMetadata";
import ChannelInfo from "./components/ChannelInfo";
import CommentsSection from "./components/CommentsSection";
import RelatedVideos from "./components/RelatedVideos";
import CutCreator from "../../components/cuts/CutCreator";
import SkeletonPage from "./components/SkeletonPage";

export default function WatchPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const {
    video,
    guestVideoUnavailable,
    channel,
    loading,
    relatedVideos,
    comments,
    setComments,
    replies,
    showReplies,
    replyFormVisibility,
    setReplyFormVisibility,
    handleLike,
    handleDislike,
    handleSubscribe,
    handleUnsubscribe,
    handleReply,
    toggleReplies,
    handleViewsIncremented,
  } = useWatchPage(id);

  if (loading) return <SkeletonPage />;
  if (!video) return <div className="sf-screen sf-watch-screen sf-watch-empty text-white p-8">{guestVideoUnavailable ? "This video is not available from public discovery. Open it from Explore or try a public video link again." : "Video not found."}</div>;

  return (
    <div className="sf-screen sf-watch-screen min-h-screen text-white bg-black flex justify-center">
      <div className="sf-watch-layout max-w-[1600px] w-full px-6 py-6 flex gap-6">

        <div className="sf-watch-main flex-1 space-y-6">

          <VideoPlayerCard video={video} onViewsIncremented={handleViewsIncremented} />

          <VideoMetadata
            video={video}
            user={user}
            onLike={handleLike}
            onDislike={handleDislike}
          />

          <ChannelInfo
            video={video}
            channel={channel}
            user={user}
            onSubscribe={handleSubscribe}
            onUnsubscribe={handleUnsubscribe}
          />

          <CutCreator />

          <CommentsSection
            videoId={id}
            comments={comments}
            replies={replies}
            showReplies={showReplies}
            replyFormVisibility={replyFormVisibility}
            setComments={setComments}
            setReplyFormVisibility={setReplyFormVisibility}
            onReply={handleReply}
            onToggleReplies={toggleReplies}
            user={user}
          />

        </div>

        <RelatedVideos relatedVideos={relatedVideos} />
      </div>
    </div>
  );
}
