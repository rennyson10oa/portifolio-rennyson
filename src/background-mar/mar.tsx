import * as PIXI from 'pixi.js';
import { createNoise3D } from 'simplex-noise';

export class Mar extends PIXI.Container {
  private marGraphics: PIXI.Graphics;
  private widthTotal: number;
  private heightTotal: number;
  private noise: ReturnType<typeof createNoise3D>;
  private time: number = 0;

  constructor(width: number, height: number) {
    super();
    this.widthTotal = width;
    this.heightTotal = height;

    this.marGraphics = new PIXI.Graphics();
    this.addChild(this.marGraphics);

    this.noise = createNoise3D();
  }

  public init() {
    this.drawMar(0);
  }

  public update(delta: number) {
    this.time += delta * 0.005;
    this.drawMar(this.time);
  }

  private drawMar(t: number) {
    this.marGraphics.clear();

    const step = 6;
    const scaleBase = 0.02; // base da escala do ruído
    const baseColorDeep = { r: 0, g: 31, b: 63 };
    const baseColorLight = { r: 0, g: 191, b: 255 };

    for (let y = 0; y < this.heightTotal; y += step) {
      const yRatio = y / this.heightTotal;

      // 🔹 aplica perspectiva apenas no ruído (não na largura desenhada)
      const perspectiveScale = scaleBase * (0.4 + Math.pow(yRatio, 2.5) * 2.2);

      for (let x = 0; x < this.widthTotal; x += step) {
        // usa perspectiva no cálculo do ruído
        const n = this.noise(
          x * perspectiveScale,
          y * perspectiveScale,
          t * 0.9
        );

        const normalized = (n + 1) / 2;
        const r =
          baseColorDeep.r +
          (baseColorLight.r - baseColorDeep.r) * normalized;
        const g =
          baseColorDeep.g +
          (baseColorLight.g - baseColorDeep.g) * normalized;
        const b =
          baseColorDeep.b +
          (baseColorLight.b - baseColorDeep.b) * normalized;

        const color =
          (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b);

        // 🔹 desenha normalmente ocupando todo o width
        this.marGraphics.rect(x, y, step, step).fill(color);
      }
    }
  }
}
