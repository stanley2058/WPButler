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
  useMantineColorScheme,
  useComputedColorScheme,
  ActionIcon,
  Popover,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FirebaseService from "../services/FirebaseService";
import {
  IconBook2,
  IconCheck,
  IconInfoCircle,
  IconLanguage,
  IconLogout,
  IconMoonStars,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import { supportedLocales, useLocale, useTranslation } from "../services/I18n";

const entries = [
  {
    nameKey: "header.nav.classroom",
    path: "/classroom",
    icon: <IconBook2 />,
  },
  {
    nameKey: "header.nav.management",
    path: "/settings",
    icon: <IconSettings />,
  },
  {
    nameKey: "header.nav.about",
    path: "/about",
    icon: <IconInfoCircle />,
  },
] as const;

export default function Header() {
  const navigate = useNavigate();
  const [hasLogin, setLogin] = useState(false);
  const [opened, { toggle }] = useDisclosure();
  const i18n = useTranslation();
  useEffect(() => FirebaseService.Instance.onAuthStateChanged(setLogin), []);

  return (
    <AppShell.Header bg="indigo" pos="relative">
      <Flex justify="space-between" align="center" h="100%">
        <Group px="sm" c="white">
          <Burger opened={opened} color="white" onClick={toggle} size="sm" />
          <Tooltip label={i18n.t("header.homeTooltip")}>
            <Title
              order={3}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              Demo Butler
            </Title>
          </Tooltip>
        </Group>
        <Flex direction="row" gap="xs" justify="center" align="center" px="sm">
          <ThemeActionIcon />
          <LanguageActionIcon />
        </Flex>
      </Flex>
      <Drawer
        opened={opened}
        onClose={toggle}
        size="15rem"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <NavList hasLogin={hasLogin} />
      </Drawer>
    </AppShell.Header>
  );
}

function NavList(props: { hasLogin: boolean }) {
  const navigate = useNavigate();
  const colorScheme = useComputedColorScheme();
  const i18n = useTranslation();
  return (
    <Flex direction="column">
      {entries.map((entry) => (
        <Button
          key={entry.nameKey}
          w="100%"
          justify="start"
          color={colorScheme === "light" ? "dark" : "gray"}
          variant="subtle"
          size="md"
          onClick={() => navigate(entry.path)}
        >
          <ThemeIcon
            c={colorScheme === "light" ? "dark" : "gray"}
            variant="transparent"
          >
            {entry.icon}
          </ThemeIcon>
          <Space w="sm" />
          <Text>{i18n.t(entry.nameKey)}</Text>
        </Button>
      ))}
      {props.hasLogin && (
        <Button
          key="logout"
          w="100%"
          justify="start"
          color={colorScheme === "light" ? "red.8" : "orange.6"}
          variant="subtle"
          size="md"
          onClick={() => {
            FirebaseService.Instance.signOut().then(() => {
              navigate("/");
            });
          }}
        >
          <ThemeIcon
            c={colorScheme === "light" ? "red.8" : "orange.6"}
            variant="transparent"
          >
            <IconLogout />
          </ThemeIcon>
          <Space w="sm" />
          <Text>{i18n.t("header.nav.logout")}</Text>
        </Button>
      )}
    </Flex>
  );
}

function ThemeActionIcon() {
  const { setColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme();
  const i18n = useTranslation();
  return (
    <Tooltip
      label={
        colorScheme === "light"
          ? i18n.t("header.nav.darkMode")
          : i18n.t("header.nav.lightMode")
      }
    >
      <ActionIcon
        variant="subtle"
        radius="xl"
        size="lg"
        color="yellow"
        onClick={() =>
          setColorScheme(colorScheme === "light" ? "dark" : "light")
        }
      >
        {colorScheme === "light" && <IconMoonStars />}
        {colorScheme === "dark" && <IconSun />}
      </ActionIcon>
    </Tooltip>
  );
}

function LanguageActionIcon() {
  const colorScheme = useComputedColorScheme();
  const { locale, setLocale } = useLocale();
  const i18n = useTranslation();
  return (
    <Popover position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Tooltip label={i18n.t("header.nav.changeLanguage")}>
          <ActionIcon variant="subtle" radius="xl" size="lg" color="white">
            <IconLanguage />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Flex direction="column" justify="center" align="center">
          {supportedLocales.map((l) => (
            <Button
              pl="xs"
              pr="sm"
              fullWidth
              key={l}
              variant="subtle"
              color={colorScheme === "light" ? "dark" : "white"}
              onClick={() => setLocale(l)}
            >
              <ThemeIcon
                variant="transparent"
                color={colorScheme === "light" ? "dark" : "white"}
                opacity={locale === l ? 1 : 0}
              >
                <IconCheck />
              </ThemeIcon>
              <Space w="sm" />
              {i18n.t("locale", {}, l)}
            </Button>
          ))}
        </Flex>
      </Popover.Dropdown>
    </Popover>
  );
}
