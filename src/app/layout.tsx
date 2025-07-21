import type { Metadata } from 'next';
import { ABeeZee } from 'next/font/google';
import '../styles/globals.css';

const abeezee = ABeeZee({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-abeezee',
});

export const metadata: Metadata = {
  title: 'Bubika - Create Magical Stories for Your Children',
  description:
    "Create personalized, illustrated children's stories in seconds with AI. Create unique tales featuring your child's favorite characters and spark their imagination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${abeezee.variable} font-abeezee antialiased`}>
        {children}
      </body>
    </html>
  );
}
