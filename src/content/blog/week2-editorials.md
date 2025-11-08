---
author: gg_gong
pubDatetime: 2025-09-18
title: week2-editorials
draft: false
tags:
  - divide and conquer optimization
  - persistent segment tree
  - construction
  - conclusion
  - bitmask
description:
  editorials to selected problems.
---

[Problem Link](https://qoj.ac/contest/2511/problem/14116)

# Solution

Consider a fundamental dp that resembles $dp_{i,j}$ being the minimum health at realm $i$ with level $j$ required to beat all of the levels.

This transition would be simple:

$dp_{i,j} = min_{k=j+1}^{min(m,j+num[i])} max(dp_{i+1,k}-h[k],1) + val(i,k-j)$

where $num[i]$ is the maximum amount of levels he could upgrade in realm $i$ and $h[k]$ is the amount of healing he receives at level $k$.

Now, what is $val(i,j)$? This is defined as the minimum health required to beat $j$ monsters in realm $i$. The way to calculate this is obvious, namely with a double prefix sum after sorting.

This lends a complexity of $O(nm^2)$.

Consider optimizing this naive dp. Observe that $dp_i$ only depends on $dp_{i+1}$ and the $k$ that a $j$ choose is strictly greater than the $k$ that $j'$ chooses (in this case assume $j'<j$). The proof using the quadrilateral inequality will be ignored here but with this property in mind, starting with the initial values at realm $n+1$, we could use a divide and conquer approach to calculate the dp values of each layer given the results of the higher layer.

Specifically, consider a divide and conquer that resembles the one below:

```cpp
inline void divconq(int u,int l=1,int r=m,int l2=1,int r2=m+1){
	int mid=(l+r)>>1;
	int curmn=(int)1e18;
	int id=-1;
	for(int i=max(l2,mid+1);i<=min(r2,mid+num[u]);i++)
		if(curmn>max(1ll,dp[u+1][i]-h[i])+tak[u][i-mid]){
			curmn=max(1ll,dp[u+1][i]-h[i])+tak[u][i-mid];
			id=i;
		}
	dp[u][mid]=curmn;
	if(l<mid)
		divconq(u,l,mid-1,l2,id);
	if(mid<r)
		divconq(u,mid+1,r,id,r2);
}
```

in this, we have the to get the values of $dp_{i,1}$ to $dp_{i,m}$ given $dp_{i+1,1}$ to $dp_{i+1,m+1}$. What we tried to do is for each middle value, find it's $k$ that will be able to update it and thus this gives the range for the left half and their possible range of selection of $k$ and the possible range of selection of $k$ for the right half.

[Problem Link](https://qoj.ac/contest/2509/problem/14096)

# Solution

A first simple observation is that there will be at most one exchange per set of positions. What this important property gives is that by noticing that $k<=5$, we could afford a bitmask to enumerate whether the color symbolizing the set of positions has been swapped internally. If it isn't swapped internally, we could view the positions as dedicated to certain numbers and that we must have to swap them over to the spot that they belong. After these swaps, we notice the number of swaps is exactly the length of the cycle minus one after we visualize each swap as an edge connecting the two swapped positions/numbers. However for the other positions that are in the bitmask, we could view them as equivalent for the set of positions and numbers. 

Now, for each bitmask, make a graph and shrink the points that have in and out degree one. We should have a graph with at most 5 points now and they might have multiple edges connecting the same pair. A conclusion for this is that by deleting the cycles according to their length, we could achieve the maximum number of cycles in the graph being deleted. Thus this problem is solved.

```cpp

inline int findmin(int mask){
	int curans=n;
	// mask represents whether all of color i is viewed as same/different
	for(int i=1;i<=k;i++)
		for(int j=1;j<=k;j++)
			num[i][j]=0;
	for(int i=1;i<=n;i++)
		cpy[i]=a[i];
	for(int i=1;i<=n;i++)
		pos[i]=rec[i];
	for(int i=1;i<=n;i++){
		if(mask&(1<<(col[i]-1)))
			continue;
		// force change part
		if(cpy[i]==i)
			num[col[i]][col[i]]++;
		else{
			pos[cpy[i]]=pos[i];
			swap(cpy[i],cpy[pos[i]]);
			pos[i]=i;
		}
	}
	for(int i=1;i<=n;i++)
		if(mask&(1<<(col[i]-1)))
			num[col[i]][col[cpy[i]]]++;
//	for(int i=1;i<=k;i++,putchar('\n'))
//		for(int j=1;j<=k;j++,putchar(' '))
//			write(num[i][j]);
	for(int len=1;len<=k;len++){
		iota(id+1,id+k+1,1);
		do{
			int mn=(int)1e9;
			for(int j=1;j<=len;j++){
				int nxt=j+1;
				if(nxt>len)
					nxt-=len;
				mn=min(mn,num[id[j]][id[nxt]]);
			}
			for(int j=1;j<=len;j++){
				int nxt=j+1;
				if(nxt>len)
					nxt-=len;
				num[id[j]][id[nxt]]-=mn;
			}
			curans-=mn;
		}while(next_permutation(id+1,id+k+1));
	}
	return curans;
}
```

[Problem Link](https://qoj.ac/contest/2509/problem/14090)

# Solution

The persistent segment tree is required due to the need for the historical versions storage. After permanentizing the tag to each of the nodes within the segment tree, the plus operation and the answer for the query of type 3 is trivial.

Consider how to complete the second operation? By using bitmask on the dimension of k, this could be easily solved since we have the information in the segtree regarding the min without the certain value in the dimension of k. And with some considerations of how values update, the answer can be easily maintained.

Below is some important parts of the implementation

```cpp
inline void set_sgt(int &u,int pre,int l,int r,int val){
	if(l<=tr[u].l&&tr[u].r<=r){
		u=++nP;
		tr[u]=tr[pre];
		addtg_sgt(u,val);
		return;
	}
	if(!u)
		u=++nP;
	else{
		int tmp=u;
		u=++nP;
		tr[u]=tr[tmp];
	}
	int mid=(tr[u].l+tr[u].r)>>1;
	if(l<=mid)
		set_sgt(tr[u].son[0],tr[pre].son[0],l,r,val-tr[u].tg+tr[pre].tg);
	if(r>mid)
		set_sgt(tr[u].son[1],tr[pre].son[1],l,r,val-tr[u].tg+tr[pre].tg);
	pushup_sgt(u);
	tr[u].val+=tr[u].tg;
}
```

```cpp
	for(int mask=0;mask<(1<<k);mask++)
		for(int i=1;i<=n;i++)
			for(int j=1;j<=k;j++)
				if(mask&(1<<(j-1)))
					val[mask][i]+=a[j][i];
	for(int mask=0;mask<(1<<k);mask++)
		build_sgt(rt[mask][0],1,n,mask);
	int num=0;
	while(q--){
		num++;
		int op;
		op=read();
		if(op==1){
			int t,pos,l,r,val;
			t=read(); pos=read(); l=read(); r=read(); val=read();
			for(int mask=0;mask<(1<<k);mask++){
				if(mask&(1<<(pos-1)))
					upd_sgt(rt[mask][num],rt[mask][t],l,r,val);
				else
					rt[mask][num]=rt[mask][t];
			}
		}
		else if(op==2){
			int t,pos,l,r,val;
			t=read(); pos=read(); l=read(); r=read(); val=read();
			for(int mask=0;mask<(1<<k);mask++){
				rt[mask][num]=rt[mask][t];
				if(mask&(1<<(pos-1)))
					set_sgt(rt[mask][num],rt[mask^(1<<(pos-1))][t],l,r,val);
			}
		}
		else{
			assert(op==3);
			int t,l,r;
			t=read(); l=read(); r=read();
			write(query_sgt(rt[(1<<k)-1][t],l,r));
			putchar('\n');
		}
	}
```

[Problem Link](https://qoj.ac/contest/2524/problem/14323)

# Solution

For every point, consider what other points is a diameter with it. Then divide the points based on this set for each point.

If there is only 2 sets of different points diameter pairs, construct a length of at least 2 chain hanging in between. Note that the length 1 causes more diameter pairs than given.

If there are more than 2 sets then try the situation of a flower graph with only one point having no pairing or having a root and $k$ points that have no diameter pairings and then the k each have sons of the diameter pair.