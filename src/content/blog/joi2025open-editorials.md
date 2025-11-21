---
author: gg_gong
pubDatetime: 2025-11-20
title: JOI Open 2025 editorials
draft: false
tags:
  - persistent segment tree
  - observation
  - conclusion
  - binary search
description:
  editorials to selected problems.
---

# Bubble Sort Machine

## Simplified Statement

Given an array a of length n. There are two types of operations:

1. From 1 to n-1, swap $a_i$ and $a_{i+1}$ if $a_i>a_{i+1}$

2. Find the sum of the numbers between the positions $l$ and $r$

## Solution

### Crucial Property

After $i$ times of operation 1, the interval $[1,r]$ contains the first $r$ minimum numbers within the interval $[1,r+i]$. 

For simple proof, consider each number could only move forward one spot each operation 1 which gives the right endpoint of the interval, and the biggest numbers will always move right until they meet a bigger number and per turn one of the biggest number will move exceed the boundary of $r$ thus keeping the smaller numbers still within the boundary.

## Persistent Segtree

After noticing the crucial property in the bubble sort process, we are easily able to maintain the k-th smallest number and the sums using a persistent segtree. The position issue could also be easily solved with creating copies at different positions. Note that the segtree is on values.

## Part of the Code

```cpp
	n=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	for(int i=1;i<=n;i++)
		lsh[i]=a[i];
	sort(lsh+1,lsh+n+1);
	int cnt=unique(lsh+1,lsh+n+1)-lsh-1;
	for(int i=1;i<=n;i++)
		a[i]=lower_bound(lsh+1,lsh+cnt+1,a[i])-lsh;
	for(int i=1;i<=n;i++)
		ins_pst(rt[i],rt[i-1],1,cnt,a[i]);
	q=read();
	int cur=0;
	while(q--){
		int op;
		op=read();
		if(op==1)
			cur++;
		else{
			int l,r;
			l=read(); r=read();
			write(query_pst(rt[min(n,r+cur)],1,cnt,r)-query_pst(rt[min(n,l+cur-1)],1,cnt,l-1));
			putchar('\n');
		}
	}
```

Also note that in the code, the values are being mapped to equal representations with smaller values.

# Lottery

## Simplified Statement

Given n bags. Each bag contains $a_i$ red balls and $b_i$ blue balls.

For each query given $l$ and $r$, answer the following: each turn pick out a ball from each bag in the range, what is the maximum number of times such that after you finished picking a ball from each bag, the number of red and blue balls you have is the same. The length of the interval is guaranteed to be even.

## Solution

## 32 Points

Let's do binary search since the answer is obviously monotonic. Consider what is the quintessential conditions for a $ans$ to be able to be achieved.

Here are the sufficient conditions to satisfy:

1. $ans<= min_{i=l}^{r} (a_i+b_i)$
2. $\sum_{i=l}^{r} min(a_i,ans) >= ans*(r-l+1)/2$
3. $\sum_{i=l}^{r} min(b_i,ans) >= ans*(r-l+1)/2$

Simple proof is that for the first one we have to satisfy we could at least play $ans$ number of games to be in consideration. For numbers 2 and 3, it is obvious that it is a necessary condition, the sufficient proof could be done using greedy and induction which won't be expanded here.

The time complexity is obviously $O(q*len log (1e9))$.

## 77 Points

The process for checking the satisfaction of the second and third conditions could be easily maintained by a persistent segtree so new complexity is $O(nlog(n)log(1e9))$. Note that the first condition and the upper bound of the binary search could easily be maintained by an easy data structure such as segtree or sparse table. You need to maintain the range sum and the range number and query for the two up to ans.

## 100 Points

To reduce a log factor in the code, the process of binary searching is just walking down on the persistent segtree, so maintain the number bigger than current range and sum of number that is smaller than the current range and search on the current node of the persistent segtree. Time complexity is $O((n+q)log(1e9))$.

## Parts of the Code

```cpp

inline bool OK(ll u,int L,int R){
//	int pos=upper_bound(lsh+1,lsh+cnt+1,u)-lsh;
//	pos--;
//	int pos=u;
//	pair<ll,int> tmp=query_pst(curr0,1,cnt,pos,0);
//	pair<ll,int> tmp2=query_pst(curl0,1,cnt,pos,0);
	pair<ll,int> tmp=make_pair(tr[0][tr[0][curr0].son[0]].tot,tr[0][tr[0][curr0].son[1]].num);
	pair<ll,int> tmp2=make_pair(tr[0][tr[0][curl0].son[0]].tot,tr[0][tr[0][curl0].son[1]].num);
//	cout<<tmp.first<<" "<<tmp.second<<" "<<tmp2.first<<" "<<tmp2.second<<endl;
	ll sum1=tmp.first-tmp2.first+1ll*(tmp.second)*u-1ll*(tmp2.second)*u+numm1*u+toad1;
	pair<ll,int> tmpp=make_pair(tr[1][tr[1][curr1].son[0]].tot,tr[1][tr[1][curr1].son[1]].num);
	pair<ll,int> tmpp2=make_pair(tr[1][tr[1][curl1].son[0]].tot,tr[1][tr[1][curl1].son[1]].num);
//	pair<ll,int> tmpp=query_pst(curr1,1,cnt,pos,1);
//	pair<ll,int> tmpp2=query_pst(curl1,1,cnt,pos,1);
	ll sum2=tmpp.first-tmpp2.first+1ll*(tmpp.second)*u-1ll*(tmpp2.second)*u+numm2*u+toad2;
//	cout<<u<<":";
//	cout<<pos<<" ";
//	cout<<sum1<<" "<<sum2<<endl;
	ll mnn=u*1ll*(1ll*(R-L+1)/2);
	bool tpp=(min(sum1,sum2)>=mnn)&&(u<=mx);
	curr0=tr[0][curr0].son[tpp];
	curl0=tr[0][curl0].son[tpp];
	curr1=tr[1][curr1].son[tpp];
	curl1=tr[1][curl1].son[tpp];
	if(tpp){
		toad1+=tmp.first-tmp2.first;
		toad2+=tmpp.first-tmpp2.first;
		return 1;
	}
	numm1+=tmp.second-tmp2.second;
	numm2+=tmpp.second-tmpp2.second;
	return 0;
}
int max_prize(int L,int R){
	L++; R++;
	mx=query_sgt(1,L,R);
	ll l=0,r=cnt;
	ll ans=0;
//	cout<<l<<" "<<r<<endl;
	curr0=rt[0][R];
	curl0=rt[0][L-1];
	curr1=rt[1][R];
	curl1=rt[1][L-1];
	toad1=0; toad2=0;
	numm1=0; numm2=0;
	while(l<r){
		ll mid=(l+r+1)>>1;
		if(OK(mid,L,R)){
			l=mid;
			ans=mid;
		}
		else
			r=mid-1;
//		cout<<mid<<" "<<toad1<<" "<<toad2<<" "<<curr0<<" "<<curl0<<endl;
	}
//	if(OK(ans+1,L,R))
//		ans++;
//	if(!OK(ans,L,R))
//		ans--;
	return ans;
}
```

# Telepathy

Maybe Later