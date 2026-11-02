import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { searchVideos } from "../api/videoApi";
import { FiUser, FiLogOut, FiSearch, FiPlay, FiArrowUpRight } from "react-icons/fi";
import useAmbientCardColor from "./video/useAmbientCardColor";
import UserAvatar from "./common/UserAvatar";
import MediaThumbnail from "./common/MediaThumbnail";
import { safeReturnTo } from "./common/authReturn";

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = safeReturnTo(`${location.pathname}${location.search}${location.hash}`);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (!searchQuery.trim()) {
        setShowDropdown(false);
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await searchVideos(searchQuery, 1, 5);
        const list = res?.data?.data || res?.data?.videos || [];
        setResults(list);
        setShowDropdown(true);
      } catch (err) {
        console.error("SEARCH ERROR:", err);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (id) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/watch/${id}`);
  };

  const goToProfile = () => {
    navigate("/profile");
    setShowProfileMenu(false);
  };

  return (
    <header className="sf-navbar">
      <Link to="/" className="sf-header-brand" aria-label="Streamify home">
        <span className="sf-brand-mark" aria-hidden="true"><FiPlay size={16} fill="currentColor" /></span>
        <span className="sf-brand-name">Streamify</span>
      </Link>

      <div className="sf-search">
        <div className="sf-search-field">
          <FiSearch className="sf-search-icon" size={18} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search videos, channels..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowDropdown(true)}
            aria-label="Search videos"
          />
          {loading && <span className="sf-search-spinner" aria-label="Searching" />}
          <button
            className="sf-search-submit"
            aria-label="Search"
            onClick={() => {
              if (query.trim()) navigate(`/search?q=${query}`);
              setShowDropdown(false);
            }}
          >
            <FiSearch size={18} />
          </button>
        </div>

        {showDropdown && results.length > 0 && (
          <div ref={dropdownRef} className="sf-search-dropdown">
            {results.map((video) => (
              <SearchSuggestion
                key={video._id}
                video={video}
                onSelect={() => handleResultClick(video._id)}
              />
            ))}
            <button
              className="sf-search-all"
              onClick={() => navigate(`/search?q=${query}`)}
            >
              View all results <FiArrowUpRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div className="sf-auth">
        {!user ? (
          <>
            <Link className="sf-auth-login" to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>Log in</Link>
            <Link className="sf-auth-signup" to={`/signup?returnTo=${encodeURIComponent(returnTo)}`}>Create account</Link>
          </>
        ) : (
          <div className="sf-profile-menu-wrap" ref={profileRef}>
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="sf-profile-trigger"
              aria-label="Open profile menu"
              aria-expanded={showProfileMenu}
            >
              <UserAvatar src={user.avatar} name={user.name} className="sf-navbar-avatar" alt="" />
            </button>

            {showProfileMenu && (
              <div className="sf-profile-dropdown">
                <button onClick={goToProfile} className="sf-profile-menu-item">
                  <FiUser size={17} /> <span>Profile</span>
                </button>
                <button onClick={logout} className="sf-profile-menu-item sf-logout-item">
                  <FiLogOut size={17} /> <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function SearchSuggestion({ video, onSelect }) {
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(video.thumbnailUrl);

  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerEnter={loadAmbientColor}
      style={{ "--sf-card-ambient": ambientColor }}
      className="sf-search-suggestion"
    >
      <MediaThumbnail src={video.thumbnailUrl} title={video.title} className="sf-search-thumbnail" />
      <span className="sf-search-suggestion-copy">
        <span>{video.title}</span>
        <small>{video.owner?.name || "Unknown Channel"}</small>
      </span>
    </button>
  );
}
