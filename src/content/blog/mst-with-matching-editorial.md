---
author: gg_gong
pubDatetime: 2025-01-12
title: mst-with-matching-editorial
draft: false
tags:
  - dynamic-programming
description:
  Editorial to the problem mst with matching.
---

[Problem Link](https://codeforces.com/contest/1948/problem/G)

## First observations

Since n is very small, it is obvious that a bitmask dp solution is required.

# Key observation

A tree is a bipartite graph and for a bipartite graph we have the maximum matching is equal to the minimum vertex cover by Konig's theorem.

# Solution

By noticing the property for the maximum matching we could now enumerate which nodes are in the minimum vertex cover and add edges for the kruskal when an endpoint of an edge is in the vertex cover.

# Notes

For solving the MST, you can use prim, final complexity O(2^n * n^2). But kruskal has final complexity O(2^n * n^2 * log(n^2)) so an optizimation as the code below shows it to presort the edge so the final complexity is (n^2 * log(n^2) + 2^n * n^2).

## P.S.

Surely boruvka for MST also passes but definitely overkill.

## Sol2.

Maximum independent set + Maximum matching in bipartite graph equals to n and thus enumerating for the maximum independent set also works.

# My implementation

```cpp
// don't be like Dennis
// think before you speak
// everyone should orz Ian Wang
// he also likes quelqu'un
// sleep is superior ! Stop doing your problem and go relax and sleep now
#include<bits/stdc++.h>
//#define int long long
using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef long double ld;
inline int read(){
	int num=0,sign=1;
	char ch=getchar();
	while(ch<'0'||ch>'9'){
		if(ch=='-')
			sign=-sign;
		ch=getchar();
	}
	while(ch>='0'&&ch<='9'){
		num=num*10+(int)ch-48;
		ch=getchar();
	}
	return num*sign;
}
const int MOD=1e9+7;
inline int powe(int di,int up){
	int rst=1;
	while(up){
		if(up&1)
			rst=rst*di%MOD;
		di=di*di%MOD;
		up>>=1;
	}
	return rst;
}
int n,c;
int nE;
int nEE;
int ans=(int)1e9;
int a[59][59];
int fa[59];
array<int,3> e[409];
array<int,3> ee[409];
inline int find_dsu(int u){
	return u==fa[u]?u:fa[u]=find_dsu(fa[u]);
}
inline void merge_dsu(int u,int v){
	u=find_dsu(u); v=find_dsu(v);
	if(u==v)
		return;
	fa[u]=v;
}
inline int kruskal(){
	iota(fa+1,fa+n+1,1);
	int cnt=0;
	int tot=0;
	for(int i=1;i<=nEE;i++){
		if(cnt==n-1)
			break;
		int u=ee[i][1],v=ee[i][2];
		if(find_dsu(u)==find_dsu(v))
			continue;
		merge_dsu(u,v);
		cnt++;
		tot+=ee[i][0];
	}
	return cnt==n-1?tot:(int)1e9;
}
int main(){
	n=read(); c=read();
	for(int i=1;i<=n;i++)
		for(int j=1;j<=n;j++)
			a[i][j]=read();
	for(int i=1;i<=n;i++)
		for(int j=i+1;j<=n;j++)
			if(a[i][j])
				e[++nE]={a[i][j],i,j};
	sort(e+1,e+nE+1);
	for(int mask=1;mask<(1<<n);mask++){
		nEE=0;
		for(int i=1;i<=nE;i++)
			if((mask&(1<<e[i][1]-1))||(mask&(1<<e[i][2]-1)))
				ee[++nEE]=e[i];
		ans=min(ans,kruskal()+c*__builtin_popcount(mask));
	}
	printf("%d",ans);
	return 0;
}
```