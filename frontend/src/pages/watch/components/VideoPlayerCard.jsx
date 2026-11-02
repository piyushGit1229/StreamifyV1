import CustomVideoPlayer from "../../../components/video/CustomVideoPlayer";

export default function VideoPlayerCard({ video, onViewsIncremented }) {
  return (
    <div className="sf-player-frame rounded-2xl overflow-hidden shadow-lg">
      {/* ORIGINAL IMPLEMENTATION – PRESERVED FOR REFERENCE
          <CustomVideoPlayer id={video._id} src={`/api/stream/${video._id}`} poster={video.thumbnailUrl} />
      */}
      {/* NEW IMPLEMENTATION – DIRECT CLOUDINARY DELIVERY URL */}
      <CustomVideoPlayer id={video._id} src={video.videoUrl} poster={video.thumbnailUrl} />

    </div>
  );
}
