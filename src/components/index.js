import Profile from "./Home/Profile";
import Register from "./Authentication/Register/Register";
import SingIn from "./Authentication/SignIn/SingIn";

import ThemeProvider from "./Authentication/ThemeProvider/ThemeProvider";
import ThemeToggler from './Authentication/ThemeProvider/ThemeToggler'

import useFetch from "./Authentication/useFetch";

import SocialLoginBtns from "./Authentication/SocialLoginBtns/SocialLoginBtns";
import AuthForm from "./LoginForm/AuthForm";

import ProtectedRoute from "./Authentication/ProtectedRoute";

export {
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