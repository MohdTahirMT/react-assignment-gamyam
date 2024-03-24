import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import ListOfLands from "./Pages/ListOfLands";

function App() {
  const theme = createTheme({});

  return (
    <MantineProvider theme={theme}>
      <ListOfLands />
    </MantineProvider>
  );
}

export default App;
