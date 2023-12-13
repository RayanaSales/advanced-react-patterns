// Control Props
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {Switch} from '../switch'
import warning from 'warning'
import {act} from 'react-dom/test-utils'

const callAll =
  (...fns) =>
  (...args) =>
    fns.forEach(fn => fn?.(...args))

const actionTypes = {
  toggle: 'toggle',
  reset: 'reset',
}

function toggleReducer(state, {type, initialState}) {
  switch (type) {
    case actionTypes.toggle: {
      return {on: !state.on}
    }
    case actionTypes.reset: {
      return initialState
    }
    default: {
      throw new Error(`Unsupported type: ${type}`)
    }
  }
}

function useControllSwitchWarning(
  controlPropValue,
  controlPropName,
  componentName,
) {
  const isControlled = controlPropValue != null
  const {current: wasControlled} = React.useRef(isControlled)
  React.useEffect(() => {
    warning(
      !(isControlled && !wasControlled),
      `${componentName} is changing from uncontrolled to control. Check the ${controlPropName} prop.`,
    )
    warning(
      !(!isControlled && wasControlled),
      `${componentName} is changing from control to uncontrolled. Check the ${controlPropName} prop.`,
    )
  }, [componentName, controlPropName, isControlled, wasControlled])
}

function useOnChangeReadOnlyWarning(
  controlPropValue,
  controlPropName,
  componentName,
  hasOnchange,
  readOnly,
  readOnlyProp,
  initialValueProp,
  onChangeProp,
) {
  const isControlled = controlPropValue != null
  React.useEffect(() => {
    warning(
      !(!hasOnchange && isControlled && !readOnly),
      `An on prop was provided to useToggle without an onChange handler. This will result in a read-only ${controlPropName} value. If you want it to be mutable, use ${initialValueProp}. Otherwise, set either ${onChangeProp} or ${readOnlyProp}.`,
    )
  }, [
    controlPropName,
    hasOnchange,
    initialValueProp,
    isControlled,
    onChangeProp,
    readOnly,
    readOnlyProp,
  ])
}

function useToggle({
  initialOn = false,
  reducer = toggleReducer,
  onChange,
  on: controlledOn,
  readOnly = false,
} = {}) {
  const {current: initialState} = React.useRef({on: initialOn})
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const onIsControlled = controlledOn != null
  /**
   * we are asking if the outsider user is controlling (with the `controlledOn`),
   * or if we are in control, if so, we are going to use our internal state -> `state.on`
   */
  const on = onIsControlled ? controlledOn : state.on

  useControllSwitchWarning(controlledOn, 'on', 'useToggle')
  useOnChangeReadOnlyWarning(
    controlledOn,
    'on',
    'useToggle',
    Boolean(onChange),
    readOnly,
    'readOnly',
    'initialOn',
    'onChange',
  )

  // we did this just for adding an onChange hanlder inside
  /* anywhere we are updating the state, we need first to detemrinate where 
  if the state is being controlled we will not update our internal state.
     are we being controlled? Outside or inside? 
     otherwise we will because we are managing ourselfs.
  */
  function dispatchWithOnChange(action) {
    if (!onIsControlled) {
      // we update the componeny ourselfs just if we are in control
      dispatch(action)
    }
    // and for both cases, we suggest a value. We call the onChange function, only if was defined `?.`
    const newState = reducer({...state, on}, action)
    onChange?.(newState, action)
  }
  const toggle = () => dispatchWithOnChange({type: actionTypes.toggle})
  const reset = () =>
    dispatchWithOnChange({type: actionTypes.reset, initialState})

  function getTogglerProps({onClick, ...props} = {}) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps({onClick, ...props} = {}) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function Toggle({on: controlledOn, onChange, readOnly}) {
  const {on, getTogglerProps} = useToggle({
    on: controlledOn,
    onChange,
    readOnly,
  })
  const props = getTogglerProps({on})
  return <Switch {...props} />
}

function App() {
  const [bothOn, setBothOn] = React.useState(false)
  const [timesClicked, setTimesClicked] = React.useState(0)

  function handleToggleChange(state, action) {
    if (action.type === actionTypes.toggle && timesClicked > 4) {
      return
    }
    setBothOn(state.on)
    setTimesClicked(c => c + 1)
  }

  function handleResetClick() {
    setBothOn(false)
    setTimesClicked(0)
  }

  return (
    <div>
      <div>
        {/* these two are controlled, we are providing an outsider value */}
        <Toggle on={bothOn} onChange={handleToggleChange} />
        <Toggle on={bothOn} onChange={handleToggleChange} />
      </div>
      {timesClicked > 4 ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      )}
      <button onClick={handleResetClick}>Reset</button>
      <hr />
      <div>
        {/* this manages his own state */}
        <div>Uncontrolled Toggle:</div>
        <Toggle
        // onChange={(...args) =>
        //   console.info('Uncontrolled Toggle onChange', ...args)
        // }
        />
      </div>
    </div>
  )
}

export default App
// we're adding the Toggle export for tests
export {Toggle}

/*
eslint
  no-unused-vars: "off",
*/
