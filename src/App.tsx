import * as PIXI from "pixi.js";
import { useEffect, useRef } from "react";
import { Mar } from "./background-mar/mar";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const app = new PIXI.Application();

    (async () => {
      await app.init({
        background: "#000000",
        resizeTo: window,
        canvas: canvasRef.current!,
      });

      const mar = new Mar(app.screen.width, app.screen.height);
      mar.init();
      app.stage.addChild(mar);

      // adiciona animação
      app.ticker.add((delta) => {
        mar.update(delta.deltaTime);
      });
    })();
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}
