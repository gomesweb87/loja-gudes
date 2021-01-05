import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::after,
  *::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    border: 0;
    outline: none;
  }

  html {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /*pode ser transparent também*/
  }

  html,
  body,
  #root{
    width: 100%;
    height: 100%;
    max-height: 100vh;
    max-width: 100vw;
    position: relative;
    background-color: #e5e5e5;
  }

  

  body, button, input {
    font-family: Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul{
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a{
    color: var(--gray-light);
    text-decoration: none;
  }

/* width */
::-webkit-scrollbar {
  width: 2px;
  height: 4px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 0;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.301);
  border-radius: 0;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.301);
}
`

export default GlobalStyle