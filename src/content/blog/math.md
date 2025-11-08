---
author: gg_gong
pubDatetime: 2025-10-30
title: Math-problems(Will update regularly)
draft: false
tags:
    - math
    - combinatorics
description:
  editorials to some interesting math problems.
---

[Problem Link](https://atcoder.jp/contests/abc290/tasks/abc290_f)

First solve this: given a list of the degrees what is the maximum possible diameter?

Well, at most 2 leaves can be on this diameter and thus maximum possible diameter of the tree is $ n - \sum_{i=1}^{n} [deg_i=1] + 1 $.

Other constraints are $ \sum_{i=1}^{n} deg_i = 2 * n - 2 $ and $ deg_i >= 1$ for all $i$.

Using stars and bars gives the answer in the form of $ \sum_{i=1}^{n} C(i,n) * C(n-k-1,k-2) * (n-i+1) $ where i is the number of leafs in the tree. 

Using Vandermonte's, the answer is just $(n-3)C(n-2,2n-4)+2C(n-1,2n-3)$