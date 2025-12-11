#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const prismaClientPath = path.join(
  __dirname,
  "..",
  "node_modules",
  ".prisma",
  "client"
);
const defaultDtsPath = path.join(prismaClientPath, "default.d.ts");
const defaultJsPath = path.join(prismaClientPath, "default.js");

// Créer le répertoire s'il n'existe pas
if (!fs.existsSync(prismaClientPath)) {
  console.log("Répertoire .prisma/client non trouvé, création...");
  fs.mkdirSync(prismaClientPath, { recursive: true });
}

// Créer default.d.ts
if (!fs.existsSync(defaultDtsPath)) {
  fs.writeFileSync(defaultDtsPath, "export * from './client'\n");
  console.log("✓ Créé default.d.ts");
}

// Créer default.js
const defaultJsContent = `// Re-export from client.ts
// Turbopack will handle TypeScript compilation automatically
module.exports = require('./client.ts');
`;

if (!fs.existsSync(defaultJsPath)) {
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log("✓ Créé default.js");
} else {
  // Toujours mettre à jour pour s'assurer qu'il est correct
  fs.writeFileSync(defaultJsPath, defaultJsContent);
  console.log("✓ Mis à jour default.js");
}

console.log("✓ Fichiers Prisma Client configurés");
