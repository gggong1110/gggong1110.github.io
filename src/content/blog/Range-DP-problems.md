---
author: gg_gong
pubDatetime: 2024-07-21
title: Some-good-range-dp-problems
draft: false
tags:
  - dp
  - range-dp
description:
  Some good and challenging problems for practicing range dp. 
---

# [[Atcoder Beginner Contest 217 F] Make Pair](https://atcoder.jp/contests/abc217/tasks/abc217_f)

Noticing that the bound for n is 200, it is pretty obvious that this problem should be done with a classical range dp. 

### The DP state

In this problem, $dp[l][r]$ denotes number of ways to choose everyone from $l$ to $r$.

### The transitions

Obviously, if we have chosen all the middle pairs, namely $l+1$ to $r-1$, then we could only choose $l,r$ next. This gives a contribution of $dp[l+1][r-1]$ to $dp[l][r]$.



# [[USACO 2017 January] Subsequence Reversal Platinum](https://usaco.org/index.php?page=viewproblem2&cpid=698)

the editorial is under construction

# [[Atcoder Beginner Contest 219 H] Candles](https://atcoder.jp/contests/abc219/tasks/abc219_h)

the editorial is under construction

# [[Codeforces 1922F] Replace on Segment](https://codeforces.com/problemset/problem/1922/F)

the editorial is under construction