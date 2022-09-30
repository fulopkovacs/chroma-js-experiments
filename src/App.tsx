import { adjustHue, getLuminance, parseToHsla, toHex } from "color2k";
import GUI from "lil-gui";
import { useLayoutEffect, useState } from "react";
import "./App.css";
// import color2k from "color2k";

const defaultColor = "#ffe771";
const gui = new GUI();
// load gui state if it was saved
const guiStateObject = "lil-gui-state";
gui.onFinishChange(() => {
  localStorage.setItem(guiStateObject, JSON.stringify(gui.save()));
});

function ColorSpot({ color }: { color: string }) {
  const [, , l] = parseToHsla(color);

  return (
    <div className="color-spot" style={{ background: color }}>
      <span
        className="color-label"
        style={{ color: l > 0.5 ? "#000" : "#fff" }}
      >
        {color}
      </span>
    </div>
  );
}

function App() {
  const [primaryColor, setPrimaryColor] = useState<string>(defaultColor);
  const [complementaryColor, setComplementerColor] = useState<string>(
    getComplementerColor(defaultColor)
  );

  function getComplementerColor(originalColor: string): string {
    // const [originalHue, s, l] = chroma(originalColor).hsl();
    const complementaryColor = adjustHue(originalColor, 180);

    return complementaryColor;
  }
  useLayoutEffect(() => {
    // `useLayoutEffect` is executed twice
    // because of `React.StrictMode`
    if (
      !gui.children.find((x) => {
        const prop = x as unknown as { property?: string };
        return prop?.property === "primary";
      })
    ) {
      gui
        .addColor({ primary: defaultColor }, "primary")
        .onChange((newPrimaryColor: string) => {
          setPrimaryColor(newPrimaryColor);
          setComplementerColor(getComplementerColor(newPrimaryColor));
        });
      const guiObjString = localStorage.getItem(guiStateObject);
      if (guiObjString) {
        const guiObj = JSON.parse(guiObjString);
        gui.load(guiObj);

        // Reset saved state
        const guiParams = {
          resetState: () => {
            localStorage.removeItem(guiStateObject);

            location.reload();
          },
        };
        gui.add(guiParams, "resetState");
      }
    }
  }, []);

  return (
    <div className="App">
      <h1>
        Complementary Colors with <code>color2k</code>
      </h1>
      <div className="colors-container">
        <ColorSpot color={primaryColor} />
        <ColorSpot color={toHex(complementaryColor)} />
      </div>
    </div>
  );
}

export default App;
