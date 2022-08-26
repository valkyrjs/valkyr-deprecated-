/** @type {import('@birthdayresearch/contented').ContentedConfig} */
module.exports = {
  preview: {
    name: 'Valkyr',
    url: 'https://docs.kodemon.net',
    github: {
      url: 'https://github.com/kodemon/valkyr',
    },
  },
  processor: {
    rootDir: '../',
    pipelines: [
      {
        type: 'Packages',
        pattern: ['packages/**/docs/**/*.md'],
        processor: 'md',
        fields: {
          title: {
            type: 'string',
          },
          sections: {
            type: 'string[]',
          },
        },
        transform: (file) => {
          file.path = file.path.replaceAll(/\/readme$/g, '');
          file.sections = file.fields.sections;
          return file;
        },
        sort: (a, b) => {
          if (a.sections.length === 0) {
            return -1;
          }
          if (b.sections.length === 0) {
            return 1;
          }
          return a.sections[0].localeCompare(b.sections[0]);
        }
      }
    ]
  }
};