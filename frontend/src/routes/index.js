import RequireAuth from 'components/RequireAuth';
import { PATH_NAME } from 'configs/pathName';
import NotFound from 'features/404/NotFound';
import ChatOverView from 'features/ChatOverView/ChatOverView';
import WindowContent from 'features/ChatOverView/ChatWindow/WindowContent/WindowContent';
import WindowEmpty from 'features/ChatOverView/ChatWindow/WindowEmpty/WindowEmpty';
import Contact from 'features/Contact/Contact';
import Dashboard from 'features/Dashboard/Dashboard';
import Landing from 'features/Landing/Landing';
import Login from 'features/Login/Login';
import Register from 'features/Register/Register';
import UpdateProfile from 'features/UpdateProfile/UpdateProfile';
import UserInfor from 'features/UserInfor/UserInfor';
import Forgot from 'features/Forgot/Forgot';
import ChangePassword from 'features/ChangePassword/ChangePassword';

export const routesConfig = [
  {
    path: PATH_NAME.ROOT,
    element: (
      <RequireAuth>
        <ChatOverView />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <WindowEmpty /> },
      {
        path: PATH_NAME.CHAT_OVERVIEW,
        children: [{ path: PATH_NAME.CHAT_WINDOW, element: <WindowContent /> }],
      },
    ],
  },
  {
    path: PATH_NAME.DASHBOARD,

    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: PATH_NAME.UPDATE_PROFILE,
    element: (
      <RequireAuth>
        <UpdateProfile />
      </RequireAuth>
    ),
  },
  {
    path: PATH_NAME.USER_INFOR,
    element: (
      <RequireAuth>
        <UserInfor />
      </RequireAuth>
    ),
  },
  {
    path: PATH_NAME.CONTACT,
    element: (
      <RequireAuth>
        <Contact />
      </RequireAuth>
    ),
  },
  {
    path: PATH_NAME.REGISTER,
    element: <Register />,
  },
  {
    path: PATH_NAME.LOGIN,
    element: <Login />,
  },
  {
    path: PATH_NAME.FORGOT,
    element: <Forgot />,
  },
  {
    path: PATH_NAME.CHANGE_PASSWORD,
    element: <ChangePassword />,
  },
  {
    path: PATH_NAME.LANDING,
    element: <Landing />,
  },
  {
    path: PATH_NAME.ERROR_404,
    element: <NotFound />,
  },
];

//  <Routes location={location}>
//    <Route
//      path="/"
//      element={
//        <RequireAuth>
//          <ChatOverView />
//        </RequireAuth>
//      }
//    >
//      <Route path="chat">
//        <Route index element={<WindowEmpty />} />
//        <Route path=":roomId" element={<WindowContent />} />
//      </Route>
//    </Route>
//    <Route
//      path="dashboard"
//      element={
//        <RequireAuth>
//          <Dashboard />
//        </RequireAuth>
//      }
//    />
//    <Route
//      path="update-profile"
//      element={
//        <RequireAuth>
//          <UpdateProfile />
//        </RequireAuth>
//      }
//    />
//    <Route path="register" element={<Register />} />
//    <Route path="login" element={<Login />} />
//    <Route path="landing" element={<Landing />} />
//    <Route path="*" element={<NotFound />} />
//  </Routes>;
