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
        type: 'Docs',
        pattern: ['./README.md', './docs/**/*.md'],
        processor: 'md',
        fields: {
          title: {
            type: 'string',
          },
        },
        transform: (file) => {
          if (file.path === '/readme') {
            file.path = '/';
            file.sections = [];
          } else {
            file.path = file.path.replaceAll(/^\/docs\/?/g, '/');
            file.sections = file.sections.slice(1);
          }
          return file;
        },
        sort: (a) => {
          return a.path === '/' ? -1 : 0;
        },
      },
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