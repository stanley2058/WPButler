import React, { type PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Flex, Accordion, Text, Title } from "@mantine/core";
import FirebaseService from "../services/FirebaseService";
import ClassSessionCreator from "../components/Settings/ClassSessionCreator";
import GradeSum from "../components/Settings/GradeSum";
import TASettings from "../components/Settings/TASettings";
import SeatRecord from "../components/Settings/SeatRecord";

function CustomAccordion(props: PropsWithChildren<{ title: string }>) {
  return (
    <Accordion.Item key={props.title} value={props.title}>
      <Accordion.Control>
        <Text fw="500" c="dark">
          {props.title}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Flex direction="column">{props.children}</Flex>
      </Accordion.Panel>
    </Accordion.Item>
  );
}

export default function Settings() {
  const [loginEmail, setLoginEmail] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      if (!(await FirebaseService.Instance.hasLogin)) navigate("/login");
      setLoginEmail(FirebaseService.Instance.currentUser?.email || "");
    };
    checkAuth();
  }, []);
  return (
    <Flex my="2rem" justify="center" align="center">
      <Container mx="1rem" w="clamp(50%, 40em, 90%)">
        <Title order={3} mt="0.5rem" mb="2rem">
          目前登入：{loginEmail}
        </Title>

        <Title order={4} mt="1rem" mb="0.2rem">
          課程相關
        </Title>

        <Accordion>
          <CustomAccordion title="編輯課程">
            <ClassSessionCreator />
          </CustomAccordion>

          <CustomAccordion title="成績統計">
            <GradeSum />
          </CustomAccordion>

          <CustomAccordion title="座位記錄">
            <SeatRecord />
          </CustomAccordion>
        </Accordion>

        <Title order={4} mt="1rem" mb="0.2rem">
          助教設定
        </Title>

        <Accordion>
          <CustomAccordion title="助教設定">
            <TASettings />
          </CustomAccordion>
        </Accordion>
      </Container>
    </Flex>
  );
}
