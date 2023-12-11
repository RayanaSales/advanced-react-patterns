// Compound Components
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'
import {Switch} from '../switch'

function Toggle({children}) {
  // 2- this componente renders all the props to us, taking all the children, 
  // and mapping them into new children (cloned from original), 
  // with the additional prop {on, toggle} implicitly
  // at least, it's implicitly from the pesperctive of the user, 
  // but it's explicitly from the perspective of this toggle component.

  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return React.Children.map(children, child => {
    // we add this to prevent other components (like a span) to break our code.
    // this will filter - just functional components can pass.
    if (allowedTypes.includes(child.type)) {
      const newChild = React.cloneElement(child, {on, toggle})
      return newChild
    }
    return child
  })
}

// 1- we trust in faith that we are going to get the props we need for each one of the components.
// some of the props (children) was provided by the users of the component (the component ToggleOn - line 27, 28)
// other props, was provided implicieted by the Toogle component
const ToggleOn = ({on, children}) => (on ? children : null)
const ToggleOff = ({on, children}) => (on ? null : children)
const ToggleButton = ({on, toggle}) => <Switch on={on} onClick={toggle} />

const allowedTypes = [ToggleOn, ToggleOff, ToggleButton]

function MyToggleButton({on, toggle}) {
  return on ? 'check me. I can mess everything' : 'i can steal the Toggle component implementation'
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <span>Hello</span>
        <ToggleButton />
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
