import { Outfit } from 'next/font/google';
import ThemeProvider from '@/components/theme/ThemeProvider';


const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-outfit',
});

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
     
      <div className={`${outfit.variable} font-sans`} style={{ fontFamily: 'var(--font-outfit)' }}>
        {children}
      </div>
    </ThemeProvider>
  );
}