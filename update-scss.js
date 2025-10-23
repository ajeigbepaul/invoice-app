const fs = require("fs");
const path = require("path");

// Function to recursively find all SCSS files
function findScssFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith(".")) {
      fileList = findScssFiles(filePath, fileList);
    } else if (file.endsWith(".scss")) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to update import statements in a file
function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let updated = false;

    // Replace @import with @use
    if (content.includes("@import")) {
      // Replace relative imports
      content = content.replace(
        /@import\s+['"](.+?)\.scss['"]\s*;/g,
        (match, p1) => {
          updated = true;
          return `@use '${p1}' as *;`;
        }
      );

      // Replace imports with paths
      content = content.replace(
        /@import\s+['"](.+?)\/(.+?)\.scss['"]\s*;/g,
        (match, p1, p2) => {
          updated = true;
          return `@use '${p1}/${p2}' as *;`;
        }
      );

      if (updated) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`Updated: ${filePath}`);
      }
    }

    // Handle @/styles imports in app directory
    if (content.includes("@use '@/styles/")) {
      const relativePath = path.relative(
        path.dirname(filePath),
        path.join(process.cwd(), "styles")
      );
      const normalizedPath = relativePath.replace(/\\/g, "/");

      // Replace @/styles with relative path
      content = content.replace(
        /@use\s+['"]@\/styles\/(.+?)['"]\s+as\s+\*/g,
        (match, p1) => {
          updated = true;
          return `@use '${normalizedPath}/${p1}' as *`;
        }
      );

      if (updated) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`Updated @/styles imports: ${filePath}`);
      }
    }

    // Fix component SCSS files that use direct imports without paths
    if (
      content.includes('@use "variables" as *') ||
      content.includes('@use "mixins" as *')
    ) {
      const relativePath = path.relative(
        path.dirname(filePath),
        path.join(process.cwd(), "styles")
      );
      const normalizedPath = relativePath.replace(/\\/g, "/");

      // Replace direct imports with relative paths
      content = content.replace(
        /@use\s+["']variables["']\s+as\s+\*/g,
        `@use '${normalizedPath}/variables' as *`
      );

      content = content.replace(
        /@use\s+["']mixins["']\s+as\s+\*/g,
        `@use '${normalizedPath}/mixins' as *`
      );

      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Updated direct imports: ${filePath}`);
      updated = true;
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Main function
function main() {
  const rootDir = process.cwd();
  const scssFiles = findScssFiles(rootDir);

  console.log(`Found ${scssFiles.length} SCSS files`);

  scssFiles.forEach((file) => {
    updateImports(file);
  });

  console.log("SCSS update complete");
}

main();
