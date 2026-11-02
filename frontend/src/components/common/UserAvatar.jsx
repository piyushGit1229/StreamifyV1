import { useState } from "react";
import { FiUser } from "react-icons/fi";

export default function UserAvatar({ src, name, className = "", alt }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={alt ?? (name ? `${name} avatar` : "")}
        className={className}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  const initials = name?.trim()
    ? name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()
    : null;

  return (
    <span className={`sf-avatar-fallback ${className}`} role="img" aria-label={name ? `${name} avatar` : "Default user avatar"}>
      {initials || <FiUser aria-hidden="true" />}
    </span>
  );
}
