---
author: gg_gong
pubDatetime: 2026-05-31
title: Scallion pancake party editorial
draft: false
tags:
  - Ad-hoc
description:
  Editorial to scallion pancake party from APIO 2026. 
---

[Problem Link](https://qoj.ac/contest/3763/problem/17645)

# Solution

Here's a preliminary solution which won't work just yet but has a close idea to the optimal solution:

1. For the first number that appears the maximum amount of time in a prefix and it has all of the k pieces left in the cake, eat it all.

2. For that many occurences in any prefix for any type of cake, eat it all.

3. To recover the sequence p, simply find the cakes of a certain number of appeareances that haven't been eaten.

Why is this approach wrong, well most obviously what if the first number found of a certain number of appeareances is the id of the cake that you can't eat.

In order to solve this problem, we will introduce a strategy of regretting. Specifically, you mark all of the later number of occurences and since the later people will see that the later types of cakes that the (room id+1) occurence has been marked later, they will have to increase their supposed room id by 1.

The problem that this new strategy creates is how to decode using the number of pieces left of the cakes. Well there are two cases that you will need to consider, for a certain number of occurence: only one type of cake will have all k pieces left uneaten/ all types of cakes will be empty. For each, respectively, simply p is the only type of that has left or first type of cake that appeared such number of times.

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
int n,k,id,idd;
void init(int N,int K,int p,int r){
	n=N; k=K;
	id=p; idd=-1;
}
int cur;
int cnt[39];
int strategy(int b,int f,int s){
	cnt[f]++;
	if(cnt[f]>cur){
		cur=cnt[f];
		if(s==k&&(idd==-1))
			idd=cnt[f];
	}
	if(s<k&&idd==cnt[f])
		idd++;
	if(idd==cnt[f]&&f!=id)
		return k;
	return 0;
}
bool ok[39];
vector<int> guess(int nn,int kk,vector<int> f,vector<int> s){
	vector<int> ans;
	for(int i=0;i<nn-1;i++){
		int curans=-1;
		for(int j=0;j<=nn;j++)
			cnt[j]=0;
		for(int j=0;j<f.size();j++){
            if(ok[f[j]])
                continue;
			cnt[f[j]]++;
			if(cnt[f[j]]==i+1&&(curans==-1))
				curans=f[j];
			if(cnt[f[j]]==i+1&&s[j])
				curans=f[j];
		}
		ans.push_back(curans);
        ok[curans]=1;
	}
	for(int i=0;i<nn;i++)
		if(!ok[i])
			ans.push_back(i);
	assert(ans.size()==nn);
	return ans;
}
```