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
    this.time += delta * 0.005; // velocidade
    this.drawMar(this.time);
  }

  private drawMar(t: number) {
    this.marGraphics.clear();

    const step = 6; // aumentar pra reduzir custo
    const scale = 0.015;
    const baseColorDeep = { r: 0, g: 31, b: 63 };
    const baseColorLight = { r: 0, g: 191, b: 255 };

    // percorre e desenha o mar
    for (let y = 0; y < this.heightTotal; y += step) {
      for (let x = 0; x < this.widthTotal; x += step) {
        // ruído 3D com tempo
        const n = this.noise(x * scale, y * scale, t * 0.9);

        const normalized = (n + 1) / 2;
        const r = baseColorDeep.r + (baseColorLight.r - baseColorDeep.r) * normalized;
        const g = baseColorDeep.g + (baseColorLight.g - baseColorDeep.g) * normalized;
        const b = baseColorDeep.b + (baseColorLight.b - baseColorDeep.b) * normalized;

        const color = (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b);

        // novo padrão Pixi v8
        this.marGraphics
          .rect(x, y, step, step)
          .fill(color);
      }
    }
  }
}
