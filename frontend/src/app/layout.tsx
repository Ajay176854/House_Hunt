import type { Metadata } from 'next';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'HouseHunt — Buy, Rent & Sell Properties',
    template: '%s | HouseHunt',
  },
  description:
    'Find your dream home with HouseHunt. Browse 50,000+ verified property listings across India — apartments, villas, builder floors, and more. Zero brokerage.',
  keywords: ['real estate', 'property', 'buy', 'rent', 'apartment', 'villa', 'India', 'HouseHunt'],
  openGraph: {
    title: 'HouseHunt — Buy, Rent & Sell Properties',
    description: 'Find the perfect property with HouseHunt.',
    type: 'website',
    siteName: 'HouseHunt',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-rose-500 selection:text-white" suppressHydrationWarning>
        <NextTopLoader color="#e11d48" showSpinner={false} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
