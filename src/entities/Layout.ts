import { GridSize } from "@material-ui/core";

export default interface ILayout {
  // classroom id
  id: string;
  // display name
  name: string;
  scenes: {
    // top: upper wall while displaying
    top: { element: JSX.Element; width: boolean | GridSize }[];
    // left: left wall while displaying
    left: { element: JSX.Element; width: boolean | GridSize }[];
    // right: right wall while displaying
    right: { element: JSX.Element; width: boolean | GridSize }[];
    // bottom: bottom wall while displaying
    bottom: { element: JSX.Element; width: boolean | GridSize }[];
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
        top: scenes.left,
        left: scenes.bottom,
        right: scenes.top,
        bottom: scenes.right,
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
        left: scenes.top,
        right: scenes.bottom,
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
    const rotated = new Array(m[0].length)
      .fill([])
      .map((e) => new Array(m.length));
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[i].length; j++) {
        rotated[j][i] = m[i][j];
      }
    }
    return rotated;
  }
}
