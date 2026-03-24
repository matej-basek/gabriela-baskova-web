const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToAvif() {
  const directoryPath = path.join(__dirname, 'public', 'images');
  
  if (!fs.existsSync(directoryPath)) {
      console.log('Directory not found');
      return;
  }
  
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
      if (file.match(/\.(png|jpe?g)$/i)) {
          const inputPath = path.join(directoryPath, file);
          const parsedPath = path.parse(inputPath);
          const outputPath = path.join(directoryPath, `${parsedPath.name}.avif`);
          
          try {
              console.log(`Converting ${file} to AVIF...`);
              await sharp(inputPath)
                  .avif({ quality: 65, effort: 4 }) // 65 is very high quality for AVIF but very small file size
                  .toFile(outputPath);
              
              console.log(`Successfully converted to ${path.basename(outputPath)}`);
              
              // Remove original
              fs.unlinkSync(inputPath);
          } catch (err) {
              console.error(`Error converting ${file}:`, err);
          }
      }
  }
}

convertToAvif();
