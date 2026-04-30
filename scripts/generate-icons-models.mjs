import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = path.resolve(dirname, "../icons");

const BUTTON_ICON_MODEL_PATH = path.resolve(
  dirname,
  "../blocks/button-icon/_button-icon.json",
);

function getIconOptions() {
  const files = fs.readdirSync(ICONS_DIR);
  const options = [{ name: "None", value: "" }];

  files
    .filter((f) => f.endsWith(".svg"))
    .sort()
    .forEach((f) => {
      const value = f.replace(".svg", "");
      const name = value
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      options.push({ name, value });
    });

  return options;
}

function generateIconsModels() {
  const blockJson = JSON.parse(
    fs.readFileSync(BUTTON_ICON_MODEL_PATH, "utf-8"),
  );
  const iconOptions = getIconOptions();

  const buttonIconModel = blockJson.models?.find((m) => m.id === "button-icon");

  if (!buttonIconModel) {
    process.stderr.write("Model button-icon not found in _button-icon.json\n");
    process.exit(1);
  }

  ["icon"].forEach((fieldName) => {
    const field = buttonIconModel.fields.find((f) => f.name === fieldName);
    if (field) field.options = iconOptions;
  });

  fs.writeFileSync(BUTTON_ICON_MODEL_PATH, JSON.stringify(blockJson, null, 2));
  process.stdout.write(
    `✅ button model updated with ${iconOptions.length - 1} icons\n`,
  );
}

generateIconsModels();
