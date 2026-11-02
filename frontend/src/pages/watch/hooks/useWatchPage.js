import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getPublicTrendingVideos, getRelatedVideos, getVideo } from "../../../api/videoApi";
import { getExploreData } from "../../../api/exploreApi";
import { getCachedPublicVideo, cachePublicVideo } from "../../../api/publicVideoCache";
import { getHomeFeed } from "../../../api/feedApi";
import { channelPage } from "../../../api/subscriptionApi";
import { getComments } from "../../../api/commentApi";
import { useComments } from "./useComments";
import { useVideoActions } from "./useVideoActions";
import { useChannelSubscription } from "./useChannelSubscription";
import { useAuthStore } from "../../../store/authStore";

export function useWatchPage(id) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guestVideoUnavailable, setGuestVideoUnavailable] = useState(false);

  const {
    comments,
    setComments,
    replies,
    showReplies,
    replyFormVisibility,
    setReplyFormVisibility,
    handleReply,
    toggleReplies
  } = useComments(id);

  const { handleLike, handleDislike } = useVideoActions(video, setVideo);
  const { handleSubscribe, handleUnsubscribe } =
    useChannelSubscription(video, channel, setChannel, setVideo);

  // -----------------------------
  // FETCH VIDEO + CHANNEL + FEED
  // -----------------------------
  useEffect(() => {
    if (!initialized) return;

    async function fetchData() {
      setLoading(true);
      setGuestVideoUnavailable(false);
      try {
        if (!user) {
          let publicVideo = location.state?.video?._id === id ? location.state.video : getCachedPublicVideo(id);

          if (!publicVideo) {
            // Guest detail endpoints are protected; resolve from existing public discovery endpoints.
            const [exploreResult, trendingResult] = await Promise.allSettled([
              getExploreData(),
              getPublicTrendingVideos(),
            ]);
            const exploreData = exploreResult.status === "fulfilled" ? exploreResult.value.data?.data || {} : {};
            const exploreVideos = Object.values(exploreData)
              .filter(Array.isArray)
              .flat();
            const trendingVideos = trendingResult.status === "fulfilled" ? trendingResult.value.data?.videos || [] : [];
            publicVideo = [...exploreVideos, ...trendingVideos].find((candidate) => candidate?._id === id) || null;
          }

          if (!publicVideo) {
            setGuestVideoUnavailable(true);
            setVideo(null);
            setRelatedVideos([]);
            setComments([]);
            return;
          }

          cachePublicVideo(publicVideo);
          setVideo({ ...publicVideo, isLiked: false, isDisliked: false, isSubscribed: false });
          setChannel(publicVideo.owner ? { channel: publicVideo.owner, isSubscribed: false } : null);

          const [commentsResult, relatedResult] = await Promise.allSettled([
            getComments(id),
            getRelatedVideos(id),
          ]);
          setComments(commentsResult.status === "fulfilled" ? commentsResult.value.data?.comments || [] : []);
          setRelatedVideos(relatedResult.status === "fulfilled" ? relatedResult.value.data?.videos || [] : []);
          return;
        }

        // ⭐ INCREMENT VIEW COUNT EXACTLY ONCE
        const res = await getVideo(id, true);
        cachePublicVideo(res.data.video);
        setVideo(res.data.video);

        // CHANNEL INFO
        const channelRes = await channelPage(res.data.video.owner._id);
        setChannel(channelRes.data);

        // COMMENTS
        const commentsRes = await getComments(id);
        setComments(commentsRes.data.comments);

        // FEED (RELATED VIDEOS)
        const feedRes = await getHomeFeed();

        let allVideos = [];

        const sub = Array.isArray(feedRes.data?.fromsubscription)
          ? feedRes.data.fromsubscription
          : [];

        const trending = Array.isArray(feedRes.data?.trending)
          ? feedRes.data.trending
          : [];

        const recommended = Array.isArray(feedRes.data?.recommended)
          ? feedRes.data.recommended
          : [];

        allVideos = [...sub, ...trending, ...recommended];

        

        const filtered = allVideos.filter((v) => v._id !== id);

        setRelatedVideos(filtered);
      } catch (error) {
        console.error("WATCH ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, initialized, user, location.state?.video, setComments]);

  // -----------------------------
  // RETURN VALUES FOR WATCH PAGE
  // -----------------------------
  return {
    video,
    guestVideoUnavailable,
    channel,
    relatedVideos,
    loading,

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
  };
}
