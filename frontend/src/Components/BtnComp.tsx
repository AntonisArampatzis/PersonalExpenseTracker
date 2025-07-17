import { Button, SxProps, Theme } from "@mui/material";
import React from "react";
import { JSX, ReactNode } from "react";

type BtnCompProps = {
  children: ReactNode;
  type?: "button" | "submit";
  sx?: SxProps<Theme>;
  variant?: "outlined" | "contained";
};

export default function BtnComp({ children, type, sx, variant }: BtnCompProps ):JSX.Element{
    
  return (
    <Button type={type} variant={variant} sx={sx}>
      {children}
    </Button>
  );
}
