import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // ⚠️ CHANGE THESE VALUES
    const email = 'mahmoudottawa2004@gmail.com';
    const name = 'Mahmoud Hozayen';
    const password = 'hoda2004';

    const hashedPassword = await bcrypt.hash(password, 12);

    const owner = await prisma.user.upsert({
        where: { email },
        update: { role: 'OWNER' },
        create: {
            email,
            name,
            password: hashedPassword,
            role: 'OWNER',
        },
    });

    console.log('✅ Owner account created:', owner.email);
    console.log('   Role:', owner.role);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());