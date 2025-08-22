import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen font-poppins antialiased">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
