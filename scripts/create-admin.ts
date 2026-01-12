import "dotenv/config";
import { db } from "../lib/db";
import { usersTable } from "../lib/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Admin";

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, adminEmail))
    .limit(1);

  if (existingUser.length > 0) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const [updatedAdmin] = await db
      .update(usersTable)
      .set({
        name: adminName,
        role: "admin",
        password: hashedPassword,
      })
      .where(eq(usersTable.email, adminEmail))
      .returning();

    console.log("Compte admin mis à jour");
    console.log("Email:", adminEmail);
    console.log("Mot de passe:", adminPassword);
    console.log("ID:", updatedAdmin.id);
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const [admin] = await db
    .insert(usersTable)
    .values({
      name: adminName,
      email: adminEmail,
      age: 0,
      role: "admin",
      password: hashedPassword,
    })
    .returning();

  console.log("Compte admin créé");
  console.log("Email:", adminEmail);
  console.log("Mot de passe:", adminPassword);
  console.log("ID:", admin.id);
}

createAdmin()
  .then(() => {
    console.log("Script terminé");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Erreur:", error);
    process.exit(1);
  });

