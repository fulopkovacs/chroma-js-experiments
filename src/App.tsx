import GUI from 'lil-gui'
import {useLayoutEffect, useState} from 'react'
import './App.css'
import chroma from 'chroma-js'

const defaultColor = '#fff'
const gui = new GUI()
// load gui state if it was saved
const guiStateObject = 'lil-gui-state'
gui.onFinishChange(() => {
  localStorage.setItem(guiStateObject, JSON.stringify(gui.save()))
})

function ColorSpot({color}: {color: string}) {
  return (
    <div className="color-spot" style={{background: color}}>
      <span
        className="color-label"
        style={{color: chroma(color).hcl()[2] > 50 ? '#000' : '#fff'}}
      >
        {color}
      </span>
    </div>
  )
}

function App() {
  const [primaryColor, setPrimaryColor] = useState<string>(defaultColor)
  const [complementerColor, setComplementerColor] = useState<string>(
    getComplementerColor(defaultColor),
  )

  function getComplementerColor(originalColor: string): string {
    const [originalHue, s, l] = chroma(originalColor).hsl()
    const complementerColor = chroma.hsl(originalHue + 180, s, l).hex()

    return complementerColor
  }
  useLayoutEffect(() => {
    // `useLayoutEffect` is executed twice
    // because of `React.StrictMode`
    if (
      !gui.children.find((x) => {
        const prop = x as unknown as {property?: string}
        return prop?.property === 'primary'
      })
    ) {
      gui
        .addColor({primary: defaultColor}, 'primary')
        .onChange((newPrimaryColor: string) => {
          setPrimaryColor(newPrimaryColor)
          setComplementerColor(getComplementerColor(newPrimaryColor))
        })
      const guiObjString = localStorage.getItem(guiStateObject)
      if (guiObjString) {
        const guiObj = JSON.parse(guiObjString)
        gui.load(guiObj)

        // Reset saved state
        const guiParams = {
          resetState: () => {
            localStorage.removeItem(guiStateObject)

            location.reload()
          },
        }
        gui.add(guiParams, 'resetState')
      }
    }
  }, [])

  return (
    <div className="App">
      <h1>
        Complementer Colors with <code>Chroma.js</code>
      </h1>
      <div className="colors-container">
        <ColorSpot color={primaryColor} />
        <ColorSpot color={complementerColor} />
      </div>
    </div>
  )
}

export default App
