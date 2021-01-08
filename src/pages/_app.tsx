import React, { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { ThemeProvider as MaterialUIThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from 'styles/theme';
import 'styles/global.css';

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  // const [state, dispatch] = useReducer(postsReducer, initialPostsState);

  useEffect(() => {
    // TODO: any型の解決
    const jssStyles: any = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <MaterialUIThemeProvider theme={theme}>
        <StyledComponentsThemeProvider theme={theme}>
          {/* <PostsContextProvider state={state} dispatch={dispatch}> */}
          <CssBaseline />
          <Component {...pageProps} />
          {/* </PostsContextProvider> */}
        </StyledComponentsThemeProvider>
      </MaterialUIThemeProvider>
    </StylesProvider>
  );
};

export default App;
