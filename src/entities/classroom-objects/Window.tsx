import React from "react";
import { Flex } from "@mantine/core";
import { useTranslation } from "../../services/I18n";

export default function Window() {
  const i18n = useTranslation();
  return (
    <Flex justify="center" align="center" w="100%" h="100%" bg="blue">
      {i18n.t("entity.seat.window")}
    </Flex>
  );
}
