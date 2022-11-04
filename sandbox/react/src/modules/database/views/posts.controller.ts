import { faker } from "@faker-js/faker";
import { Controller, ViewController } from "@valkyr/react";

import { Post } from "../models/post.entity";
import { User } from "../models/user.entity";

let page = 1;

class PostsController extends Controller<State, Props> {
  async onResolve() {
    return {
      posts: await this.#getPosts(),
      page
    };
  }

  async indexExpression() {
    const users = await User.find();
    this.setState(
      "posts",
      await this.query(
        Post,
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

    await Post.insertMany(posts);

    console.log("Posts added");

    console.log("Updating users post count");

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
    return this.query(Post, filter, "posts");
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
