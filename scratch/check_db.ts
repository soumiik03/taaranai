import 'dotenv/config'
import { prisma } from '../lib/db'

async function check() {
  const requests = await prisma.featureRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { clarificationQuestions: true, prd: true },
  })
  console.log(JSON.stringify(requests, null, 2))
}

check().catch(console.error)
