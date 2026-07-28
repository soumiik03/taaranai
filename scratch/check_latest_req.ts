import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const reqs = await prisma.featureRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
    include: {
      clarificationQuestions: true,
      prd: true
    }
  })
  console.dir(reqs, { depth: null })
}

main().catch(console.error).finally(() => prisma.$disconnect())
