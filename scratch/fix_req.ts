import { prisma } from '../lib/db'

async function main() {
  const req = await prisma.featureRequest.update({
    where: { id: "cms4uqr2a00006sur7g4f2ule" },
    data: { status: 'CLARIFYING' }
  })
  console.log('Fixed feature request state:', req.id)
}

main().catch(console.error).finally(() => prisma.$disconnect())
