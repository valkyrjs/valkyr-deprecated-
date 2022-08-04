import type { Location } from "history";

const locations: Location[] = [];

export function setLocationOrigin(location: Location): void {
  if (locations.length > 1) {
    locations.shift();
  }
  locations.push(location);
}

export function getLocationOrigin(): Location | undefined {
  return locations[0];
}
