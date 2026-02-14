// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Items } from './components/Items';
// import { ItemDetail } from './components/ItemDetail';

// function App() {
//   return (
//     <Router>
//       <div style={{ padding: '20px' }}>
//         <Routes>
//           <Route path="/" element={<Items />} />
//           <Route path="/items/:id" element={<ItemDetail />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Items from "./components/Items.jsx";
// import ItemDetail from "./components/ItemDetail.jsx";
// import Users from "./components/Users.jsx";
// import UserDetail from "./components/UserDetail.jsx";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/items" />} />
//         <Route path="/items" element={<Items />} />
//         <Route path="/items/new" element={<ItemDetail />} />
//         <Route path="/items/:id" element={<ItemDetail />} />
//         <Route path='profile' element={<Users />} />
//         <Route path='/profile' element={
// <RequireAuth>
// <Profile/>
// </RequireAuth>
// }/>
// <Route path='/logout' element={
// <RequireAuth>
// <Logout/>
// </RequireAuth>
// }/>
// </Routes>
     
//     </BrowserRouter>
//   );
// }
import { Navigate, Route, Routes } from "react-router-dom";
import Items from "./components/Items";
import ItemDetail from "./components/ItemDetail";
import Users from "./components/Users";
import UserDetail from "./components/UserDetail";
import RequireAuth from "./components/RequireAuth";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Logout from "./components/Logout";
import TextAPI from "./components/TextAPI";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Navigate to="/items" replace />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/new" element={<ItemDetail />} />
        <Route path="/items/:id" element={<ItemDetail />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/test_api" element={<TextAPI />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
