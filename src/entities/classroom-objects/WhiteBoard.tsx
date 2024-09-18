import { Flex } from "@mantine/core";
import React from "react";
import { useTranslation } from "../../services/I18n";

export default function WhiteBoard() {
  const i18n = useTranslation();
  return (
    <Flex justify="center" align="center" w="100%" h="100%" bg="gray">
      {i18n.t("entity.seat.whiteboard")}
    </Flex>
  );
}
