---
author: gg_gong
pubDatetime: 2024-07-31
title: NOI2017蚯蚓排队editorial
draft: false
tags:
  - data-structure
  - hash-table
  - linked-list
description:
    editorial for NOI2017蚯蚓排队
---

# Solution

Since k is less than or equal to 50, consider just using a hash table to record all the occurences(AC Automaton should also be fine).

Since merging and spliting only affects the indexes near it, just brute force the new contributions. For the query, for every length k interval, try to find it's value in the hash table.

## P.S.

Strict time limit and loj array size limit (2GB being useless)

## Implementation

```cpp
// don't be like Dennis
// think before you speak
// spencer wang is very orz
// everyone should orz nyctivoe
// sleep is superior ! Stop doing your problem and go relax and sleep now
#include<bits/stdc++.h>
//#define int unsigned long long
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
const int MOD=998244353;
const int bs=7307;
int n,q,numE;
int cnt[4000009];
int a[4000009],reco[4000009];
int hd[4000009];
int lst_linkedlist[4000009],nxt_linkedlist[4000009];
ull pw[109],forhash[40009];
char ch[10000009];
struct edge{
	ull to;
	int cnt,nxt;
}e[30000009];
inline void add_hash_table(ull u,int val){
	int key=((int)u%(4000000)+4000000)%(4000000);
	for(int i=hd[key];i;i=e[i].nxt)
		if(e[i].to==u){
			e[i].cnt+=val;
			return;
		}
	e[++numE]={u,val,hd[key]};
	hd[key]=numE;
}
inline void print(int key){
	cout<<key<<endl;
}
inline int query_hash_table(ull u){
	int key=((int)u%(4000000)+4000000)%(4000000);
	for(int i=hd[key];i;i=e[i].nxt)
		if(e[i].to==u)
			return e[i].cnt;
	return 0;
}
inline ull gethash(int l,int r){
	return forhash[r]-forhash[l-1]*pw[r-l+1];
}
inline void connect_ht(int u,int v){
	int curl=51,curr=50;
	for(int i=1;i<=100;i++)
		reco[i]=0;
	for(int i=u;i&&curl>1;i=lst_linkedlist[i])
		reco[--curl]=a[i];
	for(int i=v;i&&curr<=100;i=nxt_linkedlist[i])
		reco[++curr]=a[i];
	for(int i=1;i<=curr;i++)
		forhash[i]=forhash[i-1]*bs+reco[i];
	for(int i=curl;i<=50;i++)
		for(int j=51;j<=min(curr,100);j++)
			add_hash_table(gethash(i,j),1);
	nxt_linkedlist[u]=v; lst_linkedlist[v]=u;
}
inline void split_ht(int u,int v){
	int curl=51,curr=50;
	for(int i=1;i<=100;i++)
		reco[i]=0;
	for(int i=u;i&&curl>1;i=lst_linkedlist[i])
		reco[--curl]=a[i];
	for(int i=v;i&&curr<=100;i=nxt_linkedlist[i])
		reco[++curr]=a[i];
	for(int i=1;i<=curr;i++)
		forhash[i]=forhash[i-1]*bs+reco[i];
	for(int i=curl;i<=50;i++)
		for(int j=51;j<=min(curr,100);j++)
			add_hash_table(gethash(i,j),-1);
	nxt_linkedlist[u]=0; lst_linkedlist[v]=0;
}
int main(){
	n=read(); q=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	pw[0]=1;
	for(int i=1;i<=100;i++)
		pw[i]=pw[i-1]*bs;
	for(int i=1;i<=n;i++)
		cnt[a[i]]++;
	while(q--){
		int op;
		op=read();
		if(op==1){
			int u,v;
			u=read(); v=read();
			connect_ht(u,v);
		}
		else if(op==2){
			int u;
			u=read();
			split_ht(u,nxt_linkedlist[u]);
		}
		else{
			int k,len;
			ll ans=1;
			ull hsh=0;
			scanf("%s",ch+1); k=read();
			len=strlen(ch+1);
			if(k==1){
				for(int i=1;i<=len;i++)
					ans=ans*cnt[ch[i]-'0']%MOD;
				printf("%lld\n",ans);
			}
			else{
				for(int i=1;i<=len;i++){
					hsh=hsh*bs+ch[i]-'0';
					if(i>k){
						hsh-=pw[k]*(ch[i-k]-'0');
						ans=ans*query_hash_table(hsh)%MOD;
					}
					else if(i==k)
						ans=ans*query_hash_table(hsh)%MOD;
				}
				printf("%lld\n",ans);
			}
		}
	}
	return 0;
}
```