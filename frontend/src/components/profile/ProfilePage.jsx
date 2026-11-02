import { useEffect, useState } from "react";
import { useProfileStore } from "../../store/profileStore";
import Skeleton from "../common/Skeleton";
import { FiAlignLeft, FiCamera, FiCheck, FiImage, FiSave, FiUser } from "react-icons/fi";
import UserAvatar from "../common/UserAvatar";

export default function ProfilePage() {
  const { user, loading, fetchProfile, updateInfo, changeAvatar, changeBanner } =
    useProfileStore();

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setDesc(user.channelDescription || "");
    }
  }, [user]);

  if (loading || !user)
    return (
      <div className="sf-screen sf-profile-screen text-white min-h-screen p-8">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <div className="max-w-5xl mx-auto -mt-12 relative rounded-2xl border border-white/5 bg-[#111318] p-6 space-y-7">
          <div className="flex items-center gap-5">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-7 w-52" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    );

  // Convert file → Base64
  const toBase64 = (file, cb) => {
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toBase64(file, async (base64) => {
      setAvatarPreview(base64);
      await changeAvatar(base64);
    });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toBase64(file, async (base64) => {
      setBannerPreview(base64);
      await changeBanner(base64);
    });
  };

  const handleSave = async () => {
    await updateInfo({ name, channelDescription: desc });
    alert("Profile updated!");
  };

  return (
    <div className="sf-screen sf-profile-screen min-h-screen bg-black text-white px-6 py-10 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* BANNER */}
        <div className="sf-profile-banner relative w-full h-64 rounded-2xl overflow-hidden group shadow-xl">
          {bannerPreview || user.channelBanner ? (
            <img
              src={bannerPreview || user.channelBanner}
              alt=""
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="sf-profile-banner-placeholder" aria-hidden="true">
              <FiImage />
              <span>Your channel banner will appear here</span>
            </div>
          )}

          <label className="sf-profile-image-action absolute bottom-4 right-4 px-4 py-2 bg-white/10 border border-white/20 rounded-xl cursor-pointer backdrop-blur-xl hover:bg-white/20 transition text-sm font-medium">
            <FiCamera aria-hidden="true" /> Change banner
            <input type="file" className="hidden" onChange={handleBannerChange} />
          </label>

          {/* Gradient for readability */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div> */}
        </div>

        {/* AVATAR + NAME */}
        <div className="sf-profile-identity flex items-center gap-8 mt-6">
          <div className="sf-profile-avatar-wrap relative w-32 h-32">
            <UserAvatar
              src={avatarPreview || user.avatar}
              name={user.name}
              className="sf-profile-avatar-image w-32 h-32 rounded-full object-cover border-4 border-black shadow-xl"
            />

            <label className="sf-profile-image-action sf-profile-avatar-action absolute bottom-1 right-1 px-3 py-1 bg-white/10 border border-white/20 rounded-xl cursor-pointer backdrop-blur-xl text-xs hover:bg-white/20 transition">
              <FiCamera aria-hidden="true" /> Edit photo
              <input type="file" className="hidden" onChange={handleAvatarChange} />
            </label>
          </div>

          <div className="sf-profile-identity-copy">
            <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
            <p className="text-gray-400 mt-1 text-sm">{user.email}</p>
            <p className="text-gray-500 text-sm mt-1">
              {user.subscribersCount} subscribers
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="sf-profile-edit mt-10 bg-[#0f0f0f] p-8 rounded-2xl border border-white/10 shadow-xl max-w-2xl">
          <div className="sf-profile-edit-heading">
            <span className="sf-profile-edit-mark" aria-hidden="true"><FiUser /></span>
            <div>
              <span className="sf-profile-edit-eyebrow">CHANNEL SETTINGS</span>
              <h2>Edit channel details</h2>
              <p>Shape how your channel appears to the Streamify community.</p>
            </div>
            <span className="sf-profile-edit-status"><FiCheck aria-hidden="true" /> Your channel</span>
          </div>

          <div className="sf-profile-edit-fields">
            <div className="sf-profile-edit-field">
              <label htmlFor="profile-display-name"><FiUser aria-hidden="true" /> Display name</label>
              <input
                id="profile-display-name"
                autoComplete="name"
                placeholder="Your name"
                className="sf-profile-control w-full p-3 mt-2 bg-black border border-white/20 rounded-xl focus:outline-none focus:border-blue-600 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <small>This is the name viewers will see on your channel.</small>
            </div>

            <div className="sf-profile-edit-field">
              <label htmlFor="profile-channel-description"><FiAlignLeft aria-hidden="true" /> Channel description</label>
              <textarea
                id="profile-channel-description"
                placeholder="Tell viewers what your channel is about..."
                className="sf-profile-control sf-profile-description-control w-full p-3 mt-2 bg-black border border-white/20 rounded-xl h-32 resize-none focus:outline-none focus:border-blue-600 transition"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <small className="sf-profile-description-count">{desc.length} characters</small>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="sf-profile-save mt-8 px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold w-full shadow-md"
          >
            <FiSave aria-hidden="true" /> Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
