import React from 'react'
import {Navbar} from './components'
import Routes from './routes'
import {connect} from 'react-redux'

//MUI
import {ThemeProvider, createMuiTheme} from '@material-ui/core/styles'

const App = props => {
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#5c6bc0'
      },
      secondary: {
        main: '#f57c00'
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

const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  }
}

export default connect(mapState)(App)
