---
id: roles-introduction
title: Introduction
sidebar_label: Introduction
slug: /
---

# Access Control

Welcome to the access control section of the @valkyr development kit. This package aims to provide tools enabling us to secure data by enabling or disabling specific levels of access to our users.

We do this by enabling the system to create their own roles against a permission template, which we can assign members to. Lets start with a brief overview example of how this is meant to work.

Lets say we have a product where there are `channels`. Each `channel` has a list of functionality that we have corresponding `permissions` for. Lets say a `channel` has the following `permissions`.

- Can create thread.
- Can read thread.
- Can update thread.
- Can delete thread.

Now we have a rudimentary `permission` template. A template by itself serves no practical purpose, it simply identifies the various `permissions` the system requires. To make it have purpose we need to create roles, so lets mock two roles.

- Guest
  - Can read thread.
- Admin
  - Can create thread.
  - Can read thread.
  - Can updated thread.
  - Can delete thread.

Now we have created a `guest` and a `admin` role. Now for roles to serve a purpose they need to be assigned to end users. In our case end users are refered to as `members`. Each `channel` has a list of `members`, and that member list can be assigned to a `role`.

:::info

A member usually relates to an `account` but can relate to anything we want to identify as system wide actor. An `account` can be a members of many `channels`.

:::

Access control can live on many different layers, and it is important to note that each access control layer requires its own pool of members.

While it may be somewhat of a brain squeeze at first glance, this setup currently allows for a high level of flexibility in that roles are completely dynamic and can be created in any combination we need against a known set of permissions. This enables us to give users the ability to define their own roles that can be assigned to their members giving them the power to define the access control protocols in their own domains.
