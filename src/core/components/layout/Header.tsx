import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  InputAdornment,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import ImgAvatar from "../../assets/img-avatar.png";
import type { IHeaderProps } from "../../types/user.type";

const Header: React.FC<IHeaderProps> = ({ loggedInUser, handleLogout }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const Header_handleProfileMenuOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const Header_handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenu = (
    <Menu
      id="Header-Menu-avatar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={Header_handleMenuClose}
    >
      <MenuItem onClick={handleLogout} id="Header-MenuItem-logout">
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="static" color="inherit">
      <Toolbar sx={{ justifyContent: "space-between", py: "16px" }}>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, mr: 2 }}>
          <TextField
            id="Header-TextField-searchable"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
            variant="outlined"
            placeholder="Search"
            size="small"
            sx={{
              flexGrow: 1,
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "rgba(0,0,0,0.05)",
                "& fieldset": { border: "none" },
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            color="inherit"
            sx={{ ml: 2 }}
            id="Header-IconButton-calendar"
          >
            <CalendarTodayOutlinedIcon />
          </IconButton>
          {loggedInUser && (
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  width: "120px",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.2 }}
                  id="Header-Typography-username"
                >
                  {loggedInUser.split("@")[0]}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Admin
                </Typography>
              </Box>
              <Box
                id="Header-IconButton-person-account"
                component="img"
                src={ImgAvatar}
                alt="ImgAvatar"
                sx={{
                  width: "40px",
                  height: "40px",
                  marginLeft: 1,
                }}
                onClick={Header_handleProfileMenuOpen}
              />
            </Box>
          )}
        </Box>
      </Toolbar>
      {renderMenu}
    </AppBar>
  );
};

export default Header;
