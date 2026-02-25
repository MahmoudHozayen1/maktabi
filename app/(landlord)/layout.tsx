import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

export default async function LandlordLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/login');
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white text-gray-900">{children}</main>
            <Footer />
        </>
    );
}