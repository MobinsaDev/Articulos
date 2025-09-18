// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";

import BatteryList from "./pages/batteries/BatteryList";
import BatteryForm from "./pages/batteries/BatteryForm";
import BatteryEdit from "./pages/batteries/BatteryEdit";
import ForkliftList from "./pages/forklifts/ForkliftList";
import ForkliftForm from "./pages/forklifts/ForkliftForm";
import ForkliftEdit from "./pages/forklifts/ForkliftEdit";
import ChargerList from "./pages/chargers/ChargerList";
import ChargerForm from "./pages/chargers/ChargerForm";
import ChargerEdit from "./pages/chargers/ChargerEdit";
import AditamentsList from "./pages/aditaments/AditametsList";
import UserForm from "./pages/users/UsersForm";
import UsersList from "./pages/users/UsersList";
import UsersEdit from "./pages/users/UsersEdit";

import Welcome from "./pages/Welcome";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          >
            <Route index element={<Welcome />} />

            <Route path="batteries" element={<BatteryList />} />
            <Route path="batteries/new" element={<BatteryForm />} />
            <Route path="batteries/:id" element={<BatteryEdit />} />

            <Route path="forklifts" element={<ForkliftList />} />
            <Route path="forklifts/new" element={<ForkliftForm />} />
            <Route path="forklifts/:id" element={<ForkliftEdit />} />

            <Route path="chargers" element={<ChargerList />} />
            <Route path="chargers/new" element={<ChargerForm />} />
            <Route path="chargers/:id" element={<ChargerEdit />} />
            <Route path="aditamets" element={<AditamentsList />} />

            <Route path="/users" element={
              <ProtectedRoute roles={['admin']}>
                <UsersList />
              </ProtectedRoute>
            } />
            <Route path="/users/new" element={
              <ProtectedRoute roles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            } />
            <Route path="/users/:id" element={
              <ProtectedRoute roles={['admin']}>
                <UsersEdit />
              </ProtectedRoute>
            } />

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
