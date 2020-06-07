/* global describe, it */
const chai = require("chai");
const chaiFiles = require("chai-files");
const helpers = require("yeoman-test");
const path = require("path");
const assert = chai.assert;
const expect = chai.expect;
const glob = require("glob");
const fs = require("fs");
const metadataParser = require("markdown-yaml-metadata-parser");

chai.use(chaiFiles);

const TAG_01 = "tag1";
const TAG_02 = "tag2";
const TAG_03 = "tag3";

const parseFileMetadata = (markdownFiles) => {
  assert(
    markdownFiles.length === 1,
    "a markdown file should have been generated"
  );

  const sourceString = fs.readFileSync(markdownFiles[0], "utf8");

  return metadataParser(sourceString).metadata;
};

describe("Generate a zettel", () => {
  it("should generate a markdown zettel based on arguments", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withArguments([
        "Zettel generated from arguments",
        `  ${TAG_01},${TAG_02}  ,    ${TAG_03}   `,
      ])
      .then(() => {
        const markdownFiles = glob.sync("*-zettel_generated_from_arguments.md");

        const metadata = parseFileMetadata(markdownFiles);

        expect(metadata.title).to.be.equal("Zettel Generated From Arguments");
        expect(metadata.tags).to.eql([TAG_01, TAG_02, TAG_03]);
      });
  });

  it("should generate a markdown zettel based on interactive UI answers", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        title: "Zettel generated from prompt!",
        tags: `${TAG_01},${TAG_02}`,
      })
      .then(() => {
        const markdownFiles = glob.sync("*-zettel_generated_from_prompt.md");
        const metadata = parseFileMetadata(markdownFiles);

        expect(metadata.title).to.be.equal("Zettel Generated From Prompt!");
        expect(metadata.tags).to.eql([TAG_01, TAG_02]);
      });
  });

  it("should generate a markdown zettel without tags based on interactive UI answers", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .withPrompts({
        title: "Zettel generated from prompt",
        tags: "",
      })
      .then(() => {
        const markdownFiles = glob.sync("*-zettel_generated_from_prompt.md");
        const metadata = parseFileMetadata(markdownFiles);

        expect(metadata.title).to.be.equal("Zettel Generated From Prompt");
        expect(metadata.tags).to.eql([]);
      });
  });
});
