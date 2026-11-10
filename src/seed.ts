import { prisma } from './lib/prisma';
import { Role, Condition } from '@prisma/client';
import { hash } from 'bcrypt';
import * as config from '../config/settings.development.json';

async function main() {
  console.log('Seeding the database');
  // Supply private passwords in the environment where this script runs.
  // Validate every required value before making any database writes.
  const accounts = config.defaultAccounts.map((account) => {
    const passwordKey = account.role === Role.ADMIN
      ? 'SEED_ADMIN_PASSWORD'
      : 'SEED_USER_PASSWORD';
    const rawPassword = process.env[passwordKey];
    if (!rawPassword || !rawPassword.trim()) {
      throw new Error(`Missing required environment variable: ${passwordKey}`);
    }
    return { account, rawPassword };
  });

  for (const { account, rawPassword } of accounts) {
    const password = await hash(rawPassword, 10);
    const role = account.role as Role || Role.USER;
    console.log(`  Creating user: ${account.email} with role: ${role}`);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        email: account.email,
        password,
        role,
      },
    });
  }
  for (const data of config.defaultData) {
    const condition = data.condition as Condition || Condition.good;
    console.log(`  Adding stuff: ${JSON.stringify(data)}`);
     
    await prisma.stuff.upsert({
      where: { id: config.defaultData.indexOf(data) + 1 },
      update: {},
      create: {
        name: data.name,
        quantity: data.quantity,
        owner: data.owner,
        condition,
      },
    });
  }
}
main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
