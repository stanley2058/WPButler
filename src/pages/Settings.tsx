import React, { type PropsWithChildren, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Flex, Accordion, Text, Title } from "@mantine/core";
import FirebaseService from "../services/FirebaseService";
import ClassSessionCreator from "../components/Settings/ClassSessionCreator";
import GradeSum from "../components/Settings/GradeSum";
import TASettings from "../components/Settings/TASettings";
import SeatRecord from "../components/Settings/SeatRecord";
import { useTranslation } from "../services/I18n";

function CustomAccordion(props: PropsWithChildren<{ title: string }>) {
  return (
    <Accordion.Item key={props.title} value={props.title}>
      <Accordion.Control>
        <Text fw="500" c="subtle">
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
  const i18n = useTranslation();
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
          {i18n.t("management.loginAs", { email: loginEmail })}
        </Title>

        <Title order={4} mt="1rem" mb="0.2rem">
          {i18n.t("management.class.title")}
        </Title>

        <Accordion>
          <CustomAccordion title={i18n.t("management.class.editClass")}>
            <ClassSessionCreator />
          </CustomAccordion>

          <CustomAccordion title={i18n.t("management.class.gradeSummary")}>
            <GradeSum />
          </CustomAccordion>

          <CustomAccordion title={i18n.t("management.class.seatRecords")}>
            <SeatRecord />
          </CustomAccordion>
        </Accordion>

        <Title order={4} mt="1rem" mb="0.2rem">
          {i18n.t("management.ta.title")}
        </Title>

        <Accordion>
          <CustomAccordion title={i18n.t("management.ta.title")}>
            <TASettings />
          </CustomAccordion>
        </Accordion>
      </Container>
    </Flex>
  );
}
