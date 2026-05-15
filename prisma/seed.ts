// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt'
const prisma = new PrismaClient();

async function main() {
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash('Mibebecito10', salt)

    // Example: Creating a user
    const user = await prisma.user.upsert({
        where: { email: 'flbertojgsoto@gmail.com' },
        update: {},
        create: {
            email: 'flbertojgsoto@gmail.com',
            name: 'albrtwors',
            password: hashed,
            role: 'ADMIN'

        },
    });

    console.log({ user });
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
