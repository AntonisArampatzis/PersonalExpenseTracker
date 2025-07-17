import React, { ReactNode } from "react";
import { Link, Typography } from "@mui/material";

type AuthLinkHelperProps = {
  children: ReactNode;
  href: string;
};

export default function AuthLinkHelper({ children, href }: AuthLinkHelperProps) {
  return (
    <Typography
      variant="body2"
      sx={{
        mt: 3,
        textAlign: "center",
        color: "#6c757d",
        fontSize: "0.9rem",
      }}
    >
      {children}
      <Link
        href={href}
        style={{ color: "#00b4d8", textDecoration: "none" }}
      >
        here!
      </Link>
    </Typography>
  );
}
