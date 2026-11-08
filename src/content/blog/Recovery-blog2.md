---
author: gg_gong
pubDatetime: 2026-10-17
title: Recovery blog 2
draft: false
tags:
  - observation
  - conclusion
  - game-theory
description:
  editorials to selected problems.
---

The second in the series. The later will be more frequent.

https://codeforces.com/contest/1016/problem/F

Problem: Given a tree with edge weights, find max shortest distance from 1 to n after adding an edge of given weight between previously unconnected nodes, q queries each independent.

Difficulty: 6/10

Hint: Consider fixing the only path from 1 to n and other as subtrees of nodes. The edge being added will be the same over all queries and optimal answer is min(current 1 to n distance, distance of adding a 0 weighted edge + added actual weight)

Solution: Only nodes in the “rooted” subtrees farthest from the root matters, using a simple multiset maintaining the later distance to the n on the path plus the farthest distance and enumerating the prefix path taken with the longest distance solves the problem. BUT this is not over, the other case of not making the distance any longer is if there are >=2 nodes in the subtree and this causes any weight edge between them not to matter since it will never be in the optimal path. 

https://atcoder.jp/contests/arc137/tasks/arc137_c

Problem: Given an array, each operation you can move the largest number to any not taken integer smaller than it, Alice starts first, not able to operate loses, who will win.

Difficulty: 6/10

Hint: Consider what is the must win state

Solution: If the largest two numbers are not adjacent then the person making the move is guaranteed to win. Set the largest two numbers x and y.
If x=y-1 and the person making could win by making a move from y to z then the person making the move can directly move to z, otherwise moving y to x+1 could win.
The other occasion is where the players alternatively move the largest number down by 1 every time, and the answer is simply the parity of remaining spaces not being occupied by any of the numbers existing.

https://codeforces.com/problemset/problem/387/D

Problem: Find the minimum number of operations (adding or removing an edge) such that the center(any point in the graph) has edges connected to all other nodes in both directions and a self loop. For the other points, all of them have an edge out from it and an edge pointing towards it(not containing the center).

Difficulty: 4/10 (mostly from knowing the algorithm)

Hint: Fix the center point

Solution: After switching the center, it is easy to calculate the number of operations required for satisfying the constraints for the center edges. For the other edges, break each point into two, one satisfying the point in and the other satisfying the pointing out. Then the problem is easily transformed into a bipartite matching problem and the answer would be center + 2n - 2 - number of matched points.
