import { Controller, ViewController } from "@valkyr/react";

import { router } from "~services/router";

import { Post } from "../models/post.entity";
import { User } from "../models/user.entity";

class PostsController extends Controller<State> {
  async onResolve() {
    const filter: { where?: { createdBy: string } } = {};
    const author = router.query.get("author");
    if (author !== undefined) {
      filter.where = {
        createdBy: author
      };
    }
    return {
      posts: await this.query(Post, filter, "posts")
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
    const users = await User.find();
    const counts: {
      [id: string]: number;
    } = {};

    for (let i = 0; i < count; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      Post.faker(user);
      if (counts[user.id] === undefined) {
        counts[user.id] = 0;
      }
      counts[user.id] += 1;
    }

    for (const userId in counts) {
      const user = users.find((user) => user.id === userId);
      if (user) {
        user.update({
          $inc: {
            posts: counts[userId]
          }
        });
      }
    }
  }
}

type State = {
  posts: Post[];
};

export const controller = new ViewController(PostsController);
