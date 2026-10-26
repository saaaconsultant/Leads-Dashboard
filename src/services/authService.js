import userRepository from "@/repositories/userRepository";
import { hashPassword, verifyPassword } from "@/lib/auth";

const authService = {
  async login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    const DUMMY_HASH =
      "0000000000000000:0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";

    const isValid = verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !isValid) {
      throw new Error("Invalid email or password.");
    }

    if (!user.isActive) {
      throw new Error(
        "Your account has been deactivated. Please contact your administrator.",
      );
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  },

  async createUser({ email, name, password, role }) {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const validRoles = ["EMPLOYEE", "COMPLIANCE", "TEAM_LEAD", "ADMIN"];

    if (!normalizedEmail || !normalizedName || !password || !role) {
      throw new Error(
        "Name, email, password, and role are required to create a user.",
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Enter a valid email address.");
    }
    if (typeof password !== "string" || password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    if (!validRoles.includes(role)) {
      throw new Error("Select a valid user role.");
    }

    const passwordHash = hashPassword(password);

    return userRepository.create({
      email: normalizedEmail,
      name: normalizedName,
      passwordHash,
      role,
    });
  },
};

export default authService;
