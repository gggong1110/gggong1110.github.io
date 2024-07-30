---
author: gg_gong
pubDatetime: 2024-07-21
title: Some-good-range-dp-problems
draft: false
tags:
  - dp
  - range-dp
description:
  Some good and challenging problems for practicing range dp. 
---

# [[Atcoder Beginner Contest 217 F] Make Pair](https://atcoder.jp/contests/abc217/tasks/abc217_f)

Noticing that the bound for n is 200, it is pretty obvious that this problem should be done with a classical range dp. 

### The DP state

In this problem, $dp[l][r]$ denotes the number of ways to choose everyone from $l$ to $r$.

We record $ok[l][r]$ as whether the $l-th$ person can be a pair with the $r-th$ person.

### The transitions

Obviously, if we have chosen all the middle pairs, everyone from $l+1$ to $r-1$, and $ok[l][r]=1$.Then we could only choose $l,r$ next, this gives a contribution of $dp[l+1][r-1]$ to $dp[l][r]$.

There is another situation, where we only need to merge one of the endpoints and one of the points in the middle, assuming that the point is called $x$. This means that everyone from $l$ to $x-1$ has a pair already and everyone from $x+1$ to $r-1$ has a pair already. We should also guaranteed that $x-l$ is an even number and $r-x-1$ is an even number. 

## The implementation
```cpp
// spencer wang is very orz
// everyone should orz nyctivoe
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
const int MOD=998244353;
int n,m;
int C[509][509];
int dp[509][509]; // dp[l][r] : number of possibles ways to merge together the interval [l,r]
bool ok[509][509];
inline void init(){
    for(int i=0;i<=500;i++){
        C[i][0]=1;
        for(int j=1;j<=i;j++)
            C[i][j]=(C[i-1][j-1]+C[i-1][j])%MOD;
    }
}
signed main(){
	n=read(); m=read();
    init();
    for(int i=1;i<=m;i++){
        int u,v;
        u=read(); v=read();
        ok[u][v]=1;
    }
    for(int l=1;l<=2*n;l++){
        int r=l-1;
        if(r<1)
            continue;
        dp[l][r]=1;
    }
    for(int l=1;l<=2*n;l++){
        int r=l+1;
        if(r>2*n)
            continue;
        if(ok[l][r])
            dp[l][r]=1;
    }
    for(int len=4;len<=2*n;len+=2)
        for(int l=1;l<=2*n;l++){
            int r=l+len-1;
            if(r>2*n)   
                continue;
            if(ok[l][r])
                dp[l][r]=(dp[l][r]+dp[l+1][r-1])%MOD;
            for(int i=l+2;i<=r;i+=2){
                if(ok[i][r])
                    dp[l][r]=(dp[l][r]+dp[l][i-1]*dp[i+1][r-1]%MOD*C[len/2][(i-l)/2]%MOD)%MOD;
            }
        }
    printf("%lld",dp[1][2*n]);
	return 0;
}
```

# [[USACO 2017 January] Subsequence Reversal Platinum](https://usaco.org/index.php?page=viewproblem2&cpid=698)

the editorial is under construction

# [[Atcoder Beginner Contest 219 H] Candles](https://atcoder.jp/contests/abc219/tasks/abc219_h)

the editorial is under construction

# [[Codeforces 1922F] Replace on Segment](https://codeforces.com/problemset/problem/1922/F)

the editorial is under construction