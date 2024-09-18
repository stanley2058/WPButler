import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Space, Title, Flex } from "@mantine/core";
import { IconBook2, IconInfoCircle, IconSchool } from "@tabler/icons-react";

export default function Home() {
  const navigate = useNavigate();
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
              課程助教系統
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
              Tronclass
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
              前往教室
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
              關於本站
            </Button>
          </Button.Group>
        </Card>
      </Flex>
    </Flex>
  );
}
