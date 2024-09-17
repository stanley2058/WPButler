import React from "react";
import {
  SiReact as ReactJs,
  SiVite as Vite,
  SiTypescript as Typescript,
  SiMantine as Mantine,
  SiGithub as Github,
  SiGooglefonts as Googlefonts,
  SiFirebase as Firebase,
} from "@icons-pack/react-simple-icons";
import { Flex, Card, Title, Text, Button, Space } from "@mantine/core";

const imgList = [
  {
    src: "react",
    img: <ReactJs color="#61DAFB" size={36} />,
    url: "https://react.dev/",
  },
  {
    src: "material-ui",
    img: <Mantine color="#339AF0" size={36} />,
    url: "https://mantine.dev/",
  },
  {
    src: "firebase",
    img: <Firebase color="#FFCA28" size={36} />,
    url: "https://firebase.google.com/",
  },
  {
    src: "google-fonts",
    img: <Googlefonts color="#4285F4" size={36} />,
    url: "https://fonts.google.com/",
  },
  {
    src: "vite",
    img: <Vite color="#646CFF" size={36} />,
    url: "https://vitejs.dev/",
  },
  {
    src: "typescript",
    img: <Typescript color="#3178C6" size={36} />,
    url: "https://www.typescriptlang.org/",
  },
];

export default function About() {
  return (
    <Flex justify="center" align="center" p="md">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Card.Section>
          <Title order={4}>關於本站</Title>
          <Space h="md" />

          <Text>
            網頁程式設計助教系統，作為課程作業demo輔助，使用 React 開發。
          </Text>
          <Space h="sm" />

          <Flex justify="center" align="center" gap="0.5rem">
            {imgList.map((img) => (
              <a key={img.src} href={img.url} target="_blank">
                {img.img}
              </a>
            ))}
          </Flex>
        </Card.Section>
        <Button
          component="a"
          href="https://github.com/stanley2058/WPButler"
          size="sm"
          target="_blank"
          leftSection={<Github color="#181717" size={16} />}
          variant="subtle"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          GitHub
        </Button>
      </Card>
    </Flex>
  );
}
