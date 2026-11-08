---
author: gg_gong
pubDatetime: 2026-9-25
title: Recovery blog 1
draft: false
tags:
  - graphs
  - observation
  - conclusion
  - binary search
description:
  editorials to selected problems.
---

This is the start of a short series of blog i might regularly update about some irregular intervals of touching cp topics after a long time.

Trying not to rusty anymore after half a year and more…

https://qoj.ac/contest/282/problem/2001

Problem: Given a graph with edge weights, each time a move is determined by moving the highest/second weight edge (depending whether highest weight edge is where you came from), given a fixed end point p, q queries on how many number starting points can reach p at exactly K steps.

Difficulty: 69 points is 2/10 but 100 points is a jump(?) and 6/10

Hint: Build a graph by breaking nodes with did it come from largest weight edge and what is the property of the graph

Solution: After building the graph, the graph has the property of having another one outward edge from each node, also being a forest of trees with at most one cycle and points ultimately going into the cycles if following the edges out. By reversing the edges and performing a dfs, the two possibilities of reaching p in K number of steps is: 1. K distance from p in reverse graph 2. P in the cycle and (K-distance) % cycle length=0. Remember there is p and p’ for final destination!

https://qoj.ac/problem/15961

Problem: Minimum distance between given points that can cover a whole line

Difficulty: 3/10 but misread the problem at first

Hint: Binary search

Solution: Obviously the answer is monotonic, so binary search is applicable, the sort of the x coordinates guarantees the line will be checked in order, if it couldn’t cover all of the line or a middle portion that previous points reached, the only other thing required is pythagorean theorem.

https://codeforces.com/contest/1334/problem/E

Problem: Given graphs by divisors of a certain number as nodes, edges are based on whether two divisors are a prime away multiply/divide, weights are numbers of different divisors. Q queries of given u and v, find the number of shortest paths between the two points.

Difficulty: 5/10

Hint: the path must past gcd(u,v)

Solution: After noticing the property, the only thing left is that every time you can only divide or times a prime, consider the order of dividing or multiplying and count using simple combinatorics.