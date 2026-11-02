import { Link } from "react-router-dom";
import Button from "../../../components/common/Button";
import UserAvatar from "../../../components/common/UserAvatar";
import { useGuestActions } from "../../../components/common/guestActionContext";

export default function ChannelInfo({ video, channel, user, onSubscribe, onUnsubscribe }) {
  const { requireAuth } = useGuestActions();
  if (!channel) return null;

  const subscribed = Boolean(user && channel.isSubscribed);

  return (
    <div className="sf-watch-channel p-4 bg-[#111118] rounded-2xl border border-white/5 flex items-start gap-4">
      <Link to={`/channel/${video.owner._id}`} className="flex-shrink-0">
        <UserAvatar
          src={channel.channel.avatar}
          name={channel.channel.name}
          className="w-12 h-12 rounded-full hover:opacity-80 transition-opacity cursor-pointer"
        />
      </Link>

      <div className="flex-1">
        <Link to={`/channel/${video.owner._id}`}>
          <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors cursor-pointer">
            {channel.channel.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-sm">
          {channel.channel.subscribersCount?.toLocaleString()} subscribers
        </p>
      </div>

      <Button
        variant={subscribed ? "secondary" : "primary"}
        className={`sf-subscribe-button ${subscribed ? "is-subscribed" : "is-unsubscribed"}`}
        onClick={() => { if (requireAuth()) (subscribed ? onUnsubscribe : onSubscribe)(); }}
      >
        {subscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </div>
  );
}
