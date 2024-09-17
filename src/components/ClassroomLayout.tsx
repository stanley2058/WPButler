import React, { useEffect, useRef } from "react";
import ILayout from "../entities/Layout";
import { Grid, Container, Flex } from "@mantine/core";
import Seat from "../entities/classroom-objects/Seat";
import Space from "../entities/classroom-objects/Space";
import SelectedSeat from "../entities/classroom-objects/SelectedSeat";

export default function ClassroomLayout(props: {
  layout: ILayout;
  sitting?: { row: number; col: number };
  clickable?: boolean;
}) {
  const centerGridRef = useRef<HTMLDivElement>(null);
  const lGutterRef = useRef<HTMLDivElement>(null);
  const rGutterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lGutterInner = lGutterRef.current?.querySelector<HTMLElement>(
      ".mantine-Grid-inner",
    );
    const rGutterInner = rGutterRef.current?.querySelector<HTMLElement>(
      ".mantine-Grid-inner",
    );
    [lGutterInner, rGutterInner].forEach((e) => {
      if (!e) return;
      e.style.flexDirection = "column";
      e.style.height = "calc(100% + var(--grid-gutter))";
      e.style.width = "auto";
    });
    const centerGridInner = centerGridRef.current?.querySelector<HTMLElement>(
      ".mantine-Grid-inner",
    );
    if (centerGridInner) {
      centerGridInner.style.flexWrap = "nowrap";
    }
  }, [props.layout, props.sitting]);

  return (
    <Container ta="center" p="0" w="100%">
      <Grid gutter={{ base: 0 }}>
        {props.layout.scenes.top.map((e, id) => (
          <Grid.Col key={"top-" + id} span={e.width}>
            {e.element}
          </Grid.Col>
        ))}
      </Grid>

      <Grid
        ref={centerGridRef}
        gutter={{ base: 0 }}
        style={{ overflow: "auto" }}
      >
        <Grid.Col span={1}>
          <Grid
            ref={lGutterRef}
            gutter={{ base: 0 }}
            justify="center"
            align="center"
            h="100%"
          >
            {props.layout.scenes.left.map((e, id) => (
              <Grid.Col
                key={"left-" + id}
                span={e.width}
                w="100%"
                maw="100%"
                mah="100%"
                style={{ writingMode: "vertical-lr" }}
              >
                {e.element}
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>

        <Grid.Col
          span="auto"
          style={{
            flexShrink: 0,
            width: "fit-content",
            maxWidth: "unset",
          }}
        >
          <Flex
            direction="column"
            p="1rem"
            style={{ width: "fit-content", minWidth: "100%" }}
          >
            {props.layout.seats.map((row, id) => (
              <Flex
                key={"row-" + id}
                justify="space-evenly"
                style={{ width: "fit-content", minWidth: "100%" }}
              >
                {row.map((s, sid) => {
                  if (
                    props.sitting &&
                    props.sitting.row === id &&
                    props.sitting.col === sid
                  ) {
                    return (
                      <SelectedSeat hasLogin={!props.clickable} key={sid} />
                    );
                  }
                  return s ? (
                    <Seat
                      row={id}
                      col={sid}
                      color={s}
                      clickable={props.clickable}
                      key={sid}
                    />
                  ) : (
                    <Space key={sid} />
                  );
                })}
              </Flex>
            ))}
          </Flex>
        </Grid.Col>

        <Grid.Col span={1}>
          <Grid
            ref={rGutterRef}
            gutter={{ base: 0 }}
            justify="center"
            align="center"
            h="100%"
          >
            {props.layout.scenes.right.map((e, id) => (
              <Grid.Col
                key={"right-" + id}
                span={e.width}
                w="100%"
                maw="100%"
                mah="100%"
                style={{ writingMode: "vertical-lr" }}
              >
                {e.element}
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>

      <Grid gutter={{ base: 0 }}>
        {props.layout.scenes.bottom.map((e, id) => (
          <Grid.Col key={"bottom-" + id} span={e.width}>
            {e.element}
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}
