import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function CircularIndeterminate({
  message = "Loading...",
  variant = "full",
  className = "",
  color = "gray",
}) {
  if (variant === "small") {
    return (
      <Box
        className={className}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={30} color="primary" />
        {message && (
          <Typography variant="caption" sx={{ ml: 1, color: color }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }
  // Full-page loader
  return (
    <Box
      className={className}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(8px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
        flexDirection: "column",
      }}
    >
      <CircularProgress />
      <Typography
        variant="h6"
        sx={{ mt: 2, color: "white", textAlign: "center" }}
      >
        {message}
      </Typography>
    </Box>
  );
}
