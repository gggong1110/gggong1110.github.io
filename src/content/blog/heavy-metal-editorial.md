---
author: gg_gong
pubDatetime: 2026-01-25
title: Heavy metal editorial
draft: false
tags:
  - meet-in-the-middle
  - observation
  - dijkstra
description:
  Editorial to heavy metal from PA 2025. A very elegant problem.
---

[Problem Link](https://qoj.ac/contest/1948/problem/10249)

# Solution

## First steps and Time complexity

Notice the boundary limit on the size of the array p(writen as a in my code) is 1e9. The boundary on n and m is also very small, implying an O(nsqrt(max_p))ish and O(msqrt(max_p))ish is doable.

## Important Observation

For every path from 1 to n, it can be broken down into two parts with value <= sqrt(max_p) and a single edge connecting one's endpoint and the other's starting point.

## Specifics

After deriving the observation, consider solving 3 subproblems separately.

### Subproblem 1

In this part, find the values that can be obtained at each point, this could easily be done with an ok array denoting ok_{i,j} as whether value j is achievable at node i. A simple bfs with only starting pair (1,1) will solve this part with complexity O(nsqrt(max_p)).

### Subproblem 2

In this part, find the maximum values that is allowed with previous path values and later on multiplications, this could easily be done with an mx array denoting mx_{i,j} as the maximum value of the previous path allowed while the i to n path has a value of j. A simple dijkstra prioritizing the min mx would do with part easily with complexity O(nsqrt(max_p)log(nsqrt(max_p))).

### Subproblem 3

In this part, we try to enumerate the "middle" edge and combine the information from the two halves to find the maximum achievable answer. With a two-pointer on the values of the path's multiplication and as it's monotonicity is guaranteed, this could easily be done with complexity O(msqrt(max_p)).

### Note

The edges are unidirectional!!! Thus part 2's dijkstra is on the reversed graph.

## Code

```cpp
#include<bits/stdc++.h>
#define int long long
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
inline void write(int num){
	if(num<0){
		putchar('-');
		num=-num;
	}
	if(num>9)
		write(num/10);
	putchar(num%10+'0');
}
int T;
int n,m;
int lim;
int a[109];
bool ok[109][40009];
array<int,3> e[209];
vector<pair<int,int> > reach[109];
vector<pair<int,int> > reach2[109];
inline void work(){
	for(int i=1;i<=n;i++)
		for(int j=1;j<=lim;j++)
			ok[i][j]=0;
	ok[1][1]=1;
	queue<pair<int,int> > q;
	q.push(make_pair(1,1));
	while(!q.empty()){
		pair<int,int> p=q.front();
		q.pop();
		for(pair<int,int> pp:reach[p.first]){
			int nval=p.second*pp.second;
			if(nval>lim)
				continue;
			if(nval>a[pp.first])
				continue;
			if(ok[pp.first][nval])
				continue;
			ok[pp.first][nval]=1;
			q.push(make_pair(pp.first,nval));
		}
	}
}
int mx[109][40009];
inline void work2(){
	for(int i=1;i<=n;i++)
		for(int j=1;j<=lim;j++)
			mx[i][j]=-1;
	mx[n][1]=a[n];
	priority_queue<array<int,3> > pq;
	pq.push({a[n],n,1});
	while(!pq.empty()){
		array<int,3> arr=pq.top();
		pq.pop();
		if(arr[0]!=mx[arr[1]][arr[2]])
			continue;
		for(pair<int,int> pp:reach2[arr[1]]){
			int nval=arr[2]*pp.second;
			if(nval>lim)
				continue;
			if(mx[pp.first][nval]!=-1)
				continue;
			mx[pp.first][nval]=min(a[pp.first],arr[0]/pp.second);
			pq.push({mx[pp.first][nval],pp.first,nval});
		}
	}
}
signed main(){
	T=read();
	while(T--){
		n=read(); m=read();
		for(int i=1;i<=n;i++)
			a[i]=read();
		for(int i=1;i<=m;i++){
			int u,v,w;
			u=read(); v=read(); w=read();
			reach[u].push_back(make_pair(v,w));
			reach2[v].push_back(make_pair(u,w));
			e[i]={u,v,w};
		}
		lim=(int)sqrt(a[n])+1;
		work();
//		for(int i=1;i<=n;i++,putchar('\n'))
//			for(int j=1;j<=(int)sqrt(a[n])+1;j++,putchar(' '))
//				write(ok[i][j]);
		work2();
//		for(int i=1;i<=n;i++,putchar('\n'))
//			for(int j=1;j<=(int)sqrt(a[n])+1;j++,putchar(' '))
//				write(mx[i][j]);
		int ans=-1;
		for(int i=1;i<=m;i++){
			int cur=lim;
			for(int val=1;val<=lim;val++){
				while(cur&&mx[e[i][1]][cur]<val*e[i][2])
					cur--;
				if(ok[e[i][0]][val]&&cur)
					ans=max(ans,val*e[i][2]*cur);
			}
//			swap(e[i][0],e[i][1]);
//			cur=lim;
//			for(int val=1;val<=lim;val++){
//				while(cur&&mx[e[i][1]][cur]<val*e[i][2])
//					cur--;
//				if(ok[e[i][0]][val]&&cur)
//					ans=max(ans,val*e[i][2]*cur);
//			}
		}
		write(ans);
		putchar('\n');
		for(int i=1;i<=n;i++)
			reach[i].clear();
		for(int i=1;i<=n;i++)
			reach2[i].clear();
	}
	return 0;
}
```