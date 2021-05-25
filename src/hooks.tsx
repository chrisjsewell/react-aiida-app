import React, { createContext, useContext, useState } from 'react'
import { ReactElementLike } from 'prop-types'
import { Button, ButtonProps, Snackbar, SnackbarProps } from '@material-ui/core'

/**
 * A wrapper for useState, which syncs the state to local storage,
 * so that it persists through a page change/refresh
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void] {
  // see https://usehooks.com/useLocalStorage/
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}

// Adapted from https://github.com/TeamWertarbyte/material-ui-snackbar-provider

type snackbarMessenger = (
  message: string | ReactElementLike,
  action?: string,
  handleAction?: React.MouseEventHandler<unknown>
) => void

/* eslint-disable @typescript-eslint/no-unused-vars */
function nullSnackbarMessenger(
  message: string | ReactElementLike,
  action?: string,
  handleAction?: React.MouseEventHandler<unknown>
) {
  console.warn('no SnackbarProvider set')
}
/* eslint-disable no-unused-vars */

export const SnackbarContext = createContext(nullSnackbarMessenger as snackbarMessenger)

interface IDefaultSnackbarProps {
  message?: string | ReactElementLike
  action?: React.ReactNode
  ButtonProps: ButtonProps
  SnackbarProps: SnackbarProps
}

function DefaultSnackbar(props: IDefaultSnackbarProps): JSX.Element {
  const child = typeof props.message !== 'string' ? props.message : undefined
  return (
    <Snackbar
      {...props.SnackbarProps}
      message={typeof props.message === 'string' ? props.message || '' : undefined}
      action={
        props.action != null && (
          <Button color="secondary" size="small" {...props.ButtonProps}>
            {props.action}
          </Button>
        )
      }
    >
      {child}
    </Snackbar>
  )
}

interface ISnackbarProviderProps {
  children?: React.ReactNode
  SnackbarComponent: (props: IDefaultSnackbarProps) => JSX.Element
  SnackbarProps?: SnackbarProps
  ButtonProps?: ButtonProps
}

/** A provider to show only a single Snackbar at a time
 *
 * Use together with the useSnackbar hook
 */
export function SnackbarProvider(props: ISnackbarProviderProps): JSX.Element {
  const [state, setState] = useState({ open: false } as {
    open: boolean
    message?: string | ReactElementLike
    action?: string
    handleAction?: React.MouseEventHandler<unknown>
  })
  const showMessage = (
    message: string | ReactElementLike,
    action?: string,
    handleAction?: React.MouseEventHandler<unknown>
  ): void => {
    setState({ open: true, message, action, handleAction })
  }
  const handleClose = (): void => {
    setState({ open: false })
  }
  const handleActionClick = (event: React.MouseEvent<unknown>): void => {
    handleClose()
    if (state.handleAction) {
      state.handleAction(event)
    }
  }

  return (
    <>
      <SnackbarContext.Provider value={showMessage}>
        {props.children}
      </SnackbarContext.Provider>
      <props.SnackbarComponent
        message={state.message}
        action={state.action}
        ButtonProps={{
          ...props.ButtonProps,
          onClick: handleActionClick
        }}
        SnackbarProps={{
          ...props.SnackbarProps,
          open: state.open,
          onClose: handleClose
        }}
      />
    </>
  )
}

SnackbarProvider.defaultProps = {
  SnackbarComponent: DefaultSnackbar
}

/** Return a snackbar messenger
 *
 * Either the one set by SnackbarProvider or a "null" messenger,
 * that will log a warning that no provider has been set
 */
export function useSnackbar(): snackbarMessenger {
  return useContext(SnackbarContext)
}
