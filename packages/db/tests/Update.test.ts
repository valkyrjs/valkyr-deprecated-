import { InstanceAdapter } from "../src/Adapters";
import { Collection } from "../src/Collection";
import { Document } from "../src/Storage";

/**
 * @see https://www.mongodb.com/docs/manual/reference/operator/update-field/#field-update-operators
 */
describe("Field Update Operators", () => {
  describe("$set", () => {
    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/set/#set-top-level-fields
     */
    it("should set top level fields", async () => {
      const collection = new Collection<
        Document & {
          quantity: number;
          instock: boolean;
          reorder: boolean;
          details: {
            model: string;
            make: string;
          };
          tags: string[];
          ratings: {
            by: string;
            rating: number;
          }[];
        }
      >("tests", new InstanceAdapter());

      await collection.insertOne({
        id: "100",
        quantity: 250,
        instock: true,
        reorder: false,
        details: { model: "14QQ", make: "Clothes Corp" },
        tags: ["apparel", "clothing"],
        ratings: [{ by: "Customer007", rating: 4 }]
      });

      expect(
        await collection.updateOne(
          {
            id: "100"
          },
          {
            $set: {
              quantity: 500,
              details: { model: "2600", make: "Fashionaires" },
              tags: ["coats", "outerwear", "clothing"]
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("100")).toEqual({
        id: "100",
        quantity: 500,
        instock: true,
        reorder: false,
        details: { model: "2600", make: "Fashionaires" },
        tags: ["coats", "outerwear", "clothing"],
        ratings: [{ by: "Customer007", rating: 4 }]
      });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/set/#set-fields-in-embedded-documents
     */
    it("should set fields in the embedded documents", async () => {
      const collection = new Collection<
        Document & {
          quantity: number;
          instock: boolean;
          reorder: boolean;
          details: {
            model: string;
            make: string;
          };
          tags: string[];
          ratings: {
            by: string;
            rating: number;
          }[];
        }
      >("tests", new InstanceAdapter());

      await collection.insertOne({
        id: "100",
        quantity: 500,
        instock: true,
        reorder: false,
        details: { model: "2600", make: "Fashionaires" },
        tags: ["coats", "outerwear", "clothing"],
        ratings: [{ by: "Customer007", rating: 4 }]
      });

      expect(
        await collection.updateOne(
          {
            id: "100"
          },
          {
            $set: {
              "details.make": "Kustom Kidz"
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("100")).toEqual({
        id: "100",
        quantity: 500,
        instock: true,
        reorder: false,
        details: { model: "2600", make: "Kustom Kidz" },
        tags: ["coats", "outerwear", "clothing"],
        ratings: [{ by: "Customer007", rating: 4 }]
      });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/set/#set-elements-in-arrays
     */
    it("should set elements in arrays", async () => {
      const collection = new Collection<
        Document & {
          quantity: number;
          instock: boolean;
          reorder: boolean;
          details: {
            model: string;
            make: string;
          };
          tags: string[];
          ratings: {
            by: string;
            rating: number;
          }[];
        }
      >("tests", new InstanceAdapter());

      await collection.insertOne({
        id: "100",
        quantity: 500,
        instock: true,
        reorder: false,
        details: { model: "2600", make: "Kustom Kidz" },
        tags: ["coats", "outerwear", "clothing"],
        ratings: [{ by: "Customer007", rating: 4 }]
      });

      expect(
        await collection.updateOne(
          {
            id: "100"
          },
          {
            $set: {
              "tags[1]": "rain gear",
              "ratings[0].rating": 2
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("100")).toEqual({
        id: "100",
        quantity: 500,
        instock: true,
        reorder: false,
        details: { model: "2600", make: "Kustom Kidz" },
        tags: ["coats", "rain gear", "clothing"],
        ratings: [{ by: "Customer007", rating: 2 }]
      });
    });
  });

  describe("$unset", () => {
    it("should unset keys", async () => {
      const collection = new Collection<
        Document & {
          item: string;
          sku: string;
          quantity: number;
          instock: boolean;
        }
      >("tests", new InstanceAdapter());

      await collection.insertMany([
        { id: "1", item: "chisel", sku: "C001", quantity: 4, instock: true },
        { id: "2", item: "hammer", sku: "unknown", quantity: 3, instock: true },
        { id: "3", item: "nails", sku: "unknown", quantity: 100, instock: true }
      ]);

      expect(
        await collection.updateOne(
          {
            sku: "unknown"
          },
          {
            $unset: {
              quantity: "",
              instock: ""
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        {
          id: "1",
          item: "chisel",
          sku: "C001",
          quantity: 4,
          instock: true
        },
        {
          id: "2",
          item: "hammer",
          sku: "unknown"
        },
        {
          id: "3",
          item: "nails",
          sku: "unknown",
          quantity: 100,
          instock: true
        }
      ]);
    });
  });
});

/**
 * @see https://www.mongodb.com/docs/manual/reference/operator/update-array/#array-update-operators
 */
describe("Array Update Operators", () => {
  describe("$(update)", () => {
    it("should replace a object in an array", async () => {
      const collection = new Collection<Document & { grades: { id: string; value: number }[] }>(
        "students",
        new InstanceAdapter()
      );

      await collection.insertOne({
        id: "1",
        grades: [
          {
            id: "1",
            value: 10
          },
          {
            id: "2",
            value: 10
          }
        ]
      });

      expect(
        await collection.updateOne(
          {
            id: "1",
            "grades.id": "1"
          },
          {
            $set: {
              "grades.$": {
                id: "1",
                value: 15
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        {
          id: "1",
          grades: [
            {
              id: "1",
              value: 15
            },
            {
              id: "2",
              value: 10
            }
          ]
        }
      ]);
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/positional/#update-values-in-an-array
     */
    it("should update values in an array", async () => {
      const collection = new Collection<Document & { grades: number[] }>("students", new InstanceAdapter());

      await collection.insertMany([
        { id: "1", grades: [85, 80, 80] },
        { id: "2", grades: [88, 90, 92] },
        { id: "3", grades: [85, 100, 90] }
      ]);

      expect(
        await collection.updateOne(
          {
            id: "1",
            grades: 80
          },
          {
            $set: {
              "grades.$": 82
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        { id: "1", grades: [85, 82, 80] },
        { id: "2", grades: [88, 90, 92] },
        { id: "3", grades: [85, 100, 90] }
      ]);
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/positional/#update-documents-in-an-array
     */
    it("should update documents in an array", async () => {
      const collection = new Collection<Document & { grades: { grade: number; mean: number; std: number }[] }>(
        "students",
        new InstanceAdapter()
      );

      await collection.insertOne({
        id: "4",
        grades: [
          { grade: 80, mean: 75, std: 8 },
          { grade: 85, mean: 90, std: 5 },
          { grade: 85, mean: 85, std: 8 }
        ]
      });

      expect(
        await collection.updateOne(
          {
            id: "4",
            "grades.grade": 85
          },
          {
            $set: {
              "grades.$.std": 6
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("4")).toEqual({
        id: "4",
        grades: [
          { grade: 80, mean: 75, std: 8 },
          { grade: 85, mean: 90, std: 6 },
          { grade: 85, mean: 85, std: 8 }
        ]
      });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/positional/#update-embedded-documents-using-multiple-field-matches
     */
    it("should update embedded documents using multiple field matches", async () => {
      const collection = new Collection<Document & { grades: { grade: number; mean: number; std: number }[] }>(
        "students",
        new InstanceAdapter()
      );

      await collection.insertOne({
        id: "5",
        grades: [
          { grade: 80, mean: 75, std: 8 },
          { grade: 85, mean: 90, std: 5 },
          { grade: 90, mean: 85, std: 3 }
        ]
      });

      expect(
        await collection.updateOne(
          {
            id: "5",
            grades: {
              $elemMatch: {
                grade: {
                  $lte: 90
                },
                mean: {
                  $gt: 80
                }
              }
            }
          },
          {
            $set: {
              "grades.$.std": 6
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("5")).toEqual({
        id: "5",
        grades: [
          { grade: 80, mean: 75, std: 8 },
          { grade: 85, mean: 90, std: 6 },
          { grade: 90, mean: 85, std: 3 }
        ]
      });
    });
  });

  describe("$pull", () => {
    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/pull/#remove-all-items-that-equal-a-specified-value
     */
    it("should remove all items that equal a specified value", async () => {
      const collection = new Collection<Document & { fruits: string[]; vegetables: string[] }>(
        "stores",
        new InstanceAdapter()
      );

      await collection.insertMany([
        {
          id: "1",
          fruits: ["apples", "pears", "oranges", "grapes", "bananas"],
          vegetables: ["carrots", "celery", "squash", "carrots"]
        },
        {
          id: "2",
          fruits: ["plums", "kiwis", "oranges", "bananas", "apples"],
          vegetables: ["broccoli", "zucchini", "carrots", "onions"]
        }
      ]);

      expect(
        await collection.updateMany(
          {},
          {
            $pull: {
              fruits: {
                $in: ["apples", "oranges"]
              },
              vegetables: "carrots"
            }
          }
        )
      ).toEqual({
        matchedCount: 2,
        modifiedCount: 2,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        {
          id: "1",
          fruits: ["pears", "grapes", "bananas"],
          vegetables: ["celery", "squash"]
        },
        {
          id: "2",
          fruits: ["plums", "kiwis", "bananas"],
          vegetables: ["broccoli", "zucchini", "onions"]
        }
      ]);
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/pull/#remove-all-items-that-match-a-specified--pull-condition
     */
    it("should remove all items that match a specific $pull condition", async () => {
      const collection = new Collection<Document & { votes: number[] }>("profiles", new InstanceAdapter());

      await collection.insertOne({ id: "1", votes: [3, 5, 6, 7, 7, 8] });

      expect(
        await collection.updateOne(
          { id: "1" },
          {
            $pull: {
              votes: {
                $gte: 6
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findOne({ id: "1" })).toEqual({ id: "1", votes: [3, 5] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/pull/#remove-items-from-an-array-of-documents
     */
    it("should remove items from an array of documents", async () => {
      const collection = new Collection<Document & { results: { item: string; score: number }[] }>(
        "surveys",
        new InstanceAdapter()
      );

      await collection.insertMany([
        {
          id: "1",
          results: [
            { item: "A", score: 5 },
            { item: "B", score: 8 }
          ]
        },
        {
          id: "2",
          results: [
            { item: "C", score: 8 },
            { item: "B", score: 4 }
          ]
        }
      ]);

      expect(await collection.updateMany({}, { $pull: { results: { score: 8, item: "B" } } })).toEqual({
        matchedCount: 2,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        {
          id: "1",
          results: [{ item: "A", score: 5 }]
        },
        {
          id: "2",
          results: [
            { item: "C", score: 8 },
            { item: "B", score: 4 }
          ]
        }
      ]);
    });

    it("should not remove any elements when using $elemMatch", async () => {
      const collection = new Collection<Document & { results: { item: string; score: number }[] }>(
        "surveys",
        new InstanceAdapter()
      );

      await collection.insertMany([
        {
          id: "1",
          results: [
            { item: "A", score: 5 },
            { item: "B", score: 8 }
          ]
        },
        {
          id: "2",
          results: [
            { item: "C", score: 8 },
            { item: "B", score: 4 }
          ]
        }
      ]);

      expect(await collection.updateMany({}, { $pull: { results: { $elemMatch: { score: 8, item: "B" } } } })).toEqual({
        matchedCount: 2,
        modifiedCount: 0,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        {
          id: "1",
          results: [
            { item: "A", score: 5 },
            { item: "B", score: 8 }
          ]
        },
        {
          id: "2",
          results: [
            { item: "C", score: 8 },
            { item: "B", score: 4 }
          ]
        }
      ]);
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/pull/#remove-documents-from-nested-arrays
     */
    it("should remove documents from nested arrays", async () => {
      const collection = new Collection<
        Document & { results: { item: string; score: number; answers: { q: number; a: number }[] }[] }
      >("surveys", new InstanceAdapter());

      await collection.insertMany([
        {
          id: "1",
          results: [
            {
              item: "A",
              score: 5,
              answers: [
                { q: 1, a: 4 },
                { q: 2, a: 6 }
              ]
            },
            {
              item: "B",
              score: 8,
              answers: [
                { q: 1, a: 8 },
                { q: 2, a: 9 }
              ]
            }
          ]
        },
        {
          id: "2",
          results: [
            {
              item: "C",
              score: 8,
              answers: [
                { q: 1, a: 8 },
                { q: 2, a: 7 }
              ]
            },
            {
              item: "B",
              score: 4,
              answers: [
                { q: 1, a: 0 },
                { q: 2, a: 8 }
              ]
            }
          ]
        }
      ]);

      expect(
        await collection.updateMany(
          {},
          {
            $pull: {
              results: {
                answers: { $elemMatch: { q: 2, a: { $gte: 8 } } }
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 2,
        modifiedCount: 2,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        {
          id: "1",
          results: [
            {
              item: "A",
              score: 5,
              answers: [
                { q: 1, a: 4 },
                { q: 2, a: 6 }
              ]
            }
          ]
        },
        {
          id: "2",
          results: [
            {
              item: "C",
              score: 8,
              answers: [
                { q: 1, a: 8 },
                { q: 2, a: 7 }
              ]
            }
          ]
        }
      ]);
    });
  });

  describe("$push", () => {
    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/push/#append-a-value-to-an-array
     */
    it("should append a value to an array", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "1", scores: [44, 78, 38, 80] });

      expect(
        await collection.updateOne(
          { id: "1" },
          {
            $push: {
              scores: 89
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findOne({ id: "1" })).toEqual({ id: "1", scores: [44, 78, 38, 80, 89] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/push/#append-a-value-to-arrays-in-multiple-documents
     */
    it("should append a value to arrays in multiple documents", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertMany([
        { id: "1", scores: [44, 78, 38, 80, 89] },
        { id: "2", scores: [45, 78, 38, 80, 89] },
        { id: "3", scores: [46, 78, 38, 80, 89] },
        { id: "4", scores: [47, 78, 38, 80, 89] }
      ]);

      expect(
        await collection.updateMany(
          {},
          {
            $push: {
              scores: 95
            }
          }
        )
      ).toEqual({
        matchedCount: 4,
        modifiedCount: 4,
        exceptions: []
      });

      expect(await collection.find()).toEqual([
        { id: "1", scores: [44, 78, 38, 80, 89, 95] },
        { id: "2", scores: [45, 78, 38, 80, 89, 95] },
        { id: "3", scores: [46, 78, 38, 80, 89, 95] },
        { id: "4", scores: [47, 78, 38, 80, 89, 95] }
      ]);
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/push/#append-multiple-values-to-an-array
     */
    it("should append multiple values to an array", async () => {
      const collection = new Collection<Document & { name: string; scores: number[] }>(
        "students",
        new InstanceAdapter()
      );

      await collection.insertOne({ id: "1", name: "Joe", scores: [44, 78] });

      expect(
        await collection.updateOne(
          { name: "Joe" },
          {
            $push: {
              scores: {
                $each: [90, 92, 85]
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findOne({ id: "1" })).toEqual({ id: "1", name: "Joe", scores: [44, 78, 90, 92, 85] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/push/#use--push-operator-with-multiple-modifiers
     */
    it("should use $push operator with multiple modifiers", async () => {
      const collection = new Collection<Document & { quizzes: { wk: number; score: number }[] }>(
        "students",
        new InstanceAdapter()
      );

      await collection.insertOne({
        id: "5",
        quizzes: [
          { wk: 1, score: 10 },
          { wk: 2, score: 8 },
          { wk: 3, score: 5 },
          { wk: 4, score: 6 }
        ]
      });

      expect(
        await collection.updateOne(
          { id: "5" },
          {
            $push: {
              quizzes: {
                $each: [
                  { wk: 5, score: 8 },
                  { wk: 6, score: 7 },
                  { wk: 7, score: 6 }
                ],
                $sort: { score: -1 },
                $slice: 3
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("5")).toEqual({
        id: "5",
        quizzes: [
          { wk: 1, score: 10 },
          { wk: 2, score: 8 },
          { wk: 5, score: 8 }
        ]
      });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/slice/#slice-from-the-end-of-the-array
     */
    it("should slice from the end of the array", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "1", scores: [40, 50, 60] });

      expect(
        await collection.updateOne(
          { id: "1" },
          {
            $push: {
              scores: {
                $each: [80, 78, 86],
                $slice: -5
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("1")).toEqual({ id: "1", scores: [50, 60, 80, 78, 86] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/slice/#slice-from-the-front-of-the-array
     */
    it("should slice from the front of the array", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "2", scores: [89, 90] });

      expect(
        await collection.updateOne(
          { id: "2" },
          {
            $push: {
              scores: {
                $each: [100, 20],
                $slice: 3
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("2")).toEqual({ id: "2", scores: [89, 90, 100] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/slice/#update-array-using-slice-only
     */
    it("should update array using slice only", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "3", scores: [89, 70, 100, 20] });

      expect(
        await collection.updateOne(
          { id: "3" },
          {
            $push: {
              scores: {
                $each: [],
                $slice: -3
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("3")).toEqual({ id: "3", scores: [70, 100, 20] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/position/#add-elements-at-the-start-of-the-array
     */
    it("should add elements to the start of the array", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "1", scores: [100] });

      expect(
        await collection.updateOne(
          { id: "1" },
          {
            $push: {
              scores: {
                $each: [50, 60, 70],
                $position: 0
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("1")).toEqual({ id: "1", scores: [50, 60, 70, 100] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/position/#add-elements-to-the-middle-of-the-array
     */
    it("should add elements to the middle of the array", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "2", scores: [50, 60, 70, 100] });

      expect(
        await collection.updateOne(
          { id: "2" },
          {
            $push: {
              scores: {
                $each: [20, 30],
                $position: 2
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("2")).toEqual({ id: "2", scores: [50, 60, 20, 30, 70, 100] });
    });

    it("should use a negative index to add elements to the array", async () => {
      const collection = new Collection<Document & { scores: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "3", scores: [50, 60, 20, 30, 70, 100] });

      expect(
        await collection.updateOne(
          { id: "3" },
          {
            $push: {
              scores: {
                $each: [90, 80],
                $position: -2
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("3")).toEqual({ id: "3", scores: [50, 60, 20, 30, 90, 80, 70, 100] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/sort/#sort-array-of-documents-by-a-field-in-the-documents
     */
    it("should sort array of documents by a field in the documents", async () => {
      const collection = new Collection<Document & { quizzes: { id: number; score: number }[] }>(
        "students",
        new InstanceAdapter()
      );

      await collection.insertOne({
        id: "1",
        quizzes: [
          { id: 1, score: 6 },
          { id: 2, score: 9 }
        ]
      });

      expect(
        await collection.updateOne(
          { id: "1" },
          {
            $push: {
              quizzes: {
                $each: [
                  { id: 3, score: 8 },
                  { id: 4, score: 7 },
                  { id: 5, score: 6 }
                ],
                $sort: { score: 1 }
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("1")).toEqual({
        id: "1",
        quizzes: [
          { id: 1, score: 6 },
          { id: 5, score: 6 },
          { id: 4, score: 7 },
          { id: 3, score: 8 },
          { id: 2, score: 9 }
        ]
      });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/sort/#sort-array-elements-that-are-not-documents
     */
    it("should sort array elements that are not documents", async () => {
      const collection = new Collection<Document & { tests: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "2", tests: [89, 70, 89, 50] });

      expect(
        await collection.updateOne(
          {
            id: "2"
          },
          {
            $push: {
              tests: {
                $each: [40, 60],
                $sort: 1
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("2")).toEqual({ id: "2", tests: [40, 50, 60, 70, 89, 89] });
    });

    /**
     * @see https://www.mongodb.com/docs/manual/reference/operator/update/sort/#update-array-using-sort-only
     */
    it("should update array using sort only", async () => {
      const collection = new Collection<Document & { tests: number[] }>("students", new InstanceAdapter());

      await collection.insertOne({ id: "3", tests: [89, 70, 100, 20] });

      expect(
        await collection.updateOne(
          {
            id: "3"
          },
          {
            $push: {
              tests: {
                $each: [],
                $sort: -1
              }
            }
          }
        )
      ).toEqual({
        matchedCount: 1,
        modifiedCount: 1,
        exceptions: []
      });

      expect(await collection.findById("3")).toEqual({ id: "3", tests: [100, 89, 70, 20] });
    });
  });
});
