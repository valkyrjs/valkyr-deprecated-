export function parsePackageJson(packageJson: string): PackageJSON {
  return JSON.parse(packageJson);
}

export type PackageJSON = {
  readonly name: string;
  readonly version: string;
  readonly main?: string;
  readonly files?: readonly string[];
  readonly man?: readonly string[];
  readonly scripts?: Readonly<Record<string, string>>;
  readonly gitHead?: string;
  readonly types?: string;
  readonly typings?: string;
} & AbbreviatedVersion &
  HoistedData;

type HoistedData = {
  readonly author?: Person;
  readonly bugs?: { readonly url: string; readonly email?: string } | { readonly url?: string; readonly email: string };
  readonly contributors?: readonly Person[];
  readonly description?: string;
  readonly homepage?: string;
  readonly keywords?: readonly string[];
  readonly license?: string;
  readonly maintainers?: readonly Person[];
  readonly readme?: string;
  readonly readmeFilename?: string;
  readonly repository?: { readonly type: string; readonly url: string };
};

type AbbreviatedVersion = {
  readonly dist: {
    readonly shasum: string;
    readonly tarball: string;
    readonly integrity?: string;
  };
  readonly deprecated?: string;
  readonly dependencies?: Readonly<Record<string, string>>;
  readonly optionalDependencies?: Readonly<Record<string, string>>;
  readonly devDependencies?: Readonly<Record<string, string>>;
  readonly bundleDependencies?: Readonly<Record<string, string>>;
  readonly peerDependencies?: Readonly<Record<string, string>>;
  readonly bin?: Readonly<Record<string, string>>;
  readonly directories?: readonly string[];
  readonly engines?: Readonly<Record<string, string>>;
};

type Person = {
  readonly name?: string;
  readonly email?: string;
  readonly url?: string;
};
