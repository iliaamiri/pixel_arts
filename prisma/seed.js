import { prisma } from './index.js'

async function main() {
    // await prisma.pixel.createMany({
    //     data: makeGrid()
    // });
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })