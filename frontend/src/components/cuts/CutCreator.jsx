import { useState } from "react";
import { createCut } from "../../api/cutApi";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlay, FiSave, FiScissors } from "react-icons/fi";
import { useGuestActions } from "../common/guestActionContext";

export default function CutCreator() {
  const { id: videoId } = useParams();
  const navigate = useNavigate();

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [title, setTitle] = useState("");
  const { requireAuth } = useGuestActions();

  const handleSaveCut = async () => {
    if (!requireAuth()) return;
    if (!start || !end || Number(start) >= Number(end)) {
      toast.error("Invalid start/end time");
      return;
    }

    try {
      await createCut({
        videoId,
        title,
        startSeconds: Number(start),
        endSeconds: Number(end),
      });

      toast.success("Cut saved!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to save cut");
    }
  };

  const handlePlayCut = () => {
    if (!start || !end) return toast.error("Enter start & end times");

    navigate(`/watch/${videoId}?start=${start}&end=${end}`);
  };

  return (
    <section className="sf-cut-creator" aria-labelledby="sf-cut-creator-title">
      <div className="sf-cut-creator-heading">
        <span className="sf-cut-creator-icon" aria-hidden="true"><FiScissors /></span>
        <div>
          <p className="sf-cut-eyebrow">MAKE A CLIP</p>
          <h2 id="sf-cut-creator-title">Create a cut</h2>
          <p className="sf-cut-description">Save a favorite moment from this video.</p>
        </div>
      </div>

      <div className="sf-cut-fields">
        <label className="sf-cut-field sf-cut-title-field" htmlFor="sf-cut-title">
          <span>Cut title</span>
          <input
            id="sf-cut-title"
            placeholder="Give this moment a name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="sf-cut-input"
          />
        </label>

        <div className="sf-cut-time-fields">
          <label className="sf-cut-field" htmlFor="sf-cut-start">
            <span>Start time <small>seconds</small></span>
            <input
              id="sf-cut-start"
              placeholder="0"
              type="number"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="sf-cut-input"
            />
          </label>
          <label className="sf-cut-field" htmlFor="sf-cut-end">
            <span>End time <small>seconds</small></span>
            <input
              id="sf-cut-end"
              placeholder="0"
              type="number"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="sf-cut-input"
            />
          </label>
        </div>
      </div>

      <div className="sf-cut-actions">
        <button
          onClick={handleSaveCut}
          className="sf-cut-save"
        >
          <FiSave aria-hidden="true" /> Save cut
        </button>

        <button
          onClick={handlePlayCut}
          className="sf-cut-preview"
        >
          <FiPlay aria-hidden="true" /> Preview cut
        </button>
      </div>
    </section>
  );
}
