import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Homepage from '../src/components/userinterface/homepage';
import Login from '../src/components/userinterface/login';
import ResetPassword from './components/userinterface/ResetPassword';
import SignUp from './components/userinterface/SignUp';
import Contact from './components/userinterface/contact';
import Header from './components/userinterface/header';
import About from './components/userinterface/about';
import MyProfile from './components/userinterface/MyProfile';
import EditProfile from './components/userinterface/EditProfile';
import TitleSubmission from './components/userinterface/TitleSubmission';
import SubmissionDetail from './components/userinterface/SubmissionDetail';
import SubmissionUpload from './components/userinterface/SubmissionUpload';
import SubmissionContributors from './components/userinterface/SubmissionContributors';
import SubmissionEditors from './components/userinterface/SubmissionEditors';
import SubmissionReview from './components/userinterface/SubmissionReview';
import AuthorGuidelines from './components/userinterface/AuthorGuidelines';
import SubmissionTemplate from './components/userinterface/SubmissionTemplate';
import EditorialTeam from './components/userinterface/EditorialTeam';
import ResearchEthicsGuidelines from './components/userinterface/ResearchEthicsGuidelines';
import Submissions from './components/userinterface/Submissions';
import Announcements from './components/userinterface/Announcements';
import Current from './components/userinterface/issues/Current';
import Archive from './components/userinterface/issues/Archive';
import SetNewPassword from './components/SetNewPassword';
import AdminLogin from './components/admin/adminLogin';
import Dashboard from './components/admin/dashboard';
import Layout from './components/admin/dashboard';
import AdminUserList from './components/admin/AdminUserList';
import AdminProfile from './components/admin/AdminMyProfile';
import NewSubmissions from './components/admin/NewSubmissionsadmin';
import ReportsList from './components/admin/ReportsList';
import SubmissionFiles from './components/admin/SubmissionFiles';
import Titles from './components/admin/Titles';
import PeerReview from './components/userinterface/PeerReview';
import TidioWidget from './components/TidioWidget';

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ['/dashboard', '/admin/users', '/admin/profile', '/admin/new-submissions', '/admin/reports', '/admin/submission-files', '/admin/titles'];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);
  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} /> 
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/titlesubmission" element={<TitleSubmission />} />
        <Route path="/submission-detail" element={<SubmissionDetail />} />
        <Route path="/submission-detail/:submissionId" element={<SubmissionDetail />} />
        <Route path="/submission-upload" element={<SubmissionUpload />} />
        <Route path="/submission-contributors" element={<SubmissionContributors />} />
        <Route path="/submission-editors" element={<SubmissionEditors />} />
        <Route path="/submission-review" element={<SubmissionReview />} />
        <Route path="/editorial-team" element={<EditorialTeam />} />
        <Route path="/author-guidelines" element={<AuthorGuidelines />} />
        <Route path="/submission-template" element={<SubmissionTemplate />} />
        <Route path="/research-ethics-guidelines" element={<ResearchEthicsGuidelines />} />
        <Route path="/AuthorGuidelines" element={<AuthorGuidelines />} />
        <Route path="/SubmissionTemplate" element={<SubmissionTemplate />} />
        <Route path="/ResearchEthicsGuidelines" element={<ResearchEthicsGuidelines />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/issues/current" element={<Current />} />
        <Route path="/issues/archive" element={<Archive />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin/users" element={<AdminUserList />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/new-submissions" element={<NewSubmissions />} />   
        <Route path="/admin/reports" element={<ReportsList />} />
        <Route path="/admin/submission-files" element={<SubmissionFiles />} />
        <Route path="/admin/titles" element={<Titles />} />
        <Route path="/peerReview" element={<PeerReview />} />
      </Routes>
      <TidioWidget />
    </>
  );
}

function App() {
  return (
    <div>
      <Router>
        <AppContent />
      </Router>
    </div>
  );
}

export default App;