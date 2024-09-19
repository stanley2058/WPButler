export default interface ILayout {
  // classroom id
  id: string;
  // display name
  name: string;
  scenes: {
    // top: upper wall while displaying
    top: { element: JSX.Element; width: "auto" | number }[];
    // left: left wall while displaying
    left: { element: JSX.Element; width: "auto" | number }[];
    // right: right wall while displaying
    right: { element: JSX.Element; width: "auto" | number }[];
    // bottom: bottom wall while displaying
    bottom: { element: JSX.Element; width: "auto" | number }[];
  };
  // 0: space, 1: seat; must be rectangle
  seats: number[][];
}

export class LayoutUtils {
  static rotateClockwise(layout: ILayout): ILayout {
    const { id, name, scenes, seats } = layout;
    return {
      id,
      name,
      scenes: {
        top: [...scenes.left].reverse(),
        left: scenes.bottom,
        right: scenes.top,
        bottom: [...scenes.right].reverse(),
      },
      seats: LayoutUtils.rotateMatrixClockwise(seats),
    };
  }
  static rotateCounterclockwise(layout: ILayout): ILayout {
    const { id, name, scenes, seats } = layout;
    return {
      id,
      name,
      scenes: {
        top: scenes.right,
        left: [...scenes.top].reverse(),
        right: [...scenes.bottom].reverse(),
        bottom: scenes.left,
      },
      seats: LayoutUtils.rotateMatrixCounterclockwise(seats),
    };
  }

  static rotateMatrixClockwise(m: number[][]): number[][] {
    return LayoutUtils.mirrorDiagonalMatrix(m).map((row) => row.reverse());
  }
  static rotateMatrixCounterclockwise(m: number[][]): number[][] {
    return LayoutUtils.mirrorDiagonalMatrix(m).reverse();
  }
  static mirrorDiagonalMatrix(m: number[][]): number[][] {
    if (!m[0]) return [];
    const rotated = new Array(m[0].length)
      .fill([])
      .map(() => new Array(m.length));
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[i]!.length; j++) {
        rotated[j]![i] = m[i]![j];
      }
    }
    return rotated;
  }

  static translateLocationToStandard(
    standardLayout: ILayout,
    rotation: number,
    rotatedRow: number,
    rotatedCol: number,
  ): { row: number; col: number } {
    rotation %= 4;
    let layout = LayoutUtils.layoutToRotation(standardLayout, rotation);
    const rotateFunc =
      rotation > 0
        ? LayoutUtils.rotateCounterclockwise
        : LayoutUtils.rotateClockwise;
    const translateLocationFunc =
      rotation > 0
        ? LayoutUtils.translateLocationCounterclockwise
        : LayoutUtils.translateLocationClockwise;
    for (let i = 0; i < Math.abs(rotation); i++) {
      const coordinates = translateLocationFunc(layout, rotatedRow, rotatedCol);
      layout = rotateFunc(layout);
      rotatedRow = coordinates.row;
      rotatedCol = coordinates.col;
    }
    return { row: rotatedRow, col: rotatedCol };
  }

  static translateLocationToRotation(
    standardLayout: ILayout,
    rotation: number,
    row: number,
    col: number,
  ): { row: number; col: number } {
    rotation %= 4;
    let layout = standardLayout;
    const rotateFunc =
      rotation > 0
        ? LayoutUtils.rotateClockwise
        : LayoutUtils.rotateCounterclockwise;
    const translateLocationFunc =
      rotation > 0
        ? LayoutUtils.translateLocationClockwise
        : LayoutUtils.translateLocationCounterclockwise;
    for (let i = 0; i < Math.abs(rotation); i++) {
      const coordinates = translateLocationFunc(layout, row, col);
      layout = rotateFunc(layout);
      row = coordinates.row;
      col = coordinates.col;
    }
    return { row, col };
  }

  static translateLocationClockwise(
    oriLayout: ILayout,
    row: number,
    col: number,
  ): { row: number; col: number } {
    const height = oriLayout.seats.length;
    return { row: col, col: height - row - 1 };
  }
  static translateLocationCounterclockwise(
    oriLayout: ILayout,
    row: number,
    col: number,
  ): { row: number; col: number } {
    const width = oriLayout.seats[0]!.length;
    return { row: width - col - 1, col: row };
  }

  static layoutToRotation(layout: ILayout, rotation: number): ILayout {
    rotation %= 4;
    if (rotation > 0) {
      // clockwise
      for (let i = 0; i < rotation; i++)
        layout = LayoutUtils.rotateClockwise(layout);
    } else if (rotation < 0) {
      // counterclockwise
      for (let i = 0; i < rotation; i++)
        layout = LayoutUtils.rotateCounterclockwise(layout);
    }
    return layout;
  }
}
