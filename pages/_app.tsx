import type { AppProps } from 'next/app'
import 'bootstrap-icons/font/bootstrap-icons.css'; // Adicione esta linha
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
