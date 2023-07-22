import type { ScaleTime } from "d3-scale";

import type { Release } from "models";
import { DisplayType } from "store/datasetSettings";

import { POINT_RADIUS } from "./constants";

export type TimelineGroup = {
  releases: Release[];
};

export function groupReleases(
  releases: Release[],
  scale: ScaleTime<number, number>
): TimelineGroup[] {
  const groups: TimelineGroup[] = [];
  let group: TimelineGroup = { releases: [] };

  for (let i = 0; i < releases.length; i++) {
    if (group.releases.length === 0) {
      group.releases.push(releases[i]);
      continue;
    }

    const dy =
      scale(group.releases[group.releases.length - 1].publishedAt) -
      scale(releases[i].publishedAt);

    if (dy > POINT_RADIUS + POINT_RADIUS) {
      groups.push(group);
      group = { releases: [releases[i]] };
    } else {
      group.releases.push(releases[i]);
    }
  }

  if (group.releases.length > 0) {
    groups.push(group);
  }

  return groups;
}

function compareReleaseVersions(a: Release, b: Release): -1 | 0 | 1 {
  if (a.major > b.major) {
    return 1;
  }

  if (a.major < b.major) {
    return -1;
  }

  if (a.minor > b.minor) {
    return 1;
  }

  if (a.minor < b.minor) {
    return -1;
  }

  if (a.patch > b.patch) {
    return 1;
  }

  if (a.patch < b.patch) {
    return -1;
  }

  return 0;
}

export function monotonicTags(releases: Release[]): Release[] {
  if (releases.length === 0) {
    return [];
  }

  const result = [releases[0]];

  for (let i = 1; i < releases.length; i++) {
    const prev = result[result.length - 1];

    if (compareReleaseVersions(releases[i], prev) === 1) {
      result.push(releases[i]);
    }
  }

  return result;
}

export function filterTags(releases: Release[], type: DisplayType) {
  if (type === "major") {
    return filterOnlyMajor(releases);
  }

  if (type === "minor") {
    return filterOnlyMajorMinor(releases);
  }

  return releases;
}

export function filterOnlyMajor(releases: Release[]): Release[] {
  return releases.filter(
    (release) => release.minor === 0 && release.patch === 0
  );
}

export function filterOnlyMajorMinor(releases: Release[]): Release[] {
  return releases.filter((release) => release.patch === 0);
}
