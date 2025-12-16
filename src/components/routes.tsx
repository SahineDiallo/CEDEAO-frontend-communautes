
import { Routes, Route } from 'react-router-dom'; 
import Login from './authentication/Login';
import Register from './authentication/Register';
import PasswordReset from './authentication/Forgot-Password';
import PasswordChange from './authentication/Change-Password';
import ProtectedRoute from './ProtectedRoute';
import CommunitiesPage from "./CommunityPage";
import CommunityDetails from './CommunityDetails';
import Layout from './Layout';
import ActivationPage from './pages/ActivationPage';
import PostDetails from './discussionDetails';
import CommunityTabContent from './CommunityTabContent';
import MemberSearch from './pages/AllMembers';
import StakeholderSearch from './pages/Institutions';
import AdminDashboard from './pages/Dashboard';
import ProfilePage from './pages/UserProfilPage';


const AppRoutes: React.FC  = () => {
  return (
    <Routes>
      {/* Public Routes (No Layout) */}
      <Route path="/register" element={<Register />} />
      <Route path="/activate/:uid/:token" element={<ActivationPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<PasswordReset />} />
      <Route path="/password-change" element={<PasswordChange />} />

      {/* All dashboard routerss */}
      <Route path="/dashbord" element={<AdminDashboard />} />
      {/* <Route path="/add-community" element={<AddCommunityForm/>} /> */}

      <Route element={<Layout />}>
        <Route path="/" element={<CommunitiesPage />} />
        <Route path="/all-members" element={<MemberSearch />} />
        <Route path="/all-institutions" element={<StakeholderSearch />} />
        <Route path="/communaute-details/:pkId/:tab" element={<CommunityDetails />} />
        {/* Community Tabs */}
        <Route path="/communities/:pkId/:tab" element={<CommunityTabContent />} />
        {/* Post Details Page */}
        <Route path="/communities/:pkId/posts/:postId" element={<PostDetails />} />
        <Route path='/accounts/profile/:pkId' element={<ProfilePage />} />
      </Route>
      {/* Protected Routes (With Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}></Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;