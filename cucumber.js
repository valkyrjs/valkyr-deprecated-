module.exports = {
  default: {
    requireModule: ["ts-node/register"],
    require: ["packages/**/tests/**/*steps.ts"],
    paths: ["packages/**/features/**/*.feature"],
    publishQuiet: true,
    format:["progress-bar", "html:cucumber-report.html"]
  }
}