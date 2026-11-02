import { useState } from "react";
import { FiImage } from "react-icons/fi";

export default function MediaThumbnail({ src, alt = "", title = "", className = "", loading = "lazy" }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={alt || title}
        loading={loading}
        className={className}
        onError={() => setFailedSrc(src)}
      />
    );
  }

  return (
    <div className={`sf-media-placeholder ${className}`} role="img" aria-label={alt || title || "Video thumbnail unavailable"}>
      <span className="sf-media-placeholder-icon" aria-hidden="true"><FiImage /></span>
      {title && <span className="sf-media-placeholder-title">{title}</span>}
      <small>Preview unavailable</small>
    </div>
  );
}
