import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient()

const main = async () => {
  const islandsAlreadyDefined = await prisma.island.count();
  if (islandsAlreadyDefined > 0) {
    console.info('Predefined choices already initialized. Skipping seeding.');
    return
  }
  await prisma.island.createManyAndReturn({
    data: [
      { id: uuidv4(), name: 'Kri' },
      { id: uuidv4(), name: 'Mansuar' },
      { id: uuidv4(), name: 'Batanta' },
      { id: uuidv4(), name: 'Friwen' },
      { id: uuidv4(), name: 'Gam' },
      { id: uuidv4(), name: 'Arborek' },
      { id: uuidv4(), name: 'Rufas' },
      { id: uuidv4(), name: 'Pam' },
      { id: uuidv4(), name: 'Fam' },
    ],
    skipDuplicates: true,
  });
  console.log('Seeding finished.');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.log({error});
    await prisma.$disconnect()
    process.exit(1);
  })
