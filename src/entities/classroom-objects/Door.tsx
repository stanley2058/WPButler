import React from "react";
import { Flex } from "@mantine/core";
import { useTranslation } from "../../services/I18n";

export default function Door() {
  const i18n = useTranslation();
  return (
    <Flex bg="lime" w="100%" h="100%" justify="center" align="center">
      {i18n.t("entity.door")}
    </Flex>
  );
}
