---
author: gg_gong
pubDatetime: 2025-10-22
title: week5-editorials
draft: false
tags:
  - interaction
description:
  editorials to selected problems.
---

[Problem Link](https://qoj.ac/contest/1522/problem/8056)

# Solution

Observe what 2n + 2m gives you, separate into 2 terms. 2n and 2m, the former implies something about a tree like structure and using edges twice and the latter uses every edge twice.

Using the 2m option, we could find all of the edges and traverse them twice to return to the same spot that we started from. But the problem with this is the order of traversing the edges and it is not guaranteed that we are able to find such a path that exist for the 2m directed edges.

By building a dfs tree during the process of traversing allows you to determine a possible order of traveling the edges all once and travel the tree edges once as well. 