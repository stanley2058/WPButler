import React, { FormEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, Title, Flex } from "@mantine/core";
import Swal from "sweetalert2";
import FirebaseService from "../services/FirebaseService";

function fireError() {
  return Swal.fire({
    icon: "error",
    title: "登入失敗",
    text: "帳號或密碼錯誤",
  });
}

export default function Login() {
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
          <Title order={3}>助教登入</Title>
          <Input.Wrapper label="信箱*">
            <Input
              ref={emailRef}
              required
              variant="filled"
              placeholder="信箱"
              type="email"
              name="email"
            />
          </Input.Wrapper>
          <Input.Wrapper label="密碼*">
            <Input
              ref={passwordRef}
              required
              variant="filled"
              placeholder="密碼"
              type="password"
              name="password"
            />
          </Input.Wrapper>
          <Flex justify="center" align="center" mt="1rem">
            <Button color="indigo" type="submit">
              登入
            </Button>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
}
