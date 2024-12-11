import "./App.css";
import "@radix-ui/themes/styles.css";
import Navigator from "./components/Navigator";
import Layout from "./components/Layout";
import { screens } from "./constants/constants";
import { AppProvider } from "./context/AppProvider";

const App = () => {
  return (
    <AppProvider>
      <Layout>
        <Navigator screens={screens} />
      </Layout>
    </AppProvider>
  );
};

export default App;
