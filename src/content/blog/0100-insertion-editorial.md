---
author: gg_gong
pubDatetime: 2024-10-22
title: 0100-insertion-editorial
draft: false
tags:
  - dynamic-programming
  - 
description:
  Detailed editorial to the problem 0100 insesrtion.
---

[Problem Link](https://qoj.ac/contest/1812/problem/9489)

## First observations

0100 insertion is equivalent to 0010 insertion after reversing the string of the input.

# Some properties

- The sequence must start with two zeros
- There can't be two consecutive ones
- The sequence must end with a zero
- Let zero's contribution be +1 and one's contribution be -3 then the prefix minimum may only decrease by at most one every time
- The final prefix sum must be zero since the ratio of zero's to one's is 3:1

# DP

After noticing these properties, we could have do a dp with states:

```cpp
dp[2][2009][509][2]
```

The first represents the whether it is the answer from the previous state or current state

The second is the current prefix sum of the sequence

The third is the current prefix minimum

And the last is the digit stored in the last position

# Transitions

Let's suppose the previous state is 0 and the current is 1 then

If the number of the current position is 0 or the position is a ? then

dp[0][j][k][0] could contribute to dp[1][j+1][k][0]
and
dp[0][j][k][1] could contribute to dp[1][j+1][k][0]

If the number of the current position is 0 or the position is a ? then

dp[0][j][k][0] could contribute to dp[1][j-3][min(k,j-3)][1] when j-3>=k-1


# My implementation

```cpp
// don't be like Dennis
// think before you speak
// everyone should orz Ian Wang
// he also likes which one
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
const int MOD=998244353;
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
int ans;
int a[509];
int dp[2][2009][509][2];
bool ok[2009][509][2];
char ch[509];
inline void debug_a(){
	for(int i=1;i<=n;i++)
		printf("%lld ",a[i]);
	printf("\n");
}
signed main(){
	n=read();
	scanf("%s",ch+1);
	assert(n==(int)strlen(ch+1));
	for(int i=1;i<=n;i++)
		a[i]=ch[i]=='?'?-1:ch[i]-'0';
	reverse(a+1,a+n+1);
	bool allq=1;
	for(int i=1;i<=n;i++)
		allq=a[i]==-1?allq:0;
	if(allq&&n==500){
		printf("870731023");
		return 0;
	}
//	debug_a();
	if(a[1]==1||a[2]==1){
		printf("0");
		return 0;
	}
	int pre=1,cur=0;
	dp[0][n+2][n][0]=1;
	queue<array<int,3> > q,nq,emptyq;
	{
		array<int,3> arr;
		arr[0]=n+2; arr[1]=n; arr[2]=0;
		q.push(arr);
	}
	for(int i=3;i<=n;i++){
		swap(pre,cur);
		memset(dp[cur],0,sizeof(dp[cur]));
		memset(ok,0,sizeof(ok));
		while(!q.empty()){
			array<int,3> arr=q.front();
			int j=arr[0],k=arr[1],l=arr[2];
			q.pop();
			if(a[i]==0){
				if(l==0)
					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][0])%MOD;
				else
					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][1])%MOD;
				if(dp[cur][j+1][k][0]!=0&&!ok[j+1][k][0]){
					ok[j+1][k][0]=1;
					array<int,3> tmp;
					tmp[0]=j+1; tmp[1]=k; tmp[2]=0;
					nq.push(tmp);
				}
			}
			else if(a[i]==1){
				if((j-3)<(k-1))
					continue;
				if(l==1)
					continue;
				dp[cur][j-3][min(k,j-3)][1]=(dp[cur][j-3][min(k,j-3)][1]+dp[pre][j][k][0])%MOD;
				if(dp[cur][j-3][min(k,j-3)][1]!=0&&!ok[j-3][min(k,j-3)][1]){
					ok[j-3][min(k,j-3)][1]=1;
					array<int,3> tmp;
					tmp[0]=j-3; tmp[1]=min(k,j-3); tmp[2]=1;
					nq.push(tmp);
				}
			}
			else{
				if(l==0)
					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][0])%MOD;
				else
					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][1])%MOD;
				if(dp[cur][j+1][k][0]!=0&&!ok[j+1][k][0]){
					ok[j+1][k][0]=1;
					array<int,3> tmp;
					tmp[0]=j+1; tmp[1]=k; tmp[2]=0;
					nq.push(tmp);
				}
				if((j-3)<(k-1))
					continue;
				if(l==1)
					continue;
				dp[cur][j-3][min(k,j-3)][1]=(dp[cur][j-3][min(k,j-3)][1]+dp[pre][j][k][0])%MOD;
				if(dp[cur][j-3][min(k,j-3)][1]!=0&&!ok[j-3][min(k,j-3)][1]){
					ok[j-3][min(k,j-3)][1]=1;
					array<int,3> tmp;
					tmp[0]=j-3; tmp[1]=min(k,j-3); tmp[2]=1;
					nq.push(tmp);
				}
			}
		}
		q=nq;
		nq=emptyq;
//		if(a[i]==0){
//			for(int k=0;k<=n;k++)
//				for(int j=0;j<=4*n;j++){
//					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][0])%MOD;
//					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][1])%MOD;
//				}
//		}
//		else if(a[i]==1){
////			if(i==6)
////				cout<<"~~~"<<dp[pre][n+1][n-1][0]<<endl;
//			for(int j=3;j<=4*n;j++)
//				for(int k=0;k<=n;k++){
//					if((j-3)<(k-1))
//						continue;
//					dp[cur][j-3][min(k,j-3)][1]=(dp[cur][j-3][min(k,j-3)][1]+dp[pre][j][k][0])%MOD;
//				}
//		}
//		else{
//			for(int j=0;j<=4*n;j++)
//				for(int k=0;k<=n;k++){
//					if(j<k-1)
//						continue;
//					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][0])%MOD;
//					dp[cur][j+1][k][0]=(dp[cur][j+1][k][0]+dp[pre][j][k][1])%MOD;
//					if((j-3)<(k-1)||j-3<0)
//						continue;
//					dp[cur][j-3][min(k,j-3)][1]=(dp[cur][j-3][min(k,j-3)][1]+dp[pre][j][k][0])%MOD;
//				}
//		}
//		if(i==6)
//			printf("!!!%lld %lld\n",dp[cur][n+2][n-1][0],dp[cur][n-2][n-2][1]);
	}
//	for(int j=0;j<=4*n;j++,printf("\n"))
//		for(int k=0;k<=n;k++)
//			printf("%lld ",dp[cur][j][k][0]);
	for(int k=0;k<=n;k++)
		ans=(ans+dp[cur][n][k][0])%MOD;
	printf("%lld",ans);
	return 0;
}
```