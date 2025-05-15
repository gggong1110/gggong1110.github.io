---
author: gg_gong
pubDatetime: 2025-05-15
title: same-sum-subsets-editorial
draft: false
tags:
  - divide-in-the-middle
  - two-pointer
  - meet-in-the-middle
description:
  brief editorial to same sum subsets
---

# First Observation

First notice the special part to this problem of the sum of the elements in the array being smaller than 2^n-2.

What does this inform?

According to pigeonhole principle, this guarantees that there is at least one sum is able to be achieved by two different subsets.

# Second step

After noticing that it can't be impossible how to find the sum that can be obtained for multiple different sets?

Consider divide and conquer, if the number of sums between l and r is bigger than the length of this interval then continue searching in it's subinterval. This can guarantee to find a "multi" still because of pigeonhole principle.

## Little trick

Now how to find the number of sum less than or equal to a certain number. Meet in the middle!

This subproblem is exactly [[CEOI2015] Ice Hockey World Championship](https://www.acmicpc.net/problem/10958).

Using the idea of prefix sum thus gives us the sum of numbers within an interval.

# Final Steps

With this "multi" how to find the two disjoint subsets?

Consider an easier subproblem. Say the two sets is distinct but is allowed to share part of their elements.

Then for each left part sum in meet in the middle, try to find a corresponding right part sum. Using the idea of a mask in bitmask dp, record which elements are used. This gives which elements contributed to this final sum.

While this can be easily done using a map, it is too slow due to the insanely high constants. Then sort the right half sum, binary search! With good constants this might pass but two pointer is the better solution.

Finally, how to make them disjoint?

Well, consider this example:

3, 4, 1, 8

5, 4, 1, 7

Is this fine when you change it to:

3, 8

5, 7

Now by deleting the repeating elements, this problem is fully solved.

### P.S.

This problem is pretty strict on time constant. For example, changing the two pointer to the binary search when finding for the multi gets 2 tle.

## Implemtation

```cpp
// don't be like Dennis
// think before you speak
// everyone should orz Ian Wang
// he also likes quelqu'un
// sleep is superior ! Stop doing your problem and go relax and sleep now
#pragma GCC optimize("O3")
//#pragma comment(linker,"/stack:200000000")
//#pragma GCC target("sse,sse2,sse3,ssse3,sse4,popcnt,abm,mmx,avx,tune=native")
#include<bits/stdc++.h>
//#include<ext/pb_ds/assoc_container.hpp>
#define int long long
//using namespace __gnu_pbds;
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
int a[49];
int cnt;
int sum[(1<<20)+9];
int cpy[(1<<20)+9];
pair<int,int> pp[(1<<20)+9];
int cnt2;
int sum2[(1<<20)+9];
pair<int,int> p[(1<<20)+9];
//int cpy2[(1<<20)+9];
inline void dfs(int u,int cursum){
	if(u==1){
		sum[++cnt]=cursum;
		cpy[cnt]=cursum;
		pp[cnt]=make_pair(cursum,cnt);
		sum[++cnt]=cursum+a[u];
		cpy[cnt]=cursum+a[u];
		pp[cnt]=make_pair(cursum+a[u],cnt);
		return;
	}
	dfs(u-1,cursum);
	dfs(u-1,cursum+a[u]);
}
inline void dfs2(int u,int cursum){
	if(u==n/2+1){
		sum2[++cnt2]=cursum;
		p[cnt2]=make_pair(cursum,cnt2);
		sum2[++cnt2]=cursum+a[u];
		p[cnt2]=make_pair(cursum+a[u],cnt2);
		return;
	}
	dfs2(u-1,cursum);
	dfs2(u-1,cursum+a[u]);
}
int multi;
inline int find_len(int l,int r){
	return r-l+1;
}
unordered_map<int,int> recc;
inline int find_num(int u){
	if(recc[u])
		return recc[u];
	int num=0;
	int cur=cnt2;
	for(int i=1;i<=cnt;i++){
		while(cpy[i]+p[cur].first>u&&cur)
			cur--;
		num+=cur;
	}
//	cout<<endl;
	recc[u]=num;
	return num;
}
inline bool div_conq(int l,int r){
//	cout<<l<<" "<<r<<endl;
//	cout<<find_num(l-1)<<endl;
//	cout<<find_num(r)-find_num(l-1)<<endl;
	if(multi)
		return 1;
	if(find_num(r)-find_num(l-1)<=find_len(l,r))
		return 0;
	if(l==r){
		multi=l;
		return 1;
	}
	int mid=(l+r)>>1;
	if(div_conq(l,mid))
		return 1;
	div_conq(mid+1,r);
	return 1;
}
//unordered_map<int,int> mp;
int rec[3][49];
signed main(){
	n=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
//	sort(a+1,a+n+1);
//	for(int i=2;i<=n;i++)
//		if(a[i]==a[i-1]){
//			printf("1\n%lld\n1\n%lld",a[i],a[i]);
//			return 0;
//		}
	dfs(n/2,0);
//	printf("reach1");
	dfs2(n,0);
////	printf("%d %d\n",cnt,cnt2);	
//	for(int i=1;i<=cnt;i++)
//		printf("%d ",sum[i]);
//	for(int i=1;i<=cnt2;i++)
//		printf("%d ",sum2[i]);
//	for(int i=1;i<=cnt;i++)
//		cpy[i]=sum[i];
//	for(int i=1;i<=cnt2;i++)
//		cpy2[i]=sum2[i];
	sort(pp+1,pp+cnt+1);
	reverse(pp+1,pp+cnt+1);
	sort(cpy+1,cpy+cnt+1);
//	for(int i=1;i<=cnt2;i++)
//		p[i]=make_pair(sum2[i],i);
	sort(p+1,p+cnt2+1);
//	sort(cpy2+1,cpy2+cnt2+1);
	div_conq(1,(1ll<<n)-2);
//	printf("%lld\n",multi);
//	for(int i=1;i<=cnt2;i++)
//		mp[sum2[i]]=i;
	int cntt=0;
//	for(int i=1;i<=cnt;i++)
//		cout<<sum[i]<<" ";
//	cout<<endl;
//	for(int i=1;i<=cnt;i++)
//		printf("%d ",sum[i]);
	array<int,3> num;
	num[1]=0; num[2]=0;
	int curr=1;
	for(int i=1;i<=cnt;i++){
		if(pp[i].first>multi)
			continue;
		while(p[curr].first<multi-pp[i].first&&curr<=cnt2)
			curr++;
//		int l=1,r=cnt2;
//		int ans=0;
		int tmp=0;
//		while(l<=r){
//			int mid=(l+r)>>1;
//			if(p[mid].first<=multi-sum[i]){
//				l=mid+1;
//				ans=mid;
//			}
//			else
//				r=mid-1;
//		}
//		if(p[ans].first==multi-sum[i])
//			tmp=p[ans].second;
		if(p[curr].first==multi-pp[i].first)
			tmp=p[curr].second;
		if(pp[i].first<multi&&tmp&&cntt<2){
//			cout<<i<<" "<<tmp<<endl;
//			cout<<i<<" "<<mp[multi-sum[i]]-1<<endl;
			cntt++;
//			int tot=__builtin_popcount(i-1)+__builtin_popcount(mp[multi-sum[i]]-1);
//			printf("%lld\n",tot);
            int summ=0;
			for(int j=1;j<=n/2;j++)
				if((pp[i].second-1)&(1<<j-1))
					rec[cntt][++num[cntt]]=a[j];
//					printf("%lld ",a[j]);
//			int tmp=mp[multi-sum[i]]-1;
			tmp--;
			for(int j=n/2+1;j<=n;j++)
				if(tmp&(1<<(j-n/2-1)))
					rec[cntt][++num[cntt]]=a[j];
//					printf("%lld ",a[j]);
//			printf("\n");
//            printf("%lld\n",summ);
		}
		else if(pp[i].first==multi&&cntt<2){
//			cout<<i<<endl;
			cntt++;
//			int tot=__builtin_popcount(i-1);
//			printf("%lld\n",tot);
            int summ=0;
			for(int j=1;j<=n/2;j++)
				if((pp[i].second-1)&(1<<j-1))
					rec[cntt][++num[cntt]]=a[j];
//					printf("%lld ",a[j]);
//			printf("\n");
//            printf("%lld\n",summ);
		}
	}
//	if(cntt<2){
////		int tot=__builtin_popcount(mp[multi]-1);
////		printf("%lld\n",tot);
//		cntt++;
//        int summ=0;
//        int tmp=mp[multi]-1;
//		for(int i=n/2+1;i<=n;i++)
//			if(tmp&(1<<(i-n/2-1)))
//				rec[cntt][++num[cntt]]=a[i];
////				printf("%lld ",a[i]);
////		printf("\n");
////        printf("%lld\n",summ);
//	}
	map<int,bool> exs;
	for(int i=1;i<=num[1];i++)
		exs[rec[1][i]]=1;
	int numm=0;
	map<int,bool> exs2;
	for(int i=1;i<=num[2];i++)
		if(exs[rec[2][i]]){
			numm++;
			exs2[rec[2][i]]=1;
		}
	printf("%lld\n",num[1]-numm);
	for(int i=1;i<=num[1];i++)
		if(!exs2[rec[1][i]])
			printf("%lld ",rec[1][i]);
	printf("\n%lld\n",num[2]-numm);
	for(int i=1;i<=num[2];i++)
		if(!exs2[rec[2][i]])
			printf("%lld ",rec[2][i]);
	return 0;
}
```