---
author: gg_gong
pubDatetime: 2024-07-30
title: NOI2018归程editorial
draft: false
tags:
  - data-structure
  - kruskal reconstruction tree
  - binary jumping
  - dijkstra
description:
  short editorial to NOI2018归程
---

# Solution

Obviously we should do a dijkstra on node 1 and find the minimum distance from every node to 1 since 1 is the ending point for every query.

Using kruskal reconstruction tree, we could know the nodes that a point can reach when the amount of water is a certain number since it is just the subtree of the imaginary node with the lowest depth on it's path to the root that has the value bigger than the given p.

Since jumping with brute force will get TLE, consider optimizing the solution with binary jumping and that gets us AC.

### P.S.

Get the dijkstra with optimization of visited(ok) or else you might get TLE 60.

## Implemtation

```cpp
// spencer wang is very orz
// everyone should orz nyctivoe
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
int T,n,m;
int q,k,s;
int numnew;
int dst[200009];
int fa[400009],val[400009];
int mn[400009],fath[400009];
int st[20][400009];
bool ok[200009];
vector<int> reach2[400009];
struct forreach{
	int v,l,a;
};
vector<forreach> reach[200009];
struct edge{
	int u,v;
	int l,a;
}e[400009];
inline int find_dsu(int u){
	return u==fa[u]?u:fa[u]=find_dsu(fa[u]);
}
inline void merge_dsu(int u,int v){
	u=find_dsu(u); v=find_dsu(v);
	fa[v]=u;
}
inline bool cmp(edge x,edge y){
	return x.a>y.a;
}
inline void clear_all(){
	for(int i=1;i<=n;i++)
		reach[i].clear();
	for(int i=1;i<=n;i++)
		dst[i]=1e9;
	for(int i=1;i<=n;i++)
		ok[i]=0;
	for(int i=1;i<=2*n;i++)
		reach2[i].clear();
}
inline void dijkstra(int S=1){
	priority_queue<pair<int,int> > pq;
	dst[S]=0;
	pq.push(make_pair(dst[S],S));
	while(!pq.empty()){
		pair<int,int> tmp=pq.top();
		pq.pop();
//		cout<<tmp.first<<" "<<tmp.second<<endl;
		if(ok[tmp.second])
			continue;
		ok[tmp.second]=1;
		for(int i=0;i<reach[tmp.second].size();i++){
			int v=reach[tmp.second][i].v;
			if(dst[tmp.second]+reach[tmp.second][i].l<dst[v]){
				dst[v]=dst[tmp.second]+reach[tmp.second][i].l;
				pq.push(make_pair(-dst[v],v));
			}
		}
	}
}
inline void kruskal_reconstruction_tree(){
	sort(e+1,e+m+1,cmp);
	for(int i=1;i<=2*n;i++)
		fa[i]=i;
	for(int i=1;i<=m;i++){
		int u=e[i].u,v=e[i].v;
		u=find_dsu(u); v=find_dsu(v);
		if(u==v)
			continue;
		numnew++;
		fa[u]=numnew; fa[v]=numnew;
		val[numnew]=e[i].a;
		reach2[numnew].push_back(u); reach2[u].push_back(numnew);
		reach2[numnew].push_back(v); reach2[v].push_back(numnew);
		if(numnew==2*n-1)
			return;
	}
}
inline void prework_subtree_ans(int u,int father){
	mn[u]=(u<=n)?dst[u]:1e9;
	for(int i=0;i<reach2[u].size();i++){
		int v=reach2[u][i];
		if(v==father)
			continue;
		fath[v]=u;
		prework_subtree_ans(v,u);
		mn[u]=min(mn[u],mn[v]);
	}
}
inline void init_sparse_table(){
	for(int i=1;i<=2*n-1;i++)
		st[0][i]=fath[i];
	for(int i=1;i<=19;i++)
		for(int j=1;j<=2*n-1;j++)
			st[i][j]=st[i-1][st[i-1][j]];
}
inline int findlowest(int u,int mnn){
	for(int i=19;~i;i--)
		if(val[st[i][u]]>mnn)
			u=st[i][u];
	return u;
}
inline void debug_distance(){
	for(int i=1;i<=n;i++)
		printf("%d ",dst[i]);
	printf("\n");
}
inline void debug_tree(){
	for(int i=1;i<=2*n-1;i++){
		printf("i:%d\n",i);
		printf("reach2[i] size:%d\n",reach2[i].size());
		for(int j=0;j<reach2[i].size();j++)
			printf("%d ",reach2[i][j]);
		printf("\n");
	}
	for(int i=n+1;i<=2*n-1;i++)
		printf("%d ",val[i]);
	printf("\n");
}
inline void debug_min(){
	for(int i=1;i<=2*n-1;i++)
		printf("%d ",mn[i]);
	printf("\n");
}
inline void debug_sparse(){
	for(int i=0;i<=19;i++){
		printf("i:%d\n",i);
		for(int j=1;j<=2*n-1;j++)
			printf("%d ",st[i][j]);
		printf("\n");
	}
}
int main(){
	freopen("return.in","r",stdin);
	freopen("return.out","w",stdout);
	T=read();
	while(T--){
		n=read(); m=read();
		clear_all();
		numnew=n;
		for(int i=1;i<=m;i++){
			e[i].u=read(); e[i].v=read();
			e[i].l=read(); e[i].a=read();
			reach[e[i].u].push_back({e[i].v,e[i].l,e[i].a});
			reach[e[i].v].push_back({e[i].u,e[i].l,e[i].a});
		}
		dijkstra();
//		debug_distance();
		kruskal_reconstruction_tree();
//		debug_tree();
		prework_subtree_ans(numnew,0); // tree dp
//		debug_min();
		init_sparse_table();
//		debug_sparse();
		q=read(); k=read(); s=read();
		int lstans=0;
		while(q--){
			int v,p;
			v=read(); p=read();
			v=(v+k*lstans-1)%n+1; p=(p+k*lstans)%(s+1);
			v=findlowest(v,p);
			lstans=mn[v];
			printf("%d\n",mn[v]);
		}
	}
	return 0;
}
```