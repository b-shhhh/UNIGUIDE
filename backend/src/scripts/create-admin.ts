import bcrypt from "bcrypt";
import { connectDatabase } from "../database/mongodb";
import { User } from "../models/user.model";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || "System";
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || "Admin";
const ADMIN_PHONE = process.env.ADMIN_PHONE || "0000000000";

const run = async () => {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");
  }

  await connectDatabase();

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    existing.role = "admin";
    if (ADMIN_PASSWORD.trim().length >= 8) {
      existing.password = await bcrypt.hash(ADMIN_PASSWORD, 10);
    }
    await existing.save();
    console.log(`Updated existing user to admin: ${ADMIN_EMAIL}`);
    process.exit(0);
  }

  const password = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await User.create({
    fullName: `${ADMIN_FIRST_NAME} ${ADMIN_LAST_NAME}`.trim(),
    email: ADMIN_EMAIL,
    phone: ADMIN_PHONE,
    password,
    role: "admin"
  });

  console.log(`Created admin user: ${ADMIN_EMAIL}`);
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to create/update admin user:", error.message);
  process.exit(1);
});
