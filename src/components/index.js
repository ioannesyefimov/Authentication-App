import Profile from "./Profile/Profile";
import Register from "./Authentication/Register/Register";
import SingIn from "./Authentication/SignIn/SingIn";

import ThemeProvider from "./Authentication/ThemeProvider/ThemeProvider";
import ThemeToggler from './Authentication/ThemeProvider/ThemeToggler'

import useFetch from "./hooks/useFetch";

import SocialLoginBtns from "./Authentication/SocialLoginBtns/SocialLoginBtns";
import AuthForm from "./LoginForm/AuthForm";

import ProtectedRoute from "./Authentication/ProtectedRoute";
import ChangeInfo from "./Profile/ChangeInfo/ChangeInfo";
import PersonalInfo from "./Profile/Personal Info/PersonalInfo";
export {
    PersonalInfo,
    ChangeInfo,
    Profile,
    Register,
    SingIn,
    ThemeProvider,
    ThemeToggler,
    useFetch,
    SocialLoginBtns,
    AuthForm,
    ProtectedRoute
}