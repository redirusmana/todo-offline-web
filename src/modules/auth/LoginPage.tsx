import React, { useCallback, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  localStorage_isUserExists,
  localStorage_isValidateUser,
  localStorage_addUser,
} from "../../core/services/localStorageService";
import { EMAIL_REGEX } from "../../core/constants";
import { useAuthStore } from "../../core/hooks/authStore";
import ImgBg from "../../core/assets/img-bg.png";
import ImgDecor from "../../core/assets/img-decor.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { authStore_login } = useAuthStore();

  const login_validateEmail = useCallback((inputEmail: string) => {
    if (!inputEmail) {
      setEmailError("Email is required");
      return false;
    }
    if (!EMAIL_REGEX.test(inputEmail)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  const login_handleClickShowPassword = useCallback(
    () => setShowPassword((show) => !show),
    []
  );

  const login_handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setGoogleError("");
      setEmailError("");
      setPasswordError("");

      if (!login_validateEmail(email)) {
        return;
      }

      const existingUser = localStorage_isUserExists(email);

      if (!existingUser) {
        if (!password) {
          setPasswordError("Password is required");
          return;
        }
        localStorage_addUser({ email, password });
        authStore_login(email);
        navigate("/todos");
        return;
      }

      if (existingUser.password) {
        const validated = localStorage_isValidateUser(email, password);
        if (validated) {
          authStore_login(email);
          navigate("/todos");
        } else {
          setPasswordError("Password is Incorrect.");
          setGoogleError("");
        }
        return;
      }
      if (password) {
        setGoogleError(
          "This account connect with google. Please use Google Sign In."
        );
      } else {
        setGoogleError("Please use Google Sign In for this account.");
      }
    },
    [email, password, login_validateEmail, authStore_login, navigate]
  );

  const login_handleGoogleLogin = useCallback(() => {
    const googleEmail = email;
    if (!login_validateEmail(googleEmail)) {
      return;
    }
    const user = localStorage_isUserExists(googleEmail);
    if (user) {
      authStore_login(googleEmail);
    } else {
      localStorage_addUser({ email: googleEmail, password: "" });
      authStore_login(googleEmail);
    }
    navigate("/todos");
  }, [email, login_validateEmail, authStore_login, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "background.paper",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `url(${ImgBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
          zIndex: "2",
        }}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 3,
          position: "relative",
        }}
      >
        <Box
          component="img"
          src={ImgDecor}
          alt="ImgDecor1"
          sx={{
            position: "absolute",
            top: 20,
            right: 120,
            width: { xs: "120px", sm: "150px", md: "180px" },
            height: "auto",
            transform: "translate(50%, -50%) rotate(180deg)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            padding: { xs: 3, sm: 4 },
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
            maxWidth: 600,
            zIndex: 2,
            position: "relative",
          }}
        >
          <Typography component="h1" variant="h5">
            Welcome Back
          </Typography>
          {googleError && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {googleError}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={login_handleLogin}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              required
              fullWidth
              id="LoginPage-TextField-email"
              label="Email Address"
              name="email"
              autoComplete="email"
              margin="normal"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError("");
                setPasswordError("");
                setGoogleError("");
              }}
              onBlur={(e) => login_validateEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="LoginPage-TextField-password"
              autoComplete="current-password"
              margin="normal"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                setGoogleError("");
              }}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      id="LoginPage-IconButton-visibility"
                      aria-label="toggle password visibility"
                      onClick={login_handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              id="LoginPage-Button-sign-in"
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              id="LoginPage-Button-sign-in-google"
              fullWidth
              onClick={login_handleGoogleLogin}
              variant="contained"
              sx={{
                mb: 2,
                backgroundColor: "background.paper",
                color: "background.black",
                boxShadow: `2px 5px 28px 0px #15488617`,
                border: `1px solid #CDD5E0`,
              }}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
          </Box>
        </Box>
        <Box
          component="img"
          src={ImgDecor}
          alt="ImgDecor2"
          sx={{
            position: "absolute",
            bottom: 50,
            left: 30,
            width: { xs: "120px", sm: "150px", md: "180px" },
            height: "auto",
            transform: "translate(-50%, 50%)",
            zIndex: 1,
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
