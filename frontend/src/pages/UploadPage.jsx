import { useState, useEffect } from "react";
import { uploadVideo } from "../api/videoApi";
import { useAuthStore } from "../store/authStore";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function UploadPage() {
  const { user } = useAuthStore();

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    title: "",
    description: "",
    tags: "",
  });

  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // -------------------------------
  // 3D Page Parallax
  // -------------------------------
  useEffect(() => {
    const move = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10,
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // -------------------------------
  // File logic
  // -------------------------------
  const handleFile = (file) => {
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleInfo = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  // -------------------------------
  // Upload Video
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !info.title.trim()) return;

    setLoading(true);
    try {
      const data = new FormData();
      data.append("video", file);
      data.append("title", info.title);
      data.append("description", info.description);
      data.append("tags", info.tags);

      await uploadVideo(data);
      alert("Upload successful!");

      // Reset
      setFile(null);
      setPreview("");
      setInfo({ title: "", description: "", tags: "" });
    } catch (err) {
      alert("Video upload failed.");
    }
    setLoading(false);
  };

  if (!user)
    return (
      <div className="sf-upload-page sf-upload-auth-page sf-screen sf-upload-screen">
        <Link to="/" className="sf-upload-back"><FiArrowLeft aria-hidden="true" /> Back to Streamify</Link>
        <div className="sf-upload-auth-message" role="status">
          Please log in to upload videos.
        </div>
      </div>
    );

  return (
    <main className="sf-upload-page sf-screen sf-upload-screen relative min-h-screen px-4 py-10 overflow-hidden">

      {/* Background Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="sf-upload-glow absolute w-[450px] h-[450px] bg-[#2563eb]/20 blur-3xl rounded-full animate-pulse"
          style={{ top: "20%", left: "15%", transform: `translate(${mouse.x * 0.5}px, ${mouse.y * 0.5}px)` }}
        />
        <div
          className="sf-upload-glow absolute w-[350px] h-[350px] bg-[#3b82f6]/20 blur-3xl rounded-full animate-pulse"
          style={{ bottom: "10%", right: "20%", transform: `translate(${mouse.x * -0.4}px, ${mouse.y * -0.4}px)` }}
        />
      </div>

      {/* Main Upload Modal */}
      <div className="sf-upload-content relative z-10">
        <Link to="/" className="sf-upload-back"><FiArrowLeft aria-hidden="true" /> Back to Streamify</Link>
        <header className="sf-upload-heading">
          <p className="sf-upload-eyebrow">CREATOR STUDIO</p>
          <h1 className="sf-upload-title">Upload a video</h1>
          <p className="sf-upload-intro">Share your latest video with the Streamify community.</p>
        </header>
        <div className="sf-upload-panel">

        {/* LEFT — Upload Area */}
        <section className="sf-upload-source">
          <div className="sf-upload-section-heading">
            <span className="sf-upload-step">01</span>
            <div><h2>Video file</h2><p>Choose a video from your device</p></div>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="sf-upload-dropzone group"
          >
            {!preview ? (
              <label className="sf-upload-dropzone-label flex flex-col items-center cursor-pointer space-y-4">
                <input
                  type="file"
                  accept="video/*"
                  className="sf-upload-file-input hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                {/* Upload Icon */}
                <div className="sf-upload-icon">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 4L5 12h4v6h6v-6h4z" />
                  </svg>
                </div>

                <div>
                  <p className="sf-upload-drop-title">Drag &amp; drop video files to upload</p>
                  <p className="sf-upload-drop-hint">Your video will be private until published</p>
                </div>

                <Button className="sf-upload-select-button px-6 py-3 mt-2">
                  Select files
                </Button>
              </label>
            ) : (
              <div className="sf-upload-preview">
                <video
                  src={preview}
                  controls
                  className="sf-upload-preview-video"
                />
                <button
                  className="sf-upload-remove"
                  onClick={() => {
                    setPreview("");
                    setFile(null);
                  }}
                >
                  Remove selected video
                </button>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT — Metadata Fields */}
        <form onSubmit={handleSubmit} className="sf-upload-form">

          <div className="sf-upload-section-heading">
            <span className="sf-upload-step">02</span>
            <div><h2>Video details</h2><p>Add information to help viewers discover it</p></div>
          </div>

          {/* Title */}
          <div className="sf-upload-field">
            <label className="sf-upload-label" htmlFor="upload-title">Title</label>
            <input
              id="upload-title"
              type="text"
              name="title"
              value={info.title}
              onChange={handleInfo}
              placeholder="Add a catchy and descriptive title…"
              required
              className="sf-upload-control"
            />
          </div>

          {/* Description */}
          <div className="sf-upload-field">
            <label className="sf-upload-label" htmlFor="upload-description">Description</label>
            <textarea
              id="upload-description"
              name="description"
              value={info.description}
              onChange={handleInfo}
              rows="5"
              placeholder="Tell viewers what your video is about. Include important points, timestamps, or credits…"
              className="sf-upload-control sf-upload-description"
            ></textarea>
          </div>

          {/* Tags */}
          <div className="sf-upload-field">
            <label className="sf-upload-label" htmlFor="upload-tags">Tags</label>
            <input
              id="upload-tags"
              type="text"
              name="tags"
              value={info.tags}
              onChange={handleInfo}
              placeholder="Add tags to help people find your video (e.g. tech, coding, comedy)…"
              className="sf-upload-control"
            />
          </div>

          {/* Upload Button */}
          {file && (
            <Button
              loading={loading}
              type="submit"
              className="sf-upload-submit w-full"
            >
              {loading ? <Spinner /> : "Upload Video"}
            </Button>
          )}
        </form>
        </div>
      </div>
    </main>
  );
}
