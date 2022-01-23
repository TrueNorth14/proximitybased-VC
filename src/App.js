import React, { useReducer } from 'react';
import Login from './components/Login';
// import ChatRoom from './components/ChatRoom/ChatRoom';
import MyAppBar from './components/MyAppBar';
import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Room from './components/VoiceChatRoom/Room';


// const theme = createMuiTheme({
//   palette: {
//     type: "dark"
//   }
// })

const light = {
  palette: {
    type: "light"
  }
}

const dark = {
  palette: {
    type: "dark"
  }
}

const initialState = {
  name: "default",
  isEntered: false
};

const reducer = (state, { field, value }) => {
  return {
    ...state,
    [field]: value
  }
}

const App = () => {

  const [state, dispatch] = useReducer(reducer, initialState);

  const { name, isEntered, theme } = state;

  const appliedTheme = createMuiTheme(theme ? light : dark);

  const onChangeName = (e) => {
    dispatch({ field: "name", value: e.target.value });
    console.log({ name });
  }

  const onChangeEntered = (e) => {
    dispatch({ field: "isEntered", value: e });
  }

  const onChangeTheme = () => {
    dispatch({ field: "theme", value: !theme });
  }

  

  return (
    <div>
      {/* <Sketch setup={setup} draw={draw} /> */}
      <ThemeProvider theme={appliedTheme}>
        <CssBaseline />
        <MyAppBar themeHandler={onChangeTheme} />
        {isEntered ? <Room name={name} enterHandler={onChangeEntered} /> :
          <Login states={{ name, isEntered }} stateFunctions={{ onChangeName, onChangeEntered }} />}
      </ThemeProvider>
    </div>
  );
}

export default App;
