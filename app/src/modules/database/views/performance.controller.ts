import { Controller, ViewController } from "@valkyr/react";

import { db } from "~services/database";

import { Post } from "../models/post.entity";
import { User } from "../models/user.entity";

class PerformanceController extends Controller<State> {
  async onInit() {
    return {
      action: "Stopped",
      results: []
    };
  }

  async start() {
    this.#reset();

    await this.#createUsers(100);
    await this.#createPosts(20000);

    await this.#countWithoutCriteria();
    await this.#indexedCount();
    await this.#nonIndexedCount();

    this.#log("Performance tests concluded");

    await db.flush();
  }

  async #createUsers(count: number) {
    this.#log("Creating users");

    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(User.fake());
    }

    this.#log("Inserting users");
    const t0 = performance.now();
    await User.insertMany(users);
    this.#report({
      test: `${count} users inserted`,
      time: this.#toTime(t0)
    });
  }

  async #createPosts(count: number) {
    this.#log("Creating posts");

    const users = await User.find();
    const counts: {
      [id: string]: number;
    } = {};

    const posts = [];

    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      posts.push(Post.fake(user));
      if (counts[user.id] === undefined) {
        counts[user.id] = 0;
      }
      counts[user.id] += 1;
    }

    const t0 = performance.now();
    await Post.insertMany(posts);
    this.#report({
      test: `${count} posts inserted`,
      time: this.#toTime(t0)
    });

    const t1 = performance.now();
    for (const userId in counts) {
      const user = users.find((user) => user.id === userId);
      if (user) {
        await user.update({
          $inc: {
            posts: counts[userId]
          }
        });
      }
    }
    this.#report({
      test: `${Object.keys(counts).length} users update with new post counts`,
      time: this.#toTime(t1)
    });
  }

  async #countWithoutCriteria() {
    const t0 = performance.now();
    const count = await Post.count();
    this.#report({
      test: `${count} posts counted without criteria`,
      time: this.#toTime(t0)
    });
  }

  async #indexedCount() {
    const user = await User.findOne();
    const t0 = performance.now();
    const count = await Post.count({ createdBy: user.id });
    this.#report({
      test: `${count} posts counted on indexed field`,
      time: this.#toTime(t0)
    });
  }

  async #nonIndexedCount() {
    const user = await User.findOne();
    const t0 = performance.now();
    const count = await Post.count({ updatedBy: user.id });
    this.#report({
      test: `${count} posts counted on non indexed field`,
      time: this.#toTime(t0)
    });
  }

  #log(message: string) {
    this.setState("action", message);
  }

  #report(result: any) {
    this.setState("results", [...this.state.results, result]);
  }

  #reset() {
    this.setState("results", []);
  }

  #toTime(time: number) {
    return `Operation executed in ${(performance.now() - time).toFixed(2)} milliseconds`;
  }
}

type State = {
  action: string;
  results: any[];
};

export const controller = new ViewController(PerformanceController);
