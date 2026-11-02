import UserAvatar from "../../../../components/common/UserAvatar";

export default function CommentAvatar({ user, size = "w-8 h-8" }) {
  const avatarUrl = user?.avatar || user?.profilePicture;

  return <UserAvatar src={avatarUrl} name={user?.name || "User"} className={`${size} rounded-full`} alt={user?.name || "User"} />;
}
