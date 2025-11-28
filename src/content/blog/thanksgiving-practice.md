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

# Election Promises (CF1149E)

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

# A Game on Strings (CF1037G)

## Solution

Precompute the sg function value for each of the interval between two same numbers. This is easy and you can simply just recurse when doing it and use precomputed values of shorter intervals and recording the values for the suffix of the prefix and the prefix of the suffix.

Doing a prefix xor now allows for faster query of the sg value of a whole precomputed interval and we only need to consider the prefix of suffix and suffix of prefix for each letter and do a memorized recursion.

## Code

```cpp
inline int presolve(int l,int r){
	int mask=0;
	for(int i=1;i<=26;i++){
		int fst=suf[i][l];
		int lst=pre[i][r];
		if(fst>lst)
			continue;
		int sgg=0;
		for(int j=pos[fst];j<pos[lst];j++)
			sgg^=sg[i][j];
		if(l!=fst){
			if(!ok[1][i][l]){
				ok[1][i][l]=1;
				val[1][i][l]=presolve(l,fst-1);
			}
			sgg^=val[1][i][l];
		}
		if(r!=lst){
			if(!ok[0][i][r]){
				ok[0][i][r]=1;
				val[0][i][r]=presolve(lst+1,r);
			}
			sgg^=val[0][i][r];
		}
		if(sgg<26)
			mask|=(1<<sgg);
	}
	for(int i=0;i<=26;i++)
		if(!(mask&(1<<i)))
			return i;
}
```

# ABC Ultimatum (AGC055D)

## Solution

Consider a dp[i][a][b][m1][m2][m3] representing in the first i digits, there exists a As, b Bs, and m1,m2,m3 represent max(c-b),max(b-a),max(a-c) respectively.

We claim that for every prefix, m1 is the maximum number of CAB that the string can have, and for m2 and m3, max number of BCA and ABC respectively. This is due to the only inversion of positions in one of the forms compared to the other two forms with certain two letters.

Now we have to claim that this is a sufficient transformation of the problem and no more or less is needed to make the problem equivalent. Obviously it is necessary as we already shown and to prove it is enough every triplet is a correct cycle around the order and thus correspond to each position.

Note that m1+m2+m3<=n due to the limited number of 3 letter subsequences to form. 

## Code

Too trivial