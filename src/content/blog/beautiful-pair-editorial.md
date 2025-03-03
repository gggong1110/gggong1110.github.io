---
author: gg_gong
pubDatetime: 2025-03-03
title: beautiful-pair-editorial
draft: false
tags:
  - data-structure
  - persistent segment tree
  - sparse table
  - divide and conquer
description:
  short editorial to beautiful pair
---

# Solution

Consider using divide and conquer to split the interval into three: the left part, the middle node(here for simplicity of the problem, make the middle number the maximum in the soon to be divided interval), and the right part.

First consider how to find the maximum number in an interval and it can be easily be solved by initiating a sparse table beforehand. Remember the query for a maximum element is in O(1) time.

With the middle/maximum element is already found, consider the contribution that an interval gives if it contains/ passes through the middle element and now consider how to know which numbers work.

Since the middle/maximum element in the interval is already determined, it is easy to know what is the biggest number that can be acceptable for a given right/left end and this can be maintained by using a persistent segment tree.

As the sequence could be gradually decreasing/increasing, only using [l,mid] or [mid,r] might yield a complexity of O(n^2log(n)), check the shorter interval and it will give O(nlog^2(n)) complexity. The complexity analysis will be "trivial" and left to the reader as an exercise.

## P.S

Remember to do discretization to the initial a array for constant issues.

Remember to have long long or else it's 80 points.

## Implemtation

```cpp
// don't be like Dennis
// think before you speak
// everyone should orz Ian Wang
// he also likes quelqu'un
// sleep is superior ! Stop doing your problem and go relax and sleep now
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
int n;
int a[100009];
inline int find_len(int l,int r){
	return r-l+1;
}
inline int check_min(int u,int v){
	return a[u]>=a[v]?u:v;
}
int st[20][100009];
inline void init_st(){
	iota(st[0]+1,st[0]+n+1,1);
	for(int i=1;i<=19;i++)
		for(int j=1;j<=n-(1<<i)+1;j++)
			st[i][j]=check_min(st[i-1][j],st[i-1][j+(1<<i-1)]);
}
inline int query_st(int l,int r){
	int lg=__lg(find_len(l,r));
	return check_min(st[lg][l],st[lg][r-(1<<lg)+1]);
}
int nP;
int rt[100009];
struct pst{
	int son[2];
	int num;
}tr[5000009];
inline void ins_pst(int l,int r,int &u,int lst,int pos){
	u=++nP;
	tr[u]=tr[lst];
	tr[u].num=tr[lst].num+1;
	if(l==r)
		return;
	int mid=(l+r)>>1;
	if(pos<=mid)
		ins_pst(l,mid,tr[u].son[0],tr[lst].son[0],pos);
	else
		ins_pst(mid+1,r,tr[u].son[1],tr[lst].son[1],pos);
}
inline int query_pst(int u,int v,int l,int r,int l2,int r2){
	if(l2>r||l>r2)
		return 0;
	if(l2<=l&&r<=r2)
		return tr[u].num-tr[v].num;
	int mid=(l+r)>>1;
	if(l2>mid)
		return query_pst(tr[u].son[1],tr[v].son[1],mid+1,r,l2,r2);
	if(r2<=mid)
		return query_pst(tr[u].son[0],tr[v].son[0],l,mid,l2,r2);
	return query_pst(tr[u].son[0],tr[v].son[0],l,mid,l2,r2)+query_pst(tr[u].son[1],tr[v].son[1],mid+1,r,l2,r2);
}
int cnt;
int ans;
int lsh[100009];
inline void div_conq(int l,int r){
	if(l>r)
		return;
	if(l==r){
		if(lsh[a[l]]==1) // 1 * 1 <= 1
			ans++;
		return;
	}
	int mid=query_st(l,r);
//	cout<<mid<<endl;
	if(find_len(l,mid)<=find_len(mid+1,r)){
		for(int i=l;i<=mid;i++){
			int ub=upper_bound(lsh+1,lsh+cnt+1,lsh[a[mid]]/lsh[a[i]])-lsh-1;
			ans+=query_pst(rt[r],rt[mid-1],1,cnt,1,ub);
		}
	}
	else{
		for(int i=mid;i<=r;i++){
			int ub=upper_bound(lsh+1,lsh+cnt+1,lsh[a[mid]]/lsh[a[i]])-lsh-1;
//			cout<<ub<<endl;
			ans+=query_pst(rt[mid],rt[l-1],1,cnt,1,ub);
//			cout<<query_pst(rt[mid],rt[l-1],1,cnt,1,ub)<<endl;
		}
	}
	div_conq(l,mid-1);
	div_conq(mid+1,r);
}
signed main(){
	n=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	for(int i=1;i<=n;i++)
		lsh[i]=a[i];
	sort(lsh+1,lsh+n+1);
	cnt=unique(lsh+1,lsh+n+1)-lsh-1;
	for(int i=1;i<=n;i++)
		a[i]=lower_bound(lsh+1,lsh+cnt+1,a[i])-lsh;
	init_st();
//	cout<<cnt<<endl;
	for(int i=1;i<=n;i++)
		ins_pst(1,cnt,rt[i],rt[i-1],a[i]);
//	for(int i=1;i<=n;i++)
//		cout<<rt[i]<<" ";
//	cout<<endl;
//	cout<<nP<<endl;
//	for(int i=1;i<=nP;i++)
//		cout<<tr[i].num<<" ";
//	cout<<endl;
	div_conq(1,n);
	printf("%lld",ans);
	return 0;
}
```