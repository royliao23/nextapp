import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Header />
          <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}