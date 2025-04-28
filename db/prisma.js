const { PrismaClient } = require('../prisma/db/generated/prisma/client');

const prisma = new PrismaClient()

module.exports = prisma;