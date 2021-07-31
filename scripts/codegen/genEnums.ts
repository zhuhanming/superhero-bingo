import fs from "fs";
import {
  getAutoGenComment,
  getPartialGenBottomComment,
  getPartialGenTopComment,
} from "./getComments";

export default function genEnums(): void {
  let text: string;
  try {
    text = fs.readFileSync("server/prisma/schema.prisma").toString("utf-8");
  } catch {
    console.error("Failed to find schema file. Not generating enums.");
    return;
  }

  const lines = text.split("\n");
  let index = 0;
  let isProcessingEnum = false;
  const enumContent: string[] = [];
  const fileNames: string[] = [];

  while (index < lines.length) {
    const line = lines[index++];
    if (!isProcessingEnum && !line.toLowerCase().startsWith("enum")) {
      continue;
    }
    enumContent.push(line);
    if (!isProcessingEnum) {
      isProcessingEnum = true;
    }
    if (line.startsWith("}")) {
      fileNames.push(writeEnum(enumContent.slice(0, -1)));
      enumContent.length = 0;
      isProcessingEnum = false;
    }
  }

  console.log("Writing enums/index.ts");
  writeIndex(fileNames.filter((s) => s.length > 0));
}

function writeEnum(enumContent: string[]): string {
  if (enumContent.length === 0) {
    return "";
  }
  const firstLineSplit = enumContent[0].split(" ");
  if (firstLineSplit.length < 3) {
    return "";
  }
  const enumName = firstLineSplit[1];
  const content = [
    getAutoGenComment("server/prisma/schema.prisma"),
    `export enum ${enumName} {`,
  ];

  for (let i = 1; i < enumContent.length; i++) {
    const value = enumContent[i].trim();
    if (value.startsWith("//")) {
      continue;
    }
    const valueSplit = value.split(" ");
    if (!/[a-zA-Z]/g.test(valueSplit[0])) {
      // Line is empty
      continue;
    }
    content.push(`  ${valueSplit[0]} = '${valueSplit[0]}',`);
  }
  content.push("}\n");

  const fileName = `${enumName.charAt(0).toLowerCase()}${enumName.slice(1)}`;
  console.log(`Writing enums/${fileName}.ts`);
  fs.writeFileSync(`shared/src/enums/${fileName}.ts`, content.join("\n"));

  return fileName;
}

function writeIndex(fileNames: string[]): void {
  const currentIndex = fs
    .readFileSync("shared/src/enums/index.ts")
    .toString("utf-8");
  const currentLines = currentIndex.split("\n");

  const topComment = getPartialGenTopComment("server/prisma/schema.prisma");
  const manualComment = getPartialGenBottomComment();

  const manualIndex = currentLines.findIndex((l) => l === manualComment);
  const manualLines =
    manualIndex !== -1 ? currentLines.slice(manualIndex + 1) : [];
  if (manualLines.length > 0 && manualLines[0] === "") {
    manualLines.shift();
  }

  const content = [topComment];
  for (const fileName of fileNames) {
    content.push(`export * from './${fileName}';`);
  }
  content.push(`\n${manualComment}\n`);
  content.push(...manualLines);
  const finalContent = content.join("\n");
  fs.writeFileSync(`shared/src/enums/index.ts`, finalContent);
}
