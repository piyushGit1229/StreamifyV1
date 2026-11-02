import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/Home/HomePage";
import WatchPage from "./pages/watch/WatchPage";
import LoginPage from "./pages/Auth/LoginPage";
import SignupPage from "./pages/Auth/SignupPage";
import UploadPage from "./pages/UploadPage";
import TrendingPage from "./pages/TrendingPage";
import ExplorePage from "./pages/ExplorePage";
import LikedVideosPage from "./pages/Library/LikedPage";
import PlaylistDetailPage from "./pages/Library/PlaylistDetailPage";
import MyPlaylistsPage from "./pages/Library/PlaylistsPage";
import MysubscriptionsPage from "./pages/Library/SubscriptionsPage";
import ChannelPage from "./pages/Library/ChannelPage";
import ProfilePage from "./components/profile/ProfilePage";
import MyCutsPage from "./pages/Library/MyCutsPage";
import WatchPartyPage from "./pages/WatchParty/WatchPartyPage";
import SearchResultsPage from "./pages/Search/SearchResultsPage";
import { GuestActionProvider, RequireSignIn } from "./components/common/GuestActionProvider";




export default function App() {
  return (
    <GuestActionProvider>
    <Routes>

      {/* Auth pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/upload" element={<RequireSignIn title="Creator Studio" description="Sign in to upload videos and manage your channel."><UploadPage /></RequireSignIn>} />

      {/* Home */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      {/* Watch Page */}
      <Route
        path="/watch/:id"
        element={
          <MainLayout>
            <WatchPage />
          </MainLayout>
        }
      />

      {/* Trending */}
      <Route
        path="/trending"
        element={
          <MainLayout>
            <TrendingPage />
          </MainLayout>
        }
      />

      {/* Explore (THIS NEEDS TO BE OUTSIDE) */}
      <Route
        path="/explore"
        element={
          <MainLayout>
            <ExplorePage />
          </MainLayout>
        }
      />

       <Route
          path="/liked"
          element={
            <MainLayout>
            <RequireSignIn title="Liked videos" description="Sign in to revisit the videos you have liked."><LikedVideosPage /></RequireSignIn>
            </MainLayout>
          }
       />

       <Route
  path="/playlists"
  element={
    <MainLayout>
    <RequireSignIn title="Your playlists" description="Sign in to create and manage your video collections."><MyPlaylistsPage /></RequireSignIn>
    </MainLayout>
  }
/>

<Route
  path="/playlist/:id"
  element={
    <MainLayout>
      <RequireSignIn title="Your playlist" description="Sign in to view and manage your saved playlist."><PlaylistDetailPage /></RequireSignIn>
    </MainLayout>
  }
/>


                        
<Route
  path="/subscriptions"
  element={
    <MainLayout>
            <RequireSignIn title="Your subscriptions" description="Sign in to see the creators you follow."><MysubscriptionsPage /></RequireSignIn>
    </MainLayout>
  }
/>

<Route
  path="/channel/:channelId"
  element={
    <MainLayout>
      <ChannelPage />
    </MainLayout>
  }
/>


<Route
  path="/profile"
  element={
    <MainLayout>
            <RequireSignIn title="Your channel" description="Sign in to manage your profile and channel details."><ProfilePage /></RequireSignIn>
    </MainLayout>
  }
/>

<Route
  path="/mycuts"
  element={
    <MainLayout>
            <RequireSignIn title="Your saved cuts" description="Sign in to revisit your favorite video moments."><MyCutsPage /></RequireSignIn>
    </MainLayout>
  }
/>


<Route path="/watchparty/:roomCode" element={<RequireSignIn title="Watch together" description="Sign in to join a Watch Party and connect with friends."><WatchPartyPage /></RequireSignIn>} />







<Route path="/search" element={<SearchResultsPage />} />







    </Routes>
    </GuestActionProvider>
  );
}
