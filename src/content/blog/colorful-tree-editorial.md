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

Since this problem requires us to find the distance between two points on the tree, it should be obvious that we have the formula: distance = d[u]+d[v]-2*d[findlca(u,v)] where u and v are the two points on the tree. Note that in this specific problem, we are required to find the lowest common ancestor in O(1) time. This requires the use of building a sparse table on the dfn order(which is the in order in my code) in O(nlogn) time. More details are provided at the bottom of this editorial.

For this problem, we could observe that we should build the shape of the tree first instead of dynamically maintaining the shape of the tree. From this, we could view every operation as a process of activating a node. 

Considering the fact that there may be a lot of different colors that exists in the tree.



## My implementation

```
// spencer wang is very orz rp++
// everyone should orz nyctivoe rp++
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
int T,n,q,timer;
int fa[1000009],colors[1000009];
ll d[1000009];
int level[1000009];
int in[1000009];//out[500009]; // in array is basically the dfn array for the nodes in the tree
//int rec[500009]; // used to reflect back the in order
int st_min[20][1000009]; // st_min[i][j] helps helping the lca using help from the in order
vector<pair<int,int> > reach[1000009]; // only recording the sons of the node and the weights of the edges connecting them
struct querying{
	int op;
	int c;
	ll d;
	int activate;
}query[1000009];
inline void dfs(int u){
	in[u]=++timer;
	st_min[0][in[u]]=u;
//	rec[timer]=u;
	for(int i=0;i<reach[u].size();i++){
		pair<int,int> tmp=reach[u][i];
		level[tmp.first]=level[u]+1; 
		// as in the bfs for the dinic, setting 1 as the root and computing the level each node belong to (used for sparse table)
		d[tmp.first]=d[u]+tmp.second; // used for computing the distance function later on
		dfs(tmp.first);
	}
//	out[u]=timer;
}
inline void cout_dfs_stuff(){
	printf("%d\nrec:\n",timer);
//	for(int i=1;i<=timer;i++)
//		printf("%d ",rec[i]);
	printf("\nin:\n");
	for(int i=1;i<=timer;i++)
		printf("%d ",in[i]);
	printf("\nout:\n");
//	for(int i=1;i<=timer;i++)
//		printf("%d ",out[i]);
	printf("\nlevel:\n");
	for(int i=1;i<=timer;i++)
		printf("%d ",level[i]);
	printf("\nd:\n");
	for(int i=1;i<=timer;i++)
		printf("%d ",d[i]);
	printf("\n");
}
inline int check_min(int u,int v){
	return level[u]<level[v]?u:v;
}
inline void init_sparse_table(){
//	for(int j=1;j<=n;j++)
//		st_min[0][j]=rec[j];
	for(int i=1;i<=19;i++)
		for(int j=1;j<=n-(1<<i)+1;j++)
			st_min[i][j]=check_min(st_min[i-1][j],st_min[i-1][j+(1<<i-1)]);
}
inline void cout_sparse_table(){
	printf("st:\n");
	for(int i=0;i<=ceil(log2(500000));i++){
		printf("%d\n\n",i);
		for(int j=1;j<=n-(1<<i)-1;j++)
			printf("%d %d\n",j,st_min[i][j]);
	}
}
inline int find_lca(int u,int v){
	if(u==v)
		return u;
	u=in[u]; v=in[v];
	if(u>v)
		swap(u,v);
	int len=__lg(v-u);
	return fa[check_min(st_min[len][u+1],st_min[len][v-(1<<len)+1])];
}
inline ll find_distance(int u,int v){
	ll cnt=(u==0)+(v==0);
	if(cnt>0)
		return -cnt;
	return d[u]+d[v]-2ll*d[find_lca(u,v)];
}
struct diameter{
	pair<int,int> furthest;
//	int dst;
};
inline int check_diameter(diameter u,diameter v){
	return find_distance(u.furthest.first,u.furthest.second)>find_distance(v.furthest.first,v.furthest.second);
}
inline diameter check_max(diameter ans,int u,int v){
	ll dist=find_distance(u,v);
	if(find_distance(ans.furthest.first,ans.furthest.second)<dist){
		ans.furthest=make_pair(u,v);
//		ans.dst=dist;
	}
	return ans;
}
inline diameter merge(diameter u,diameter v){
	diameter ans=u;
	ans=check_max(ans,v.furthest.first,v.furthest.second);
	ans=check_max(ans,u.furthest.first,v.furthest.first);
	ans=check_max(ans,u.furthest.first,v.furthest.second);
	ans=check_max(ans,u.furthest.second,v.furthest.first);
	ans=check_max(ans,u.furthest.second,v.furthest.second);
	return ans;
}
int nP;
ll rt[1000009]; // recording the "root" to each of the colors
struct dynamic_open_point_sgt1{
	int son[2];
	diameter longest;
}tr[20000009];
inline void pushup_dynamic_open_point_sgt1(int u){
	if(tr[u].son[0]==0&&tr[u].son[1]==0){
		tr[u].longest.furthest=make_pair(0,0);
		return;
	}
	if(tr[u].son[0]==0){
		tr[u].longest=tr[tr[u].son[1]].longest;
		return;
	}
	if(tr[u].son[1]==0){
		tr[u].longest=tr[tr[u].son[0]].longest;
		return;
	}
	tr[u].longest=merge(tr[tr[u].son[0]].longest,tr[tr[u].son[1]].longest);
}
inline int ins_dynamic_open_point_sgt1(int u,int l,int r,int id){
	if(u==0)
		u=++nP;
//	tr[u].longest.dst=-1;
	if(l==r){
		tr[u].longest.furthest=make_pair(id,id);
//		tr[u].longest.dst=0;
		return u;
	}
	int mid=(l+r)>>1;
	if(id<=mid)
		tr[u].son[0]=ins_dynamic_open_point_sgt1(tr[u].son[0],l,mid,id);
	else
		tr[u].son[1]=ins_dynamic_open_point_sgt1(tr[u].son[1],mid+1,r,id);
	pushup_dynamic_open_point_sgt1(u);
	return u;
}
inline int del_dynamic_open_point_sgt1(int u,int l,int r,int id){
	if(u==0)
		u=++nP;
	if(l==r){
		tr[u].longest.furthest=make_pair(0,0);
//		tr[u].longest.dst=-1;
		return u;
	}
	int mid=(l+r)>>1;
	if(id<=mid)
		tr[u].son[0]=del_dynamic_open_point_sgt1(tr[u].son[0],l,mid,id);
	else
		tr[u].son[1]=del_dynamic_open_point_sgt1(tr[u].son[1],mid+1,r,id);
	pushup_dynamic_open_point_sgt1(u);
	return u;
}
inline void re_init_dynamic_open_point_sgt1(){
	for(int i=1;i<=q+1;i++)
		rt[i]=0;
	for(int i=1;i<=nP;i++){
		tr[i].son[0]=0; tr[i].son[1]=0;
		tr[i].longest.furthest=make_pair(0,0);
//		tr[i].longest.dst=-1;
	}
	nP=0;
}
struct segtree{
	int l,r;
	diameter longest[2]; 
	// longest[0] records the diameter when the id of the nodes are within [l,r]
	// longest[1] records the diameter when the id of the nodes are within [l,r] and THEY ARE DIFFERENT IN COLORS
}tr2[4000009];
inline diameter merge2(diameter u,diameter v,diameter x,diameter y){
	diameter ans=x;
	ans=check_max(ans,y.furthest.first,y.furthest.second);
	ans=check_max(ans,u.furthest.first,v.furthest.first);
	ans=check_max(ans,u.furthest.first,v.furthest.second);
	ans=check_max(ans,u.furthest.second,v.furthest.first);
	ans=check_max(ans,u.furthest.second,v.furthest.second);
	ans=check_max(ans,u.furthest.first,y.furthest.first);
	ans=check_max(ans,u.furthest.first,y.furthest.second);
	ans=check_max(ans,u.furthest.second,y.furthest.first);
	ans=check_max(ans,u.furthest.second,y.furthest.second);
	ans=check_max(ans,x.furthest.first,v.furthest.first);
	ans=check_max(ans,x.furthest.first,v.furthest.second);
	ans=check_max(ans,x.furthest.second,v.furthest.first);
	ans=check_max(ans,x.furthest.second,v.furthest.second);
	ans=check_max(ans,x.furthest.first,y.furthest.first);
	ans=check_max(ans,x.furthest.first,y.furthest.second);
	ans=check_max(ans,x.furthest.second,y.furthest.first);
	ans=check_max(ans,x.furthest.second,y.furthest.second);
	return ans;
}
inline void pushup_sgt(int u){
	tr2[u].longest[0]=merge(tr2[u*2].longest[0],tr2[u*2+1].longest[0]);
	tr2[u].longest[1]=merge2(tr2[u*2].longest[0],tr2[u*2+1].longest[0],tr2[u*2].longest[1],tr2[u*2+1].longest[1]);
}
inline void build_sgt(int u,int l,int r){
	tr2[u].l=l; tr2[u].r=r;
	if(l==r)
		return;
	int mid=(l+r)>>1;
	build_sgt(u*2,l,mid);
	build_sgt(u*2+1,mid+1,r);
}
inline void upd_sgt(int u,int l,int r,int color,pair<int,int> rec){
//	if(tr2[u].l>color||tr2[u].r<color)
//		return;
//	if(tr2[u].l==tr2[u].r){
	if(l==r){
		tr2[u].longest[0].furthest=rec;
//		tr2[u].longest[0].dst=find_distance(rec.first,rec.second);
		tr2[u].longest[1].furthest=make_pair(0,0);
//		tr2[u].longest[1].dst=-1;
		return;
	}
	int mid=(l+r)>>1;
	if(color<=mid)
		upd_sgt(u*2,l,mid,color,rec);
	else
		upd_sgt(u*2+1,mid+1,r,color,rec);
	pushup_sgt(u);
}
inline void clear_sgt(int u,int l,int r){
	tr2[u].longest[0].furthest=make_pair(0,0);
//	tr2[u].longest[0].dst=-1;
	tr2[u].longest[1].furthest=make_pair(0,0);
//	tr2[u].longest[1].dst=-1;
	if(l==r)
		return;
	int mid=(l+r)>>1;
	clear_sgt(u*2,l,mid);
	clear_sgt(u*2+1,mid+1,r);
}
inline void cout_sgt(int u){
	printf("node: %d\n%d %d\n",u,tr2[u].l,tr2[u].r);
//	printf("%d %d %d\n",tr2[u].longest[0].furthest.first,tr2[u].longest[0].furthest.second,tr2[u].longest[0].dst);
//	printf("%d %d %d\n",tr2[u].longest[1].furthest.first,tr2[u].longest[1].furthest.second,tr2[u].longest[1].dst);
	if(tr2[u].l==tr2[u].r)
		return;
	cout_sgt(u*2);
	cout_sgt(u*2+1);
}
signed main(){
	T=read();
	while(T--){
		n=1; timer=0; nP=0;
		q=read(); colors[1]=read();
//		build_sgt(1,1,q+1);
//		cout_sgt(1);
		for(int i=1;i<=q;i++){
			int op;
			op=read();
			query[i].op=op;
			if(op==0){
				int x,c;
				ll d;
				x=read(); c=read(); 
				scanf("%lld",&d);
				query[i].c=c; query[i].d=d;
				n++; fa[n]=x;
				reach[x].push_back(make_pair(n,d));
				query[i].activate=n;
			}
			else{
				int x,c;
				x=read(); c=read();
				query[i].c=c; query[i].activate=x;
			}
		}
		for(int i=1;i<=n;i++){
			level[i]=0; d[i]=0; in[i]=0; 
			if(i!=1)
				colors[i]=0;
			for(int j=0;j<=19;j++)
				st_min[j][i]=0;
		}
		dfs(1);
//		for(int i=1;i<=n;i++){
//			printf("%d\n\n",i);
//			for(int j=0;j<reach[i].size();j++){
//				pair<int,int> tmp=reach[i][j];
//				printf("%d %d\n",tmp.first,tmp.second);
//			}
//		}
//		cout_dfs_stuff();
		init_sparse_table();
//		cout_sparse_table();
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
		timer=0;
		for(int i=1;i<=q;i++)
			reach[i].clear();
		re_init_dynamic_open_point_sgt1();
		clear_sgt(1,1,q+1);
	}
	return 0;
}
```