import { createMuiTheme } from '@material-ui/core';
const theme = createMuiTheme({
  palette: {
    // color pallet
    // https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=1976D2
    primary: {
      light: '#63a4ff',
      main: '#1976d2',
      dark: '#004ba0',
      contrastText: '#fff',
    },
  },
});
export default theme;
