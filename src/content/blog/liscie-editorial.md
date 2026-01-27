---
author: gg_gong
pubDatetime: 2026-01-26
title: Liscie editorial
draft: false
tags:
  - square-root-decomposition
description:
  Editorial to liscie from PA 2025. 
---

[Problem Link](https://qoj.ac/contest/1948/problem/10252)

# Solution

Consider the 25s and 5GB time and memory limit, a square root algorithm on this problem with O(vsqrt(n)) is acceptable where v is the bound on a array, namely 1e6.

For every single block, consider sorting all of the a values in decreasing order for simplicity of the query operation. Initiation also contains using two pointers to find where each value of d lies in the block, namely the last element of a in the region that is greater than or equal to it. Then maintain a prefix sum based on the sorted a values in each block and reconstruct every time when it is the not whole block processed in both update and query.

### Note

Be careful about MLE and RE for this problem. I used 2*sqrt(n) for MLE reasons.

## Code

```cpp
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
inline void write(int num){
	if(num<0){
		putchar('-');
		num=-num;
	}
	if(num>9)
		write(num/10);
	putchar(num%10+'0');
}
int n,m,z;
int kuaisz;
int kuainum;
int a[2000009];
int b[2000009];
int l[2009];
int r[2009];
int toad[2009];
int bel[1000009];
int id[609][3009];
int bk[2000009];
int v[609][3009];
int pre[609][3009];
int pos[609][1000009];
inline bool cmp(int u,int v){
	return a[u]>a[v];
}
inline void recon(int iden){
	for(int i=1;i<=r[iden]-l[iden]+1;i++)
		pre[iden][i]=pre[iden][i-1]+v[iden][i];
}
inline void upd(int poss,int val){
	for(int i=1;i<bel[poss];i++)
		toad[i]+=val;
	for(int i=l[bel[poss]];i<=poss;i++)
		b[i]+=val;
	for(int i=l[bel[poss]];i<=poss;i++)
		v[bel[poss]][bk[i]]+=val;
	recon(bel[poss]);
}
inline void push(int iden){
	if(!toad[iden])
		return;
	for(int i=l[iden];i<=r[iden];i++)
		b[i]+=toad[iden];
	for(int i=1;i<=r[iden]-l[iden]+1;i++)
		v[iden][i]+=toad[iden];
	recon(iden);
	toad[iden]=0;
}
inline int query(int poss,int val){
	int ans=0;
	for(int i=1;i<bel[poss];i++){
		ans+=pre[i][pos[i][val]];
		ans+=toad[i]*pos[i][val];
	}
//	cout<<pos[1][val]<<endl;
//	cout<<ans<<endl;
	push(bel[poss]);
	for(int i=l[bel[poss]];i<=poss;i++)
		if(a[i]>=val)
			ans+=b[i];
	return ans;
}
signed main(){
	n=read(); m=read(); z=read();
	for(int i=1;i<=n;i++)
		a[i]=read();
	kuaisz=(int)sqrt(n)*2;
	kuainum=(n+kuaisz-1)/kuaisz;
	for(int i=1;i<=kuainum;i++){
		l[i]=(i-1)*kuaisz+1;
		r[i]=min(i*kuaisz,n);
		for(int j=l[i];j<=r[i];j++)
			bel[j]=i;
	}
	for(int i=1;i<=kuainum;i++){
//		cout<<l[i]<<" "<<r[i]<<endl;
		int num=0;
		for(int j=l[i];j<=r[i];j++)
			id[i][++num]=j;
		sort(id[i]+1,id[i]+num+1,cmp);
		for(int j=1;j<=num;j++)
			bk[id[i][j]]=j;
		int cur=0;
		for(int j=(int)1e6;j;j--){
			while(cur<=r[i]-l[i]&&a[id[i][cur+1]]>=j)
				cur++;
			pos[i][j]=cur;
		}
	}
//	for(int i=1;i<=n;i++)
//		cout<<bk[i]<<" ";
//	cout<<endl;
	int q=m+z;
	while(q--){
		int op;
		op=read();
		if(op==1){
			int poss,val;
			poss=read(); val=read();
			upd(poss,val);
		}
		else{
			assert(op==2);
			int poss,val;
			poss=read(); val=read();
			write(query(poss,val));
			putchar('\n');
		}
	}
	return 0;
}
```