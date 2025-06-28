import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ImgLogo1 from "../../assets/img-logo-1.png";
import ImgLogo2 from "../../assets/img-logo-2.png";
import type { ISidebarProps } from "../../types/user.type";

const Sidebar: React.FC<ISidebarProps> = ({ drawerWidth }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
        },
      }}
    >
      <Toolbar sx={{ justifyContent: "center", py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyItems: "center",
              gap: 5,
            }}
          >
            <Box
              component="img"
              src={ImgLogo2}
              alt="ImgLogo2"
              sx={{
                width: "auto",
                height: "auto",
              }}
            />
            <Box
              component="img"
              src={ImgLogo1}
              alt="ImgLogo1"
              sx={{
                width: "auto",
                height: "auto",
              }}
            />
          </Box>
        </Box>
      </Toolbar>
      <List>
        <ListItem className="cursor-pointer">
          <IconButton size="small" sx={{ mr: 1 }}>
            <HomeOutlinedIcon />
          </IconButton>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          sx={{
            backgroundColor: "primary.main",
            "&.Mui-selected": { backgroundColor: "primary.main" },
          }}
          className="cursor-pointer"
        >
          <IconButton size="small" sx={{ mr: 1, color: "white" }}>
            <DescriptionOutlinedIcon />
          </IconButton>
          <ListItemText primary="Todo" sx={{ color: "white" }} />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
