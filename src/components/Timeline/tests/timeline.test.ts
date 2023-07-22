import { expect, test } from "vitest";
import {
  filterOnlyMajor,
  filterOnlyMajorMinor,
  monotonicTags,
} from "../timeline";

test("filterOnlyMajor", () => {
  const actual = filterOnlyMajor([
    // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.0", major: 1, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.1", major: 1, minor: 0, patch: 1 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.2-hotfix", major: 1, minor: 0, patch: 2 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.0.0", major: 2, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.1.0", major: 2, minor: 1, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.2.2", major: 2, minor: 2, patch: 2 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v3.0.0-cool", major: 3, minor: 0, patch: 0 },
  ]);
  expect(actual).toEqual([
    { tagName: "v1.0.0", major: 1, minor: 0, patch: 0 },
    { tagName: "v2.0.0", major: 2, minor: 0, patch: 0 },
    { tagName: "v3.0.0-cool", major: 3, minor: 0, patch: 0 },
  ]);
});

test("filterOnlyMajorMinor", () => {
  const actual = filterOnlyMajorMinor([
    // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.0", major: 1, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.1", major: 1, minor: 0, patch: 1 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.2-hotfix", major: 1, minor: 0, patch: 2 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.1.0", major: 1, minor: 1, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.0.0", major: 2, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.1.0", major: 2, minor: 1, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.2.0-test", major: 2, minor: 2, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.2.2", major: 2, minor: 2, patch: 2 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v3.0.0-cool", major: 3, minor: 0, patch: 0 },
  ]);
  expect(actual).toEqual([
    { tagName: "v1.0.0", major: 1, minor: 0, patch: 0 },
    { tagName: "v1.1.0", major: 1, minor: 1, patch: 0 },
    { tagName: "v2.0.0", major: 2, minor: 0, patch: 0 },
    { tagName: "v2.1.0", major: 2, minor: 1, patch: 0 },
    { tagName: "v2.2.0-test", major: 2, minor: 2, patch: 0 },
    { tagName: "v3.0.0-cool", major: 3, minor: 0, patch: 0 },
  ]);
});

test("monotonicTags", () => {
  const actual = monotonicTags([
    // @ts-expect-error Incomplete release object for test
    { tagName: "v0.0.1", major: 0, minor: 0, patch: 1 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v0.1.0", major: 0, minor: 1, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v0.0.5", major: 0, minor: 0, patch: 5 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v0.0.10", major: 0, minor: 0, patch: 10 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.0.0", major: 1, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.1.0", major: 1, minor: 1, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.0.0", major: 2, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.2.0", major: 1, minor: 2, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.3.0", major: 1, minor: 3, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v1.3.9", major: 1, minor: 3, patch: 9 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.1.0", major: 2, minor: 1, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v2.0.2", major: 2, minor: 0, patch: 2 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v3.0.0", major: 3, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v4.0.0", major: 4, minor: 0, patch: 0 }, // @ts-expect-error Incomplete release object for test
    { tagName: "v3.5.0", major: 3, minor: 5, patch: 0 },
  ]);
  expect(actual).toEqual([
    { tagName: "v0.0.1", major: 0, minor: 0, patch: 1 },
    { tagName: "v0.1.0", major: 0, minor: 1, patch: 0 },
    { tagName: "v1.0.0", major: 1, minor: 0, patch: 0 },
    { tagName: "v1.1.0", major: 1, minor: 1, patch: 0 },
    { tagName: "v2.0.0", major: 2, minor: 0, patch: 0 },
    { tagName: "v2.1.0", major: 2, minor: 1, patch: 0 },
    { tagName: "v3.0.0", major: 3, minor: 0, patch: 0 },
    { tagName: "v4.0.0", major: 4, minor: 0, patch: 0 },
  ]);
});
