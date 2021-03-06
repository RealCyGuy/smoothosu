#!/usr/bin/env node

const program = require("commander");
const sharp = require("sharp");
const boxen = require("boxen");
const indentString = require("indent-string");
const chalk = require("chalk");
const prompt = require("prompt");
const pkg = require("./package.json");
const fs = require("fs");
const updateNotifier = require("update-notifier");

program
  .version(pkg.version, "-v --version")
  .description("Make osu skin have a smooth cursor.")
  .action(function () {
    updateNotifier({ pkg }).notify();
    sharp.cache(false);
    const box = boxen(
      "smoothosu v" + pkg.version + "\n" + chalk.green("by cyrus yip"),
      {
        padding: 2,
        align: "center",
      }
    );
    console.log(
      indentString(
        box,
        (process.stdout.columns - box.split("\n")[0].length) / 2
      )
    );
    console.log(
      chalk.red(
        "\nWARNING: This action is irreversible. Make sure to do this in a duplicated osu skin folder.\n"
      )
    );
    prompt.start();
    const prompt_text = "Do you want to continue? [y]es/[n]o";
    setTimeout(() => {
      prompt.get(prompt_text, (err, result) => {
        if (result[prompt_text].toLowerCase() != "y") {
          process.exit(1);
        }
        console.log();
        const images = [
          "cursor.png",
          "cursor@2x.png",
          "cursortrail.png",
          "cursortrail@2x.png",
        ];
        for (var i = 0; i < images.length; i++) {
          const file = images[i];
          const image = sharp(file);
          image
            .metadata()
            .then((metadata) => {
              let buffer = image
                .resize(Math.round(metadata.width / 2))
                .toBuffer(function (err, buffer) {
                  fs.writeFile(file, buffer, function (e) {});
                });
              console.log(
                chalk.green("Success: Replaced file ") + "(" + file + ")"
              );
            })
            .catch((err) => {
              console.log(chalk.red(err) + " (" + file + ")");
            });
        }
        try {
          sharp({
            create: {
              width: 1,
              height: 1,
              channels: 4,
              background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
          }).toFile("cursormiddle.png");
          console.log(
            chalk.green("Success: Replaced/added file ") + "(cursormiddle.png)"
          );
        } catch (err) {
          console.log(chalk.red(err) + " (cursormiddle.png)");
        }
      });
    }, 1500);
  });

program.parse(process.argv);
