import { Link } from "react-router-dom";
import useAmbientCardColor from "./useAmbientCardColor";
import { cachePublicVideo } from "../../api/publicVideoCache";

export default function AmbientVideoLink({ video, to, className = "", children, onClick, ...props }) {
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(video?.thumbnailUrl);

  return (
    <Link
      to={to}
      state={{ video }}
      onClick={(event) => {
        cachePublicVideo(video);
        onClick?.(event);
      }}
      onPointerEnter={loadAmbientColor}
      onFocus={loadAmbientColor}
      style={{ "--sf-card-ambient": ambientColor }}
      className={`sf-ambient-card ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
