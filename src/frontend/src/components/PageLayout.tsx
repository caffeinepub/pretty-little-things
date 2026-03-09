import { Footer } from "./Footer";
import { Navigation } from "./Navigation";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function PageLayout({ children, className = "" }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navigation />
      <main className={`flex-1 page-content ${className}`}>{children}</main>
      <div className="page-content">
        <Footer />
      </div>
    </div>
  );
}
