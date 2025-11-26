---
author: gg_gong
pubDatetime: 2025-11-26
title: Thanksgiving practice
draft: false
tags:
  - SG
  - game theory
description:
  editorials to selected problems.
---

# Nullify The Matrix (CF1451F)

## Solution

Define an array xx as the xor sum of the each of the diagonal, then if any of the xx value is nonzero then Ashish wins.

For proof consider the sg function:

1. Call the sg value of the whole board val(whether all xx is 0 if yes then val=0 else nonzero).

2. After one operation starting with val=0, the val must then be nonzero since the xx value of the diagonal containing the starting value must change.

3. After one operationn starting with val not zero, then a path going from the bottomleft diagonal to the topright diagonal(with nonzero xx) must be able to change the val back to 0.

With this the problem is simply checking whether val is zero at the start.

## Code

Too trivial