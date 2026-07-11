const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const contentDir = path.join(__dirname, '..', 'content');
const appDir = path.join(__dirname, '..', 'app');
const componentsDir = path.join(__dirname, '..', 'components');

const extensionsToConvert = ['.png', '.jpg', '.jpeg', '.avif'];
const filesToUpdate = [];
const pathReplacements = [];

// Helper to recursively find files
function getFilesRecursively(dir, filterExtensions) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, filterExtensions));
    } else {
      const ext = path.extname(fullPath).toLowerCase();
      if (filterExtensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

async function run() {
  console.log('--- STARTING WEBP CONVERSION AND REFACTOR ---');
  
  // 1. Find all target images in public directory
  console.log(`Scanning public directory: ${publicDir}`);
  const images = getFilesRecursively(publicDir, extensionsToConvert);
  console.log(`Found ${images.length} images to convert.`);

  if (images.length === 0) {
    console.log('No images found to convert.');
  } else {
    for (const imagePath of images) {
      const relativePath = path.relative(publicDir, imagePath);
      const ext = path.extname(imagePath);
      const webpPath = imagePath.substring(0, imagePath.length - ext.length) + '.webp';
      const webpRelativePath = path.relative(publicDir, webpPath);

      console.log(`Converting: ${relativePath} -> ${webpRelativePath}`);

      try {
        // Convert to WebP using sharp
        await sharp(imagePath)
          .webp({ quality: 80 })
          .toFile(webpPath);
        
        console.log(`Converted successfully: ${webpRelativePath}`);

        // Register replacement paths (e.g., "work/josys-policy/cover.png" -> "work/josys-policy/cover.webp")
        // and also simple filenames (e.g. "cover.png" -> "cover.webp")
        const oldRefPath = '/' + relativePath.split(path.sep).join('/');
        const newRefPath = '/' + webpRelativePath.split(path.sep).join('/');
        const oldFilename = path.basename(imagePath);
        const newFilename = path.basename(webpPath);

        pathReplacements.push({
          oldRefPath,
          newRefPath,
          oldFilename,
          newFilename
        });

        // Delete the original file
        fs.unlinkSync(imagePath);
        console.log(`Deleted original: ${relativePath}`);
      } catch (err) {
        console.error(`Error processing ${relativePath}:`, err);
      }
    }
  }

  // 2. Scan code/content files to update references
  console.log('\n--- SCANNING CODEBASE FOR REF PATH UPDATES ---');
  const codeExtensions = ['.md', '.json', '.js', '.jsx', '.css'];
  const codeFiles = [
    ...getFilesRecursively(contentDir, codeExtensions),
    ...getFilesRecursively(appDir, codeExtensions),
    ...getFilesRecursively(componentsDir, codeExtensions)
  ];

  console.log(`Found ${codeFiles.length} code/content files to check.`);

  let updatedFilesCount = 0;
  for (const filePath of codeFiles) {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Apply all replacements
    for (const rep of pathReplacements) {
      // 1. Replace absolute public paths (e.g. "/work/josys-policy/cover.png")
      if (content.includes(rep.oldRefPath)) {
        console.log(`Replacing path "${rep.oldRefPath}" in ${path.relative(path.join(__dirname, '..'), filePath)}`);
        // Global replace
        content = content.split(rep.oldRefPath).join(rep.newRefPath);
        hasChanges = true;
      }
      
      // 2. Replace standalone filenames (e.g. "cover.png" inside JSON files or relative paths)
      if (content.includes(rep.oldFilename)) {
        console.log(`Replacing filename "${rep.oldFilename}" in ${path.relative(path.join(__dirname, '..'), filePath)}`);
        content = content.split(rep.oldFilename).join(rep.newFilename);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, content, 'utf8');
      updatedFilesCount++;
    }
  }

  console.log(`\nRefactored ${updatedFilesCount} files successfully.`);
  console.log('--- COMPLETED SUCCESSFULLY ---');
}

run().catch(console.error);
