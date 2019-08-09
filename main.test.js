const { getDiffs, OptionsEnum } = require("./main");

it("should display prod dependency diffs", () => {
  const actual = getDiffs(OptionsEnum.prod, ["__test_data__/package-1.json", "__test_data__/package-2.json"]);
  expect(actual).toStrictEqual([{ dependency: "colors", versions: ["^1.3.3"] }]);
});

it("should not fail when no dependencies", () => {
  const actual = getDiffs(OptionsEnum.prod, ["__test_data__/package-1.json", "__test_data__/package-3.json"]);
  expect(actual).toStrictEqual([{ dependency: "colors", versions: ["^1.3.3"] }]);
});

it("should display dev dependency diffs", () => {
  const actual = getDiffs(OptionsEnum.dev, ["__test_data__/package-1.json", "__test_data__/package-2.json"]);
  expect(actual).toStrictEqual([
    { dependency: "eslint", versions: ["^5.16.0", "^6.1.0"] },
    { dependency: "eslint-config-prettier", versions: ["^6.0.0"] },
    { dependency: "eslint-plugin-import", versions: ["^2.18.2"] },
    { dependency: "eslint-plugin-prettier", versions: ["^3.1.0"] },
    { dependency: "jest", versions: ["^24.8.0", "^24.7.0"] },
    { dependency: "prettier", versions: ["^1.18.2"] }
  ]);
});

it("should display both dependency diffs", () => {
  const actual = getDiffs(OptionsEnum.both, ["__test_data__/package-1.json", "__test_data__/package-2.json"]);
  expect(actual).toStrictEqual([
    { dependency: "colors", versions: ["^1.3.3"] },
    { dependency: "eslint", versions: ["^5.16.0", "^6.1.0"] },
    { dependency: "eslint-config-prettier", versions: ["^6.0.0"] },
    { dependency: "eslint-plugin-import", versions: ["^2.18.2"] },
    { dependency: "eslint-plugin-prettier", versions: ["^3.1.0"] },
    { dependency: "jest", versions: ["^24.8.0", "^24.7.0"] },
    { dependency: "prettier", versions: ["^1.18.2"] }
  ]);
});
