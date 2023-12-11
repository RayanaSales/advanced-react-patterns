// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.js

import * as React from 'react'
import {Switch} from '../switch'

/**
 * this component is helping us to share the context btw the App component.
 * THIS IS THE MOST IMPORTATE USE CASE FOR THE PATTERN.
 * if you are dealing with immediate kids on the tree, you don't need that.
 * but if you wanna go further, go with that.
 */
const ToggleContext = React.createContext()
// this is just to make more readable on the Components React DEVops console.
ToggleContext.displayName = 'ToggleContext'

function Toggle({children}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  const value = {on, toggle}
  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {children}
    </ToggleContext.Provider>
  )
}
function useToggle() {
  const context = React.useContext(ToggleContext)

  if (!context) {
    throw new Error(`useToggle must be used within a <Toggle />`)
  }
  return context
}

function ToggleOn({children}) {
  const {on} = useToggle()
  return on ? children : null
}

function ToggleOff({children}) {
  const {on} = useToggle()
  return on ? null : children
}

function ToggleButton(props) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
