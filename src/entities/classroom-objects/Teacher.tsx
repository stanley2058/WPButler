import React from "react";
import { Flex } from "@mantine/core";
import { useTranslation } from "../../services/I18n";

export default function Teacher() {
  const i18n = useTranslation();
  return (
    <Flex bg="cyan" w="100%" h="100%" justify="center" align="center">
      {i18n.t("entity.seat.teacher")}
    </Flex>
  );
}
