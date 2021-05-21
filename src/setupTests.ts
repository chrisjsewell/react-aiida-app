// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// required after adding react-three
// https://stackoverflow.com/questions/64558062/how-to-mock-resizeobserver-to-work-in-unit-tests-using-react-testing-library
import observer from 'resize-observer-polyfill'
global.ResizeObserver = observer
// see https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function
global.URL.createObjectURL = jest.fn()
