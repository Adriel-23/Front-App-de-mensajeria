import { Route, Routes } from "react-router";
import HomeScreen from "./Screens/HomeScreen/HomeScreen";
import ContactDetailScreen from "./Screens/ContactDetailScreen/ContactDetailScreen";
import ContactContextProvider from "./Context/ContactContext";
import ContactDetailContextProvider from "./Context/ContactDetailContext";
import WelcomeScreen from "./Screens/WelcomeScreen/WelcomeScreen";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import LoginScreen from "./Screens/LoginScreen/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen/RegisterScreen";
import ForgotPasswordScreen from "./Screens/ForgotPasswordScreen/ForgotPasswordScreen";
import ResetPasswordScreen from "./Screens/ResetPasswordScreen/ResetPasswordScreen";

function App() {

  return (
    <div>

      <Routes>

        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />

        <Route element={<ProtectedRoute />}>

          <Route element={<ContactContextProvider />}>

            <Route path="/" element={<HomeScreen />}>

              <Route index element={<WelcomeScreen />} />

              <Route element={<ContactDetailContextProvider />}>

                <Route path="/contact/:contact_id" element={<ContactDetailScreen />} />
              </Route>

            </Route>

          </Route>

        </Route>

      </Routes>
    </div>
  )
}
export default App