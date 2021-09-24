import { AuthProvider } from "../contexts/AuthContext";
import "../styles/Home.module.css";

function MyApp({ Component, pageProps }) {
  return (
  <AuthProvider>
      <Component {...pageProps} />
  </AuthProvider>
  );
}

export default MyApp;