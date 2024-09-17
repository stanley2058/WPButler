import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppShell,
  Burger,
  Title,
  Text,
  Tooltip,
  Drawer,
  Group,
  Button,
  ThemeIcon,
  Flex,
  Space,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FirebaseService from "../services/FirebaseService";
import {
  IconBook2,
  IconInfoCircle,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";

const entries = [
  {
    name: "教室",
    path: "/classroom",
    icon: <IconBook2 />,
  },
  {
    name: "助教管理",
    path: "/settings",
    icon: <IconSettings />,
  },
  {
    name: "關於本站",
    path: "/about",
    icon: <IconInfoCircle />,
  },
];

export default function Header() {
  const navigate = useNavigate();
  const [hasLogin, setLogin] = useState(false);
  const [opened, { toggle }] = useDisclosure();
  useEffect(() => FirebaseService.Instance.onAuthStateChanged(setLogin), []);

  return (
    <AppShell.Header bg="indigo" pos="relative">
      <Group h="100%" px="sm" c="white">
        <Burger opened={opened} color="white" onClick={toggle} size="sm" />
        <Tooltip label="回首頁">
          <Title
            order={3}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            Demo Butler
          </Title>
        </Tooltip>

        <Drawer
          opened={opened}
          onClose={toggle}
          size="15rem"
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
        >
          <NavList hasLogin={hasLogin} />
        </Drawer>
      </Group>
    </AppShell.Header>
  );
}

function NavList(props: { hasLogin: boolean }) {
  const navigate = useNavigate();
  return (
    <Flex direction="column">
      {entries.map((entry) => (
        <Button
          key={entry.name}
          w="100%"
          justify="start"
          color="dark"
          variant="subtle"
          size="md"
          onClick={() => navigate(entry.path)}
        >
          <ThemeIcon c="dark" variant="transparent">
            {entry.icon}
          </ThemeIcon>
          <Space w="sm" />
          <Text>{entry.name}</Text>
        </Button>
      ))}
      {props.hasLogin && (
        <Button
          key="logout"
          w="100%"
          justify="start"
          color="red"
          variant="subtle"
          size="md"
          onClick={() => {
            FirebaseService.Instance.signOut().then(() => {
              navigate("/");
            });
          }}
        >
          <ThemeIcon c="red" variant="transparent">
            <IconLogout />
          </ThemeIcon>
          <Space w="sm" />
          <Text>登出</Text>
        </Button>
      )}
    </Flex>
  );
}
