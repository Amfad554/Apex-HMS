const { PrismaClient } = require('@prisma/client');

// Initialize the Prisma Client
const prisma = new PrismaClient();

module.exports = prisma;