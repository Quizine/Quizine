import React from 'react'
import {Navbar} from './components'
import Routes from './routes'

//MUI
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const App = () => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#5c6bc0'
      },
      secondary: {
        main: '#c5cae9'
      }
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Routes />
    </ThemeProvider>
  )
}

export default App
