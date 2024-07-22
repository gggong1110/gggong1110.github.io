---
author: gg_gong
pubDatetime: 2024-07-21
title: Colorful-tree-editorial
draft: false
tags:
  - data-structure
  - segment-tree
description:
  Detailed editorial to the problem colorful tree.
---

[Problem Link](https://qoj.ac/problem/3845)

## Prerequisites

You need to know segment tree and dynamic segment tree(a type of segtree tree that makes a new point when necessary)

## The idea

Since this problem requires us to find the distance between two points on the tree, it should be obvious that we should use the formula: $`distance = d[u]+d[v]-2*d[findlca(u,v)]`$ where u and v are the two points on the tree. 

Lemma 1
For the sets of nodes S1 and S2, if the diameter is x1,y1 and x2,y2 then the diameter of S1 and S2 is chosen between x1,y1,x2,y2.

For this problem, we should build the shape of the tree first instead of dynamically maintaining the shape of the tree. From this, we could view every operation as a process of activating a node. Consider maintaining two segment tree, the first one(calling it as SGT1) maintains the longest diameter of each color when the two node's index are chosen in the interval [l,r].(when there is no node in the interval that belongs to the color, then the distance is 0 and the pair of nodes)

For an operation of activating a color for a node, we would modify the nodes on the color's segment tree that include the index. An operating of changing a color for a node is just deleting the node from the original color's segment tree and adding it to the new color's segment tree.

```cpp
		rt[colors[1]]=ins_dynamic_open_point_sgt1(rt[colors[1]],1,q+1,1);
		upd_sgt(1,1,q+1,colors[1],tr[rt[colors[1]]].longest.furthest);
//		cout_sgt(1);
//		printf("\n\n");
		for(int i=1;i<=q;i++){
			if(query[i].op==0){
				colors[query[i].activate]=query[i].c;
				rt[query[i].c]=ins_dynamic_open_point_sgt1(rt[colors[query[i].activate]],1,q+1,query[i].activate);
//				printf("%d %d\n",tr[rt[colors[query[i].activate]]].longest.furthest.first,tr[rt[colors[query[i].activate]]].longest.furthest.second);
				upd_sgt(1,1,q+1,colors[query[i].activate],tr[rt[colors[query[i].activate]]].longest.furthest);
			}
			else{
				rt[colors[query[i].activate]]=del_dynamic_open_point_sgt1(rt[colors[query[i].activate]],1,q+1,query[i].activate);
				upd_sgt(1,1,q+1,colors[query[i].activate],tr[rt[colors[query[i].activate]]].longest.furthest);
				colors[query[i].activate]=query[i].c;
				rt[query[i].c]=ins_dynamic_open_point_sgt1(rt[colors[query[i].activate]],1,q+1,query[i].activate);
				upd_sgt(1,1,q+1,colors[query[i].activate],tr[rt[colors[query[i].activate]]].longest.furthest);
			}
//			cout_dynamic_open_point_sgt1();
//			cout_sgt(1);
			printf("%lld\n",max(0ll,find_distance(tr2[1].longest[1].furthest.first,tr2[1].longest[1].furthest.second)));
//			printf("%d\n",max(0,tr2[1].longest[1].dst));
//			printf("\n\n");
		}	
```

We notice that we only need to care about the longest diameter of each color and we could put it into another segment tree(calling it as SGT2) which maintains two information, the 

Considering the fact that there may be a lot of different colors that exists in the tree. The first segment tree should be a segment tree that opens a point when necessary(the main purpose is that the segment tree would definetely exceed the memory limit otherwise).

Note that in this specific problem, we are required to find the lowest common ancestor in O(1) time. This requires the use of building a sparse table on the dfn order(which is the in order in my code) in O(nlogn) time. More details are provided at the bottom of this editorial.

## P.S. 

such a bad problem for the memory limit, and don't use 
```cpp 
#define int long long
``` 
for this problem!

Use the snippets of the important code to help you!