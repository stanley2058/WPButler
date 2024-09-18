import React from "react";
import { Tooltip, Indicator, ThemeIcon, Flex } from "@mantine/core";
import { IconUsers, IconUsersGroup } from "@tabler/icons-react";
import { useTranslation } from "../../services/I18n";

export default function WaitingQueue(props: {
  hasLogin?: boolean;
  queue?: number;
  waiting?: number;
}) {
  const currentOrder = (props.queue ?? -1) + 1;
  const i18n = useTranslation();
  return (
    <Flex justify="center" align="center">
      <Flex justify="space-evenly" maw="10rem" w="100%" gap="sm">
        {!props.hasLogin && (
          <Tooltip label={i18n.t("classroom.info.numberInQueue")}>
            <Indicator
              inline
              position="bottom-end"
              color="indigo"
              label={currentOrder}
              size="1rem"
              disabled={currentOrder === 0}
            >
              <ThemeIcon
                color="indigo"
                style={{ cursor: "help" }}
                variant="transparent"
              >
                <IconUsers />
              </ThemeIcon>
            </Indicator>
          </Tooltip>
        )}
        <Tooltip label={i18n.t("classroom.info.waitingNumber")}>
          <Indicator
            inline
            position="bottom-end"
            color="indigo"
            label={props.waiting}
            size="1rem"
          >
            <ThemeIcon
              color="indigo"
              style={{ cursor: "help" }}
              variant="transparent"
            >
              <IconUsersGroup />
            </ThemeIcon>
          </Indicator>
        </Tooltip>
      </Flex>
    </Flex>
  );
}
