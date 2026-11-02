import Sidebar from "../components/sidebar/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
     <div className="sf-shell min-h-screen text-white">

      <Sidebar />

      <div className="sf-main">
        <Navbar />
        <main className="sf-workspace">{children}</main>
      </div>

    </div>
  );
}
