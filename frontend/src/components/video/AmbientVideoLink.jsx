import { Link } from "react-router-dom";
import useAmbientCardColor from "./useAmbientCardColor";

export default function AmbientVideoLink({ video, to, className = "", children, ...props }) {
  const { ambientColor, loadAmbientColor } = useAmbientCardColor(video?.thumbnailUrl);

  return (
    <Link
      to={to}
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
