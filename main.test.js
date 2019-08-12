const { getDiffs, OptionsEnum, parseArgs, displayResults } = require("./main");

describe("getDiffs", () => {
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
});

describe("parseArgs", () => {
  it("should get packages and dev option", () => {
    const { packagesToCompare, option } = parseArgs(["node_path", "executable_name", "--dev", "package-1.json", "package-2.json"]);

    expect(packagesToCompare).toStrictEqual(["package-1.json", "package-2.json"]);
    expect(option).toStrictEqual(OptionsEnum.dev);
  });

  it("should get packages and both option", () => {
    const { packagesToCompare, option } = parseArgs(["node_path", "executable_name", "--both", "package-1.json", "package-2.json"]);

    expect(packagesToCompare).toStrictEqual(["package-1.json", "package-2.json"]);
    expect(option).toStrictEqual(OptionsEnum.both);
  });

  it("should get packages and prod option by default", () => {
    const { packagesToCompare, option } = parseArgs(["node_path", "executable_name", "package-1.json", "package-2.json"]);

    expect(packagesToCompare).toStrictEqual(["package-1.json", "package-2.json"]);
    expect(option).toStrictEqual(OptionsEnum.prod);
  });
});

describe("displayResults", () => {
  it("should display the correct results", () => {
    const spy = jest.spyOn(console, "info").mockImplementation();
    const results = [
      { dependency: "eslint", versions: ["^5.16.0", "^6.1.0"] },
      { dependency: "eslint-config-prettier", versions: ["^6.0.0"] },
      { dependency: "eslint-plugin-import", versions: ["^2.18.2"] },
      { dependency: "eslint-plugin-prettier", versions: ["^3.1.0"] },
      { dependency: "jest", versions: ["^24.8.0", "^24.7.0"] },
      { dependency: "prettier", versions: ["^1.18.2"] }
    ];
    displayResults(false, results);
    expect(spy).toHaveBeenCalledTimes(6);
    expect(spy.mock.calls).toEqual([
      ['\x1b[31m  "eslint": "^5.16.0,^6.1.0"\x1b[0m'],
      ['  "eslint-config-prettier": "^6.0.0"'],
      ['  "eslint-plugin-import": "^2.18.2"'],
      ['  "eslint-plugin-prettier": "^3.1.0"'],
      ['\x1b[31m  "jest": "^24.8.0,^24.7.0"\x1b[0m'],
      ['  "prettier": "^1.18.2"']
    ]);
    spy.mockRestore();
  });

  it("should exit when ci", () => {
    const spy = jest.spyOn(console, "info").mockImplementation();
    const mockExit = jest.spyOn(process, "exit").mockImplementation(() => {});

    const results = [
      { dependency: "eslint", versions: ["^5.16.0", "^6.1.0"] },
      { dependency: "eslint-config-prettier", versions: ["^6.0.0"] },
      { dependency: "eslint-plugin-import", versions: ["^2.18.2"] },
      { dependency: "eslint-plugin-prettier", versions: ["^3.1.0"] },
      { dependency: "jest", versions: ["^24.8.0", "^24.7.0"] },
      { dependency: "prettier", versions: ["^1.18.2"] }
    ];
    displayResults(true, results);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls).toEqual([['\x1b[31m  "eslint": "^5.16.0,^6.1.0"\x1b[0m'], ['\x1b[31m  "jest": "^24.8.0,^24.7.0"\x1b[0m']]);
    expect(mockExit).toHaveBeenCalledWith(1);
    spy.mockRestore();
    mockExit.mockRestore();
  });
});
