import { SxProps, Theme, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import { JSX } from "react";

type PageHeaderProps = {
  variant: "h1" | "h2" | "h3" | "h4" | "h5";
  align: "left" | "center" | "right";
  sx?: SxProps<Theme>;
  children: ReactNode;
};

export default function PageHeader({
  variant,
  align,
  sx,
  children,
}: PageHeaderProps): JSX.Element {
  return (
    <Typography variant={variant} align={align} sx={sx}>
      {children}
    </Typography>
  );
}
