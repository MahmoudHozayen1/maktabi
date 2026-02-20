import 'next-auth';

type UserRole = 'VISITOR' | 'RENTER' | 'INVESTOR' | 'LANDLORD_MARKETING' | 'LANDLORD_MANAGED' | 'ADMIN' | 'OWNER';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            email: string;
            name: string;
            image?: string;
            role: UserRole;
        };
    }

    interface User {
        role: UserRole;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: UserRole;
    }
}