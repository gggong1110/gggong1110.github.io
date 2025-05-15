---
author: gg_gong
pubDatetime: 2025-03-13
title: Segtree-divide-and-conquer
draft: true
tags:
  - segtree-divide-and-conquer
description:
  Brief introduction to segtree divide and conquer.
---

Let's start with this problem:[Connect and disconnect](https://codeforces.com/gym/100551/problem/A)

First let's consider the situation where it guarantees and all adding and deleting operations are before the query. This should be fairly simple and the solution is just to use a dsu and ignore all of the deleted edges.

Carrying on the idea of using a dsu how would it be possible to use a dsu to delete something? The answer is use a rollback dsu.

What is a rollback dsu? It is a data structure that allows you to redo one operation of merging that you just did. Record the things you changed in a stack and change it back.







