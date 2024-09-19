import React from "react";
import { ThemeIcon } from "@mantine/core";
import { IconArmchair } from "@tabler/icons-react";

export default function Space() {
  return (
    <div style={{ display: "flex" }}>
      <ThemeIcon color="transparent" variant="transparent" size="md">
        <IconArmchair />
      </ThemeIcon>
    </div>
  );
}
