import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Code, Flex, Input, Text } from "@mantine/core";
import FirebaseService from "../../services/FirebaseService";
import { Swal } from "../../services/SweatAlert";

export default function TASettings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPasswd, setNewPasswd] = useState("");

  const updatePassed = async () => {
    try {
      await FirebaseService.Instance.changePassword(newPasswd);
      await Swal.fire({
        icon: "success",
        title: "更新密碼",
        text: "成功更新密碼，請重新登入。",
      });
      await FirebaseService.Instance.signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "更新密碼",
        text: "發生錯誤，請參考瀏覽器Console。",
      });
    }
  };
  const addAccount = async () => {
    try {
      await FirebaseService.Instance.createAccount(email);
      await Swal.fire({
        icon: "success",
        title: "建立帳號",
        text: "成功建立新助教帳號，請重新登入。",
      });
      await FirebaseService.Instance.signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "建立帳號",
        text: "發生錯誤，請參考瀏覽器Console。",
      });
    }
  };

  return (
    <Flex direction="column" gap="1rem">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updatePassed();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <Input.Wrapper label="更新密碼">
          <Input
            required
            placeholder="新密碼"
            type="password"
            value={newPasswd}
            onChange={(e) => setNewPasswd(e.target.value)}
          />
        </Input.Wrapper>
        <Button color="red" type="submit">
          更新
        </Button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addAccount();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <Input.Wrapper label="新增助教">
          <Input
            required
            placeholder="信箱"
            type="email"
            value={email}
            onChange={(em) => setEmail(em.target.value)}
          />
        </Input.Wrapper>
        <Button color="indigo" type="submit">
          新增
        </Button>
        <Text fs="italic" fz="sm">
          *新帳號預設密碼為 <Code>soselab401</Code> 登入後請自行更新密碼。
        </Text>
      </form>
    </Flex>
  );
}
