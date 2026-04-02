// No globals.css import needed — styles are inline per component
import Providers from './providers';

export const metadata = {
  title: 'shashank.app',
  description: 'Personal apps by Shashank',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          html, body { height: 100%; }
          body { -webkit-font-smoothing: antialiased; background: #08070f; }
          a { color: inherit; }
        `}</style>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
