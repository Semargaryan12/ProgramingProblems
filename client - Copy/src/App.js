import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import './App.css'
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/AdminDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import CreateQuizPage from './pages/quiz/CreateQuizPage';
import CreateQuestionPage from './pages/question/CreateQuestionPage';
import QuestionslistPage from './pages/question/QuestionsListPage';
import UsersListPage from './pages/UsersListPage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './pages/Layout'; 
// 
import Videos from './pages/video/Videos';
import Contact from './pages/Contact';
import UsersDasboard from './pages/UsersDashboard';
import CreateVideoPage from './pages/video/CreateVideoPage';
import QuizListAdminPage from './pages/quiz/QuizListAdminPage';
import QuizListUserPage from './pages/quiz/QuizLIstUserPage';
import LabsListPage from './pages/labs/LabsListPage';
import CreateLabPage from './pages/labs/CreateLabPage';
import Unauthorized from './pages/Unauthorized';

////////////////////////////////////////////////


import Programming from './pages/Programming/Programming';
import LessonsPage from './pages/lessons/LessonsPage';
import Resources from './pages/Programming/Resources';
import AdminResourcesList from './pages/Programming/AdminResourcesList';
import AdminVideoListPage from './pages/video/AdminVideoListPage';
import LessonsUpload from './pages/lessons/LessonsUpload';
import AdminLessonsPage from './pages/lessons/AdminLessonsPages';
import Verify from './pages/auth/Verify';
import LandingPage from './pages/auth/LandingPage';
function App() {

 
  return (
    <LanguageProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login isLogin={true} />} />
        <Route path="/register" element={<Register isLogin={false} />} />
        <Route path="/" element={<LandingPage isLogin={true} />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/verify" element={<Verify />} />


        <Route path="/admin" element={<ProtectedRoute element={<Layout><AdminDashboard /></Layout>} requiredRole="admin" />} />
        <Route path="/admin/quizzes/create" element={<ProtectedRoute element={<Layout><CreateQuizPage /></Layout>} requiredRole="admin" />} />
        <Route path="/admin/questions/create" element={<ProtectedRoute element={<Layout><CreateQuestionPage /></Layout>} requiredRole="admin" />} />
        <Route path="/admin/labs/create" element={<ProtectedRoute element={<Layout><CreateLabPage /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/video/create' element={<ProtectedRoute element={<Layout><CreateVideoPage /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/lessons/upload' element={<ProtectedRoute element={<Layout><LessonsUpload /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/quizzes/list' element={<ProtectedRoute element={<Layout><QuizListAdminPage /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/questions/list' element={<Layout><QuestionslistPage /></Layout>}   />
        <Route path='/admin/labs/list' element={<Layout><LabsListPage /></Layout>}   />
        <Route path='/admin/users/list' element={<ProtectedRoute element={<Layout><UsersListPage /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/resource/create' element={<ProtectedRoute element={<Layout><Resources /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/resource/list' element={<ProtectedRoute element={<Layout><AdminResourcesList /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/video/list' element={<ProtectedRoute element={<Layout><AdminVideoListPage /></Layout>} requiredRole="admin" />} />
        <Route path='/admin/lessons/list' element={<ProtectedRoute element={<Layout><AdminLessonsPage /></Layout>} requiredRole="admin" />} />
        <Route path='/superadmin' element={<ProtectedRoute element={<Layout><SuperAdminDashboard /></Layout>} requiredRole="superadmin" />} />
    


        <Route path="/user" element={<Layout> <UsersDasboard /></Layout>} />
        <Route path="/lessons" element={<Layout> <LessonsPage /></Layout>} />
        <Route path="/questions/list" element={<Layout> <QuestionslistPage /></Layout>} />
        <Route path="/quizzes/list" element={<Layout> <QuizListUserPage /></Layout>} />
        <Route path="/labs/list" element={<Layout> <LabsListPage /></Layout>} />
        <Route path="/videos" element={< Layout> <Videos /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        
        {/* <Route path="/statisticfunc" element={<Layout><StatisticalFunctionsPage /></Layout>} /> */}
        <Route path="/statisticfunc" element={<Layout><Programming /></Layout>} />
        
        
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Router>
    </LanguageProvider>
  );
}

export default App;
