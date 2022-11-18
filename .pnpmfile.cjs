module.exports = {
  hooks: {
    readPackage(pkg, context) {
      if (pkg.name.startsWith('@nestjs/')) {
        context.log(`[nestjs] ${pkg.name}: making all peer dependencies non-optional`);
        pkg.peerDependenciesMeta = {};
      }
      return pkg;
    }
  },
};
