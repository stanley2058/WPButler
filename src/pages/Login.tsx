import React, { type FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, Title, Flex } from "@mantine/core";
import FirebaseService from "../services/FirebaseService";
import { Swal } from "../services/SweatAlert";
import { getTranslation, useTranslation } from "../services/I18n";

function fireError() {
  const i18n = getTranslation();
  return Swal.fire({
    icon: "error",
    title: i18n.t("login.loginFailed"),
    text: i18n.t("login.loginFailedDesc"),
  });
}

export default function Login() {
  const i18n = useTranslation();
  const navigate = useNavigate();
  (async () => {
    if (await FirebaseService.Instance.hasLogin) navigate("/settings");
  })();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const login = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();

    FirebaseService.Instance.signIn(
      emailRef.current!.value,
      passwordRef.current!.value,
    )
      .then((res) => {
        if (!res) throw new Error("login failed");
        navigate("/settings");
      })
      .catch(() => fireError());
  };

  return (
    <Flex justify="center" align="center" pos="relative" top="3rem">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Flex
          component="form"
          direction="column"
          autoComplete="off"
          onSubmit={(e) => login(e)}
          gap="0.5rem"
        >
          <Title order={3}>{i18n.t("login.taLogin")}</Title>
          <Input.Wrapper label={`${i18n.t("common.emailAddress")}*`}>
            <Input
              ref={emailRef}
              required
              variant="filled"
              placeholder={i18n.t("common.emailAddress")}
              type="email"
              name="email"
            />
          </Input.Wrapper>
          <Input.Wrapper label={`${i18n.t("login.password")}*`}>
            <Input
              ref={passwordRef}
              required
              variant="filled"
              placeholder={i18n.t("login.password")}
              type="password"
              name="password"
            />
          </Input.Wrapper>
          <Flex justify="center" align="center" mt="1rem">
            <Button color="indigo" type="submit">
              {i18n.t("login.login")}
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
