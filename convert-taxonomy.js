import fs from "fs";
import readline from "readline";

// Replace 'taxonomy.txt' with the path to your downloaded file
const inputFile = "./taxonomy.txt";
const outputFile = "categories.json";

let categories = [];
const pathToIdMap = {}; // Map to store name -> id for quick parent lookups

const processLine = (line) => {
  // Each line is structured as 'id - Category Name'
  const match = line.match(/^(\d+)\s*-\s*(.+)/);
  if (match) {
    const id = parseInt(match[1], 10);
    const path = match[2].trim();

    // Determine parent name by removing the last part after ">"
    const pathParts = path.split(">").map((part) => part.trim());
    const name = pathParts[pathParts.length - 1];
    const parentName =
      pathParts.length > 1 ? pathParts.slice(0, -1).join(" > ") : null;
    const parent_id =
      parentName && pathToIdMap[parentName] ? pathToIdMap[parentName] : null;

    // Create the category object
    const category = { id, name, parent_id, path };
    categories.push(category);

    // Add to name-to-id map for future parent lookups
    pathToIdMap[path] = id;
  }
};

const convertToJSON = async () => {
  try {
    // Check if the input file exists
    if (!fs.existsSync(inputFile)) {
      console.error(`Error: Input file "${inputFile}" not found.`);
      return;
    }

    const fileStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      processLine(line);
    }

    // Write output to JSON file
    fs.writeFileSync(outputFile, JSON.stringify(categories, null, 2));
    console.log(`Categories saved to ${outputFile}`);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

// Run the conversion function
convertToJSON().catch(console.error);
