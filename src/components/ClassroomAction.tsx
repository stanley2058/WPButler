import React from "react";
import { Flex, Text } from "@mantine/core";
import Actions, { IActions, IData } from "./Classroom/Actions";
import RotationControls from "./Classroom/RotationControls";
import WaitingQueue from "./Classroom/WaitingQueue";

export default function ClassroomAction(props: {
  info?: { id: string };
  waiting?: number;
  queue?: number;
  hasLogin?: boolean;
  onRotate: (clockwise: boolean) => void;
  actions: IActions;
  data: IData;
}) {
  return (
    <Flex p="0.1rem" direction="column">
      <Flex
        direction="column"
        gap="0.5rem"
        justify="center"
        align="center"
        mb="0.8rem"
        p="0.5rem"
        ta="center"
      >
        <Flex direction="row">
          {!props.hasLogin && (
            <>
              <Text fw="bold" inline>
                學號：
              </Text>
              <Text c="gray" inline>
                {props.info?.id || ""}
              </Text>
            </>
          )}
        </Flex>
        <WaitingQueue
          hasLogin={props.hasLogin}
          waiting={props.waiting}
          queue={props.queue}
        />
      </Flex>
      <Actions
        hasLogin={props.hasLogin}
        actions={props.actions}
        isInQueue={props.queue !== -1}
        waiting={props.waiting}
        data={props.data}
      />
      <RotationControls onRotate={props.onRotate} />
    </Flex>
  );
}
