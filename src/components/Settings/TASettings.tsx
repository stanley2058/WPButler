import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Code, Flex, Input, Text } from "@mantine/core";
import FirebaseService from "../../services/FirebaseService";
import { Swal } from "../../services/SweatAlert";
import { useTranslation } from "../../services/I18n";

export default function TASettings() {
  const i18n = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPasswd, setNewPasswd] = useState("");

  const updatePassed = async () => {
    try {
      await FirebaseService.Instance.changePassword(newPasswd);
      await Swal.fire({
        icon: "success",
        title: i18n.t("management.ta.updatePassword"),
        text: i18n.t("management.ta.passwordUpdated"),
      });
      await FirebaseService.Instance.signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: i18n.t("management.ta.updatePassword"),
        text: i18n.t("management.ta.errorOccurred"),
      });
    }
  };
  const addAccount = async () => {
    try {
      await FirebaseService.Instance.createAccount(email);
      await Swal.fire({
        icon: "success",
        title: i18n.t("management.ta.createAccount"),
        text: i18n.t("management.ta.accountCreated"),
      });
      await FirebaseService.Instance.signOut();
      navigate("/login");
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: i18n.t("management.ta.createAccount"),
        text: i18n.t("management.ta.errorOccurred"),
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
        <Input.Wrapper label={i18n.t("management.ta.updatePassword")}>
          <Input
            required
            placeholder={i18n.t("management.ta.newPassword")}
            type="password"
            value={newPasswd}
            onChange={(e) => setNewPasswd(e.target.value)}
          />
        </Input.Wrapper>
        <Button color="red" type="submit">
          {i18n.t("common.update")}
        </Button>
      </form>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addAccount();
        }}
        style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
      >
        <Input.Wrapper label={i18n.t("management.ta.newTAAccount")}>
          <Input
            required
            placeholder={i18n.t("common.emailAddress")}
            type="email"
            value={email}
            onChange={(em) => setEmail(em.target.value)}
          />
        </Input.Wrapper>
        <Button color="indigo" type="submit">
          {i18n.t("common.create")}
        </Button>
        <Text fs="italic" fz="sm">
          {i18n.t("management.ta.defaultPassword.1")}
          <Code>soselab401</Code>
          {i18n.t("management.ta.defaultPassword.2")}
        </Text>
      </form>
    </Flex>
  );
}
