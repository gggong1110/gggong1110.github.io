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

# Election Promises

## Solution

(Sort of similar to previous problem after transforming the problem)

First do a topo sort, based on the reverse order, divide the nodes into groups. More specifically, label each node the mex value of the nodes that it can reach.

Call xx the xor sum of each of the groups, and consider the following sg function:

1. Call the sg value of the whole state val(whether all xx is 0 if yes then val=0 else nonzero).

2. After one operation starting with val=0, the val must then be nonzero since the xx value of the group containing the starting node must change/

3. After one operationn starting with val not zero, then choosing a node with the xx value nonzero, making it zero(if possible) and changing it's neighbors will always achieve a zero state. (Note that this is possible because the label of each node is it's neighbor's mex)

Then judge whether the initial state of val is 0, if yes then LOSE or else consider finding a possible node with label of the id of the highest nonzero xx value and change it's value and it's neighbors values.

## Code

```cpp
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
inline void write(int num){
	if(num<0){
		putchar('-');
		num=-num;
	}
	if(num>9)
		write(num/10);
	putchar(num%10+'0');
}
int n,m;
int a[200009];
int in[200009];
int xx[200009];
int mex[200009];
bool ok[200009];
queue<int> q;
vector<int> vec;
vector<int> reach[200009];
vector<int> reachback[200009];
int main(){
	n=read(); m=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	for(int i=1;i<=m;i++){
		int u,v;
		u=read(); v=read();
		reach[u].push_back(v);
//		reachback[v].push_back(u);
		in[v]++;
	}
	for(int i=1;i<=n;i++)
		if(!in[i])
			q.push(i);
	while(!q.empty()){
		int u=q.front();
		q.pop();
		vec.push_back(u);
		for(int v:reach[u]){
			in[v]--;
			if(!in[v])
				q.push(v);
		}
	}
	reverse(vec.begin(),vec.end());
	for(int u:vec){
		for(int v:reach[u])
			ok[mex[v]]=1;
		while(ok[mex[u]])
			mex[u]++;
		for(int v:reach[u])
			ok[mex[v]]=0;
	}
//	for(int i=1;i<=n;i++,putchar(' '))
//		write(mex[i]);
//	putchar('\n');
	for(int i=1;i<=n;i++)
		xx[mex[i]]^=a[i];
	int id=-1;
	for(int i=n;~i;i--)
		if(xx[i]){
			id=i;
			break;
		}
//	write(id);
//	putchar('\n');
	if(~id){
		printf("WIN\n");
		for(int u=1;u<=n;u++){
			if(mex[u]!=id)
				continue;
			if((a[u]^xx[id])>a[u])
				continue;
			a[u]^=xx[id];
			xx[id]=0;
			for(int v:reach[u]){
				if(!xx[mex[v]])
					continue;
				a[v]^=xx[mex[v]];
				xx[mex[v]]=0;
			}
		}
		for(int i=1;i<=n;i++,putchar(' '))
			write(a[i]);
	}
	else
		printf("LOSE\n");
	return 0;
}
```