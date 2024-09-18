import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Space, Title, Flex } from "@mantine/core";
import { IconBook2, IconInfoCircle, IconSchool } from "@tabler/icons-react";
import { useTranslation } from "../services/I18n";

export default function Home() {
  const navigate = useNavigate();
  const i18n = useTranslation();
  return (
    <Flex justify="center" align="center">
      <Flex
        pos="relative"
        top="6rem"
        justify="center"
        align="center"
        maw="60rem"
      >
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Card.Section mx="xl">
            <Title order={2} ta="center">
              {i18n.t("home.title")}
            </Title>
          </Card.Section>
          <Space h="md" />
          <Button.Group
            orientation="vertical"
            aria-label="navigation buttons"
            variant="text"
          >
            <Button
              component="a"
              href="https://tronclass.ntou.edu.tw/"
              size="sm"
              target="_blank"
              leftSection={<IconSchool />}
              fullWidth
              variant="subtle"
            >
              {i18n.t("home.tronclass")}
            </Button>
            <Button
              component="a"
              href="/classroom"
              size="sm"
              leftSection={<IconBook2 />}
              variant="subtle"
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                navigate("/classroom");
              }}
            >
              {i18n.t("home.classroom")}
            </Button>
            <Button
              component="a"
              href="/about"
              size="sm"
              leftSection={<IconInfoCircle />}
              variant="subtle"
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                navigate("/about");
              }}
            >
              {i18n.t("home.about")}
            </Button>
          </Button.Group>
        </Card>
      </Flex>
    </Flex>
  );
}
