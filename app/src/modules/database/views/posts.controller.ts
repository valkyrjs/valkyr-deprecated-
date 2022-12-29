import { Controller, ViewController } from "@valkyr/react";

import { db } from "~services/database";

import type { Post } from "../models/post.entity";
import { getFakePostData } from "../utils/post.utils";

let page = 1;

class PostsController extends Controller<State, Props> {
  async onResolve() {
    return {
      posts: await this.#getPosts(),
      page
    };
  }

  async indexExpression() {
    const users = await db.collection("users").find();
    this.setState(
      "posts",
      await this.query(
        db.collection("posts"),
        {
          where: {
            createdBy: {
              $in: [
                users[Math.floor(Math.random() * users.length)].id,
                users[Math.floor(Math.random() * users.length)].id
              ]
            }
          }
        },
        "posts"
      )
    );
  }

  async addPosts(count = 1) {
    console.log("Adding posts");

    const users = await db.collection("users").find();
    const counts: {
      [id: string]: number;
    } = {};

    const posts = [];

    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      posts.push(getFakePostData(user));
      if (counts[user.id] === undefined) {
        counts[user.id] = 0;
      }
      counts[user.id] += 1;
    }

    await db.collection("posts").insertMany(posts);

    console.log("Posts added");

    console.log("Updating users post count");

    for (const userId in counts) {
      const user = users.find((user) => user.id === userId);
      if (user) {
        await db.collection("users").updateOne(
          {
            id: user.id
          },
          {
            $inc: {
              posts: counts[userId]
            }
          }
        );
      }
    }

    console.log("Users post count updated");
  }

  async goToPage(value: number) {
    page = value;
    this.setState("page", page);
  }

  async #getPosts() {
    const filter: { where?: { createdBy: string } } = {};
    if (this.props.author !== undefined) {
      filter.where = {
        createdBy: this.props.author
      };
    }
    return this.query(db.collection("posts"), filter, "posts");
  }
}

export type Props = {
  author?: string;
};

type State = {
  posts: Post[];
  page: number;
};

export const controller = new ViewController(PostsController);
