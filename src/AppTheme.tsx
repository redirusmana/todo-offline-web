import { createTheme } from "@mui/material/styles";
import { grey } from "@mui/material/colors";

const lightPalette = {
  primary: {
    main: "#154886",
    success: "#2BD350",
  },
  secondary: {
    main: "#E3E8EF",
  },
  error: {
    main: "#E11D23",
  },
  text: {
    primary: grey[900],
    secondary: grey[700],
    disabled: grey[500],
  },
  background: {
    default: "#F8F8F8",
    paper: "#FFFFFF",
    shadow: "#15488617",
    black: "#000000",
  },
  neutral: "#CDD5E0",
};

const getAppTheme = () =>
  createTheme({
    palette: lightPalette,

    typography: {
      fontFamily: "Roboto, sans-serif",
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
      },
      button: {
        textTransform: "none",
        fontWeight: 500,
      },
      caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
      },
    },

    spacing: 8,

    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "10px 20px",
          },
          outlined: {
            backgroundColor: `${lightPalette.primary.main}10`,
            borderColor: lightPalette.primary.main,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 4,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            border: `1 px solid ${lightPalette.neutral}`,
            boxShadow: `2px 5px 28px 0px ${lightPalette.background.shadow}`,
          },
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: grey[500],
            "&.Mui-checked": {
              color: lightPalette.primary.success,
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: lightPalette.primary.main,
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
            boxShadow: `2px 5px 28px 0px ${lightPalette.background.shadow}`,
            border: `1px solid ${lightPalette.neutral}`,
          },
        },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: {
            padding: "24px",
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: "16px 24px",
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: "8px",
            boxShadow: `2px 5px 28px 0px ${lightPalette.background.shadow}`,
            border: `1px solid ${lightPalette.neutral}`,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            boxShadow: `2px 5px 28px 0px ${lightPalette.background.shadow}`,
          },
        },
      },
    },
  });

export default getAppTheme;
