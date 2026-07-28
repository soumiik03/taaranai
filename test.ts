const { PrismaClient } = require('./lib/generated/prisma');
const prisma = new PrismaClient();
async function main() {
  const req = await prisma.featureRequest.findUnique({
    where: {id: 'cms4cses80000qourqhtn4t3o'}, 
    include: {clarificationQuestions: true, prd: true}
  });
  console.log(JSON.stringify(req, null, 2));
}
main().finally(() => prisma.$disconnect());
