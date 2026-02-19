import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white text-gray-900">{children}</main>
            <Footer />
        </>
    );
}