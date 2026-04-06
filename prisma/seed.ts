import { prisma } from '@/lib/prisma'

async function main() {
  console.log('Seeding database...')

  // Create sample players
  const players = await Promise.all([
    prisma.player.create({
      data: {
        name: 'John Smith',
        whatsappName: 'John',
        primaryPosition: 'GK',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Mike Johnson',
        whatsappName: 'Mike',
        primaryPosition: 'DEF',
        secondaryPosition: 'MID',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'David Williams',
        whatsappName: 'Dave',
        primaryPosition: 'DEF',
        foot: 'LEFT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Chris Brown',
        whatsappName: 'Chris',
        primaryPosition: 'MID',
        secondaryPosition: 'DEF',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Tom Davis',
        whatsappName: 'Tom',
        primaryPosition: 'MID',
        foot: 'BOTH',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Alex Wilson',
        whatsappName: 'Alex',
        primaryPosition: 'FWD',
        secondaryPosition: 'MID',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'James Miller',
        whatsappName: 'Jim',
        primaryPosition: 'FWD',
        foot: 'LEFT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Sam Taylor',
        whatsappName: 'Sam',
        primaryPosition: 'GK',
        secondaryPosition: 'DEF',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Ryan Anderson',
        whatsappName: 'Ryan',
        primaryPosition: 'DEF',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Matt Thomas',
        whatsappName: 'Matt',
        primaryPosition: 'MID',
        secondaryPosition: 'FWD',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Dan Jackson',
        whatsappName: 'Dan',
        primaryPosition: 'FWD',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Ben White',
        whatsappName: 'Ben',
        primaryPosition: 'MID',
        foot: 'LEFT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Luke Harris',
        whatsappName: 'Luke',
        primaryPosition: 'DEF',
        secondaryPosition: 'MID',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Nick Martin',
        whatsappName: 'Nick',
        primaryPosition: 'FWD',
        foot: 'RIGHT',
      },
    }),
    prisma.player.create({
      data: {
        name: 'Oliver Thompson',
        whatsappName: 'Oli',
        primaryPosition: 'MID',
        foot: 'BOTH',
      },
    }),
  ])

  console.log(`Created ${players.length} players`)

  // Create a sample match
  const match = await prisma.match.create({
    data: {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      opponent: 'Friendly vs Local Rivals',
      pitchName: 'Central Park Pitch',
      sideSize: 7,
      matchPlayers: {
        create: players.map((player) => ({
          playerId: player.id,
          isAvailable: Math.random() > 0.2, // 80% availability
        })),
      },
    },
  })

  console.log(`Created match: ${match.opponent}`)

  // Create a completed match with stats
  const completedMatch = await prisma.match.create({
    data: {
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      opponent: 'Friendly vs Neighbors FC',
      pitchName: 'North Field',
      sideSize: 7,
      isComplete: true,
      matchPlayers: {
        create: players.slice(0, 14).map((player, index) => ({
          playerId: player.id,
          isAvailable: true,
          played: true,
          team: index < 7 ? 'WHITE' : 'BLACK',
          goals: Math.floor(Math.random() * 3),
          assists: Math.floor(Math.random() * 2),
          defensiveActions: Math.floor(Math.random() * 8),
          motmVotes: index === 2 ? 3 : index === 5 ? 2 : index === 8 ? 1 : 0,
          teamGD: index < 7 ? 2 : -2,
        })),
      },
    },
  })

  console.log(`Created completed match: ${completedMatch.opponent}`)
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
