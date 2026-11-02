import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiTrendingUp,
  FiList,
  FiHeart,
  FiUsers,
  FiScissors,
  FiUpload,
  FiPlay,
} from "react-icons/fi";
import { useAuthStore } from "../../store/authStore";
import { useLibraryStore } from "../../store/libraryStore";
import UserAvatar from "../common/UserAvatar";
import { useGuestActions } from "../common/guestActionContext";

export default function Sidebar() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const { watchLaterCount, playlistsCount } = useLibraryStore();
  const { requireAuth } = useGuestActions();
  const requireSignInForRoute = (event) => {
    if (!requireAuth()) event.preventDefault();
  };

  const itemClass = (active) =>
    `sf-nav-item ${active ? "sf-nav-active" : ""}`;

  return (
    <aside className="sf-sidebar" aria-label="Main navigation">
      <Link to="/" className="sf-sidebar-brand" aria-label="Streamify home">
        <span className="sf-brand-mark" aria-hidden="true">
          <FiPlay size={18} fill="currentColor" />
        </span>
        <span className="sf-brand-name">Streamify</span>
      </Link>

      <nav className="sf-sidebar-nav">
        <div className="sf-nav-group">
          <p className="sf-nav-label">Discover</p>
          <Link to="/" className={itemClass(pathname === "/")} aria-current={pathname === "/" ? "page" : undefined}>
            <FiHome size={19} /><span>Home</span>
          </Link>
          <Link to="/explore" className={itemClass(pathname === "/explore")} aria-current={pathname === "/explore" ? "page" : undefined}>
            <FiCompass size={19} /><span>Explore</span>
          </Link>
          <Link to="/trending" className={itemClass(pathname === "/trending")} aria-current={pathname === "/trending" ? "page" : undefined}>
            <FiTrendingUp size={19} /><span>Trending</span>
          </Link>
          <Link to="/upload" onClick={requireSignInForRoute} className={itemClass(pathname === "/upload")} aria-current={pathname === "/upload" ? "page" : undefined}>
            <FiUpload size={19} /><span>Upload</span>
          </Link>
        </div>

        <div className="sf-nav-group sf-nav-library">
          <p className="sf-nav-label">Your library</p>
          <Link to="/subscriptions" onClick={requireSignInForRoute} className={itemClass(pathname === "/subscriptions")} aria-current={pathname === "/subscriptions" ? "page" : undefined}>
            <FiUsers size={19} /><span>Subscriptions</span>
          </Link>
          <Link to="/playlists" onClick={requireSignInForRoute} className={itemClass(pathname === "/playlists")} aria-current={pathname === "/playlists" ? "page" : undefined}>
            <FiList size={19} /><span>Playlists</span>{user && playlistsCount > 0 && <span className="sf-nav-count">{playlistsCount}</span>}
          </Link>
          <Link to="/mycuts" onClick={requireSignInForRoute} className={itemClass(pathname === "/mycuts")} aria-current={pathname === "/mycuts" ? "page" : undefined}>
            <FiScissors size={19} /><span>My Cuts</span>{user && watchLaterCount > 0 && <span className="sf-nav-count">{watchLaterCount}</span>}
          </Link>
          <Link to="/liked" onClick={requireSignInForRoute} className={itemClass(pathname === "/liked")} aria-current={pathname === "/liked" ? "page" : undefined}>
            <FiHeart size={19} /><span>Liked videos</span>
          </Link>
        </div>
      </nav>

      <div className="sf-sidebar-user">
        <UserAvatar src={user?.avatar} name={user?.name || "Guest User"} className="sf-sidebar-avatar" alt="" />
        <div className="sf-sidebar-user-copy">
          <p>{user?.name || "Guest User"}</p>
          <span>{user ? "Member" : "Browsing as guest"}</span>
        </div>
      </div>
    </aside>
  );
}
