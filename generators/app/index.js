const Generator = require("yeoman-generator");
const slugify = require("slugify");
const moment = require("moment");

class ZettelGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("title", { type: String, required: false });
    this.argument("tags", { type: String, required: false });
  }

  async prompting() {
    this.title = this.options.title;
    this.tags = this.options.tags || "";

    if (this.title === undefined) {
      this.answers = await this.prompt([
        {
          type: "input",
          name: "title",
          message: "Your zettel title",
          default: "",
        },
        {
          type: "input",
          name: "tags",
          message: "Tags (comma separated)",
        },
      ]);

      this.title = this.answers.title;
      this.tags = this.answers.tags;
    }

    this.datePrefix = moment().format("YYYYMMDDHHmmSS");
    this.fileTitle = slugify(this.title, {
      replacement: "_",
      lower: true,
      strip: true,
      remove: /[*+~.()'"!:@/\\*^`?]/g,
    });

    this.fileName = `${this.datePrefix}-${this.fileTitle}.md`;
    this.tags = this.tags
      ? this.tags
          .split(",")
          .filter((tagItem) => tagItem != "")
          .map((tagItem) => tagItem.trim())
      : [];
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath("zettel.md.ejs"),
      this.destinationPath(this.fileName),
      {
        title: this._titleize(this.title),
        tags: this.tags,
      }
    );
  }

  _titleize(text) {
    return text.toLowerCase().replace(/(?:^|\s|-)\S/g, (character) => {
      return character.toUpperCase();
    });
  }
}

module.exports = ZettelGenerator;
