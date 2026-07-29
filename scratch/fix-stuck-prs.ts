// Reset review run count for PR #6 so we can test the new AI reviewer
import { config } from 'dotenv'
config({ path: '.env' })

async function main() {
  const { prisma } = await import('../lib/db')

  // Reset PR #6's review counter and clear old review runs
  const pr = await prisma.pullRequest.findFirst({
    where: { number: 6 },
  })

  if (!pr) {
    console.log('PR #6 not found')
    return
  }

  console.log(`Found PR #${pr.number} (${pr.title}), reviewRunCount=${pr.reviewRunCount}`)

  // Delete old review runs and their issues so the AI starts fresh
  await prisma.reviewRun.deleteMany({
    where: { pullRequestId: pr.id },
  })

  // Reset the counter and set status to REVIEWING
  await prisma.pullRequest.update({
    where: { id: pr.id },
    data: {
      reviewRunCount: 0,
      status: 'REVIEWING',
    },
  })

  console.log('Reset reviewRunCount to 0, deleted old review runs, status set to REVIEWING')
  console.log('Now push a commit to the PR or use the "Run AI Review Now" button to trigger a fresh review.')

  await prisma.$disconnect()
}

main().catch(console.error)
