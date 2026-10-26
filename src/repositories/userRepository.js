import prisma from "@/lib/prisma";

const SAFE_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

const userRepository = {
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: SAFE_USER_SELECT,
    });
  },

  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findAll() {
    return prisma.user.findMany({
      where: { isActive: true },
      select: SAFE_USER_SELECT,
      orderBy: { name: "asc" },
    });
  },

  async create({ email, name, passwordHash, role }) {
    return prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        ...(role ? { role } : {}),
      },
      select: SAFE_USER_SELECT,
    });
  },

  async update(id, data) {
    return prisma.user.update({
      where: { id },
      data,
      select: SAFE_USER_SELECT,
    });
  },

  async deactivate(id) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: SAFE_USER_SELECT,
    });
  },
};

export default userRepository;
