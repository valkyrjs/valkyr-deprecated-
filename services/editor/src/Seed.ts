import { DataField } from "~Library/DataField";
import { db as edb } from "~Modules/Event/Data/Event.Database";
import { db as tdb } from "~Modules/Type/Data/Type.Database";

import * as types from "./Seed.Types";

const meta: DataField[] = [
  ["container", "p:string"],
  ["auditor", "p:string"]
];

/*
 |--------------------------------------------------------------------------------
 | Console Tools
 |--------------------------------------------------------------------------------
 */

declare global {
  interface Window {
    seed: () => Promise<void>;
  }
}

window.seed = async function seed() {
  await seedRealms();
  await seedInvites();
  await seedStories();
};

/*
 |--------------------------------------------------------------------------------
 | Seeds
 |--------------------------------------------------------------------------------
 */

async function seedRealms(): Promise<void> {
  await tdb.collection("types").insertOne({
    name: "Realms",
    value: types.realms
  });

  // ### Seed Event Group

  const result = await edb.collection("groups").insertOne({ name: "Realms" });
  if (result.acknowledged === false) {
    throw new Error("Failed to seed realms event group");
  }

  // ### Seed Events

  const groupId = result.insertedId;

  await edb.collection("events").insertMany([
    {
      groupId,
      name: "RealmCreated",
      data: [
        ["ownerId", "p:string"],
        ["name", "p:string"],
        ["color", "p:string"],
        ["icon", "p:string"],
        ["members", "t:Member", { isArray: true }]
      ],
      meta
    },
    {
      groupId,
      name: "RealmNameSet",
      data: [["name", "p:string"]],
      meta
    },
    {
      groupId,
      name: "RealmArchived",
      data: [],
      meta
    },
    {
      groupId,
      name: "RealmMemberAdded",
      data: [["member", "t:Member"]],
      meta
    },
    {
      groupId,
      name: "RealmMemberArchived",
      data: [["memberId", "p:string"]],
      meta
    },
    {
      groupId,
      name: "RealmMemberUnarchived",
      data: [["member", "t:Member"]],
      meta
    }
  ]);
}

async function seedInvites() {
  const result = await edb.collection("groups").insertOne({ name: "Invites" });
  if (result.acknowledged === false) {
    throw new Error("Failed to seed realms event group");
  }

  // ### Seed Events

  const groupId = result.insertedId;

  await edb.collection("events").insertMany([
    {
      groupId,
      name: "InviteTokenCreated",
      data: [],
      meta
    }
  ]);
}

async function seedStories() {
  await tdb.collection("types").insertOne({
    name: "Stories",
    value: types.stories
  });

  // ### Seed Event Group

  const result = await edb.collection("groups").insertOne({ name: "Stories" });
  if (result.acknowledged === false) {
    throw new Error("Failed to seed realms event group");
  }

  // ### Seed Events

  const groupId = result.insertedId;

  await edb.collection("events").insertMany([
    {
      groupId,
      name: "StoryCreated",
      data: [
        ["realmId", "p:string"],
        ["storyType", "t:StoryType"],
        ["title", "p:string"],
        ["cover", "t:MediaData"],
        ["slug", "p:string"],
        ["sections", "t:Section[]"],
        ["authors", "p:string"]
      ],
      meta
    },
    {
      groupId,
      name: "StorySectionAdded",
      data: [
        ["title", "p:string", { isOptional: true }],
        ["layers", "t:Layer", { isArray: true }],
        ["settings", "t:SectionSettings"],
        ["insertedAt", "p:number"]
      ],
      meta
    },
    {
      groupId,
      name: "StorySectionRemoved",
      data: [["sectionId", "p:string"]],
      meta
    },
    {
      groupId,
      name: "StoryPublished",
      data: [["publishToken", "p:string"]],
      meta
    },
    {
      groupId,
      name: "StoryUnpublished",
      data: [],
      meta
    },
    {
      groupId,
      name: "StoryArchived",
      data: [],
      meta
    },
    {
      groupId,
      name: "StoryUnarchived",
      data: [],
      meta
    },
    {
      groupId,
      name: "SectionTitleChanged",
      data: [
        ["id", "p:string"],
        ["title", "p:string"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionThemeChanged",
      data: [
        ["id", "p:string"],
        ["theme", "t:Theme"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionHeightChanged",
      data: [
        ["id", "p:string"],
        ["height", "t:Height"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerAlignmentXChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["alignment", "t:Alignment"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerAlignmentYChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["alignment", "t:Alignment"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerPositionXChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["alignment", "t:Alignment"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerPositionYChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["alignment", "t:Alignment"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerWidthChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["width", "t:Width"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerHeightChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["height", "t:Height"]
      ],
      meta
    },
    {
      groupId,
      name: "SectionLayerDataChanged",
      data: [
        ["id", "p:string"],
        ["layerId", "p:string"],
        ["data", "t:SectionLayerData"]
      ],
      meta
    }
  ]);
}
