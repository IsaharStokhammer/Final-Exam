import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useLocation } from "react-router-dom";

const pages = [
  { label: "בית", path: "/" },
  { label: "סוגי מתקפות", path: "/AttackTypesPage" },
  { label: "איזורים מסוכנים", path: "/AreasWithTheHighestAverageCasualties" },
  { label: "טווח שנים", path: "/EventsByYearPage" },
  { label: "חיפוש קבוצה", path: "/AllEventsOfGroup" },
  { label: "חיפוש שנה", path: "/GroupsByYear" },
  { label: `איזורים מאוימים ע"י ארגון`, path: "/AreasOrganIsNumberOne" },
  { label: " קבוצות מסוכנות באיזור", path: "/TopGroups" },
  { label: "ניהול אירועים", path: "/crud" }

];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    handleCloseNavMenu();
  };

  return (
    <AppBar position="fixed" sx={{ width: "100vw", left: 0, top: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            World Terrorism Database
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="תפריט ניווט"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.path}
                  onClick={() => handleNavigate(page.path)}
                  selected={location.pathname === page.path}
                  sx={{
                    backgroundColor:
                      location.pathname === page.path ? "primary.main" : "inherit",
                    color: location.pathname === page.path ? "white" : "inherit",
                  }}
                >
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
          >
            World Terrorism Database
          </Typography>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "flex-end",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.path}
                onClick={() => handleNavigate(page.path)}
                sx={{
                  my: 2,
                  color: location.pathname === page.path ? "white" : "inherit",
                  backgroundColor:
                    location.pathname === page.path ? "primary.main" : "inherit",
                  "&:hover": {
                    backgroundColor: location.pathname === page.path
                      ? "primary.dark"
                      : "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
