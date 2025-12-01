---
author: gg_gong
pubDatetime: 2025-11-26
title: Thanksgiving practice
draft: false
tags:
  - SG
  - game theory
  - dp
  - interactive
  - binary-search
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

# Collecting stamps 4 (JOIST Day2)

### Key Observation

There are a total n^2 pairs, for a certain val1,val2 you cannot get val2,val1 only when both val1 are before val2 considering the unidirection of the current starting point. One swap then gives you an additional pair to be able to reach

## Solution

Consider solving this problem in two parts:

In the first part find the current max number of pairs that are able to be collected and convert each starting point as an equation of cost=c+max(0,need-num)*x where cost is final cost and c is the initial cost for the starting point, need is the Kq and num is the initial number of pairs able to be collected by the current starting point. This could easily be done with some math

In the second part, with the n equations, use some method to find the min cost at some Kq. Possibly lichao segtree and CHT will work but didn't implement. What is used in the code is a suffix and a prefix, denoting the minimum for already having the number and doesn't need any swap and minimum using swaps.

Note remember __int128 and 1e20

## Code

```cpp
#include<bits/stdc++.h>
#define int __int128
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
int n,x;
int q;
int a[1000009];
int c[1000009];
int suf[1000009];
int pre[1000009];
int ans[500009];
vector<int> pos[500009];
pair<int,int> cc[1000009];
array<int,2> qq[500009];
inline bool cmp(pair<int,int> u,pair<int,int> v){
	return u.second<v.second;
}
signed main(){
	n=read(); x=read();
	for(int i=1;i<=2*n;i++)
		a[i]=read();
	for(int i=1;i<=2*n;i++)
		c[i]=read();
	for(int i=1;i<=2*n;i++)
		pos[a[i]].push_back(i);
	int cur=n*n+n*(n+1)/2;
	for(int i=1;i<=n;i++)
		cur-=pos[i][0];
	cc[1]=make_pair(c[1],cur);
	for(int i=2;i<=2*n;i++){
		cur+=pos[a[i-1]][0]-pos[a[i-1]][1]+n;
		swap(pos[a[i-1]][0],pos[a[i-1]][1]);
		pos[a[i-1]][1]+=2*n;
		cc[i]=make_pair(c[i],cur);
	}
//	for(int i=1;i<=2*n;i++)
//		cout<<cc[i].first<<" "<<cc[i].second<<endl;
	// lichao??? CHT???
	sort(cc+1,cc+2*n+1,cmp);
	suf[2*n+1]=(int)1e20;
	for(int i=2*n;i;i--)
		suf[i]=min(suf[i+1],cc[i].first);
	pre[0]=(int)1e20;
	cc[0]=make_pair((int)1e20,0);
	for(int i=1;i<=2*n;i++)
		pre[i]=min(cc[i].first,pre[i-1]+x*(cc[i].second-cc[i-1].second));
	q=read();
	for(int i=1;i<=q;i++){
		qq[i][0]=read();
		qq[i][1]=i;
	}
	sort(qq+1,qq+q+1);
	cur=0;
	for(int i=1;i<=q;i++){
		int l=1,r=2*n+1;
		int anss=2*n+1;
		while(l<=r){
			int mid=(l+r)>>1;
			if(cc[mid].second>=qq[i][0]){
				r=mid-1;
				anss=mid;
			}
			else
				l=mid+1;
		}
		ans[qq[i][1]]=suf[anss];
//		cout<<ans[qq[i][1]]<<endl;
		l=0,r=2*n;
		anss=0;
		while(l<=r){
			int mid=(l+r)>>1;
			if(cc[mid].second<=qq[i][0]){
				l=mid+1;
				anss=mid;
			}
			else
				r=mid-1;
		}
		ans[qq[i][1]]=min(ans[qq[i][1]],pre[anss]+x*(qq[i][0]-cc[anss].second));
	}
	for(int i=1;i<=q;i++,putchar('\n'))
		write(ans[i]);
	return 0;
}
```

# Space Thief 2 (JOIST Day2)

### Inspiration + Solution

For a flower graph, after splitting the nodes into the two sets of roughly equal size, one set connect to the 0 node and one set gets from the zero node, we can figure out a possible way of making direction to guarantee s can reach t.

## Solution

Consider each level of the centroid decomposition and split the subtrees into 2 roughly equal size sets. For each set either link it to the parent or the child direction and this guarantees that we are able to find a possible directing to connects s and t in O(logn) number of queries. What the edges give is a constraint for the topo order and we can use it the build a topo graph. Note that reversing to parent and to child relation have result in a reversed topo order.

With the current directions and topo order, notice that s must be in front of t and thus we can do two binary search on the position of where s and t are in the topo order by reversing the edges containing the earlier and later nodes in the topo order.

The total number of queries is around O(3logn).

## Code

Terrible Code

```cpp
#include<bits/stdc++.h>
#include "thief.h"
//#define int long long
using namespace std;
typedef long long ll;
typedef unsigned long long ull;
typedef long double ld;
//int query(vector<int>);
//void answer(int,int);
int n,m;
int cent=-1;
int curdep;
int curnum;
int im;
int mxdep;
int sz[30009];
int mx[30009];
int id[30009];
int in[49][30009];
bool ok[30009];
vector<int> recu,recv;
vector<int> vec;
vector<int> reach[30009];
vector<int> reachh[49][30009];
inline void dfs(int u,int fa,bool edit=1){
	sz[u]=1; mx[u]=1;
	for(int v:reach[u]){
		if(ok[v]||v==fa)
			continue;
		dfs(v,u);
		sz[u]+=sz[v];
		mx[u]=max(mx[u],sz[v]);
	}
	mx[u]=max(mx[u],curnum-sz[u]);
	if((!~cent||mx[u]<mx[cent])&&edit)
		cent=u;
}
int fa[30009];
inline int find_dsu(int u){
	return u==fa[u]?u:fa[u]=find_dsu(fa[u]);
}
inline void merge_dsu(int u,int v){
	u=find_dsu(u); v=find_dsu(v);
//	if(u==v){
//		cout<<"WTF";
//		return;
//	}
	fa[u]=v;
}
inline void tochild(int u,int fa){
	reachh[curdep][id[fa]].push_back(id[u]);
	in[curdep][id[u]]++;
	for(int v:reach[u]){
		if(ok[v]||v==fa)
			continue;
		tochild(v,u);
	}
}
inline void toparent(int u,int fa){
	reachh[curdep][id[u]].push_back(id[fa]);
	in[curdep][id[fa]]++;
	for(int v:reach[u]){
		if(ok[v]||v==fa)
			continue;
		toparent(v,u);
	}
}
inline void cent_decomp(int u){
//	cout<<curdep<<":"<<endl;
	dfs(u,-1,0);
	curnum=sz[u];
//	cout<<curnum<<endl;
	mxdep=max(curdep,mxdep);
	cent=-1;
	dfs(u,-1);
	u=cent;
//	cout<<"check cent:"<<u<<endl;
	ok[u]=1;
	dfs(u,-1,0);
	priority_queue<pair<int,int>,vector<pair<int,int> >,greater<pair<int,int> > > pq;
	int rec=-1;
	for(int v:reach[u]){
		if(ok[v])
			continue;
		pq.push(make_pair(sz[v],v));
		fa[v]=v;
		rec=v;
	}
	if(!pq.size())
		return;
	if(pq.size()==1){
		reachh[curdep][id[u]].push_back(id[rec]);
		in[curdep][rec]++;
		return;
	}
	while(pq.size()!=2){
		pair<int,int> p=pq.top();
		pq.pop();
		pair<int,int> pp=pq.top();
		pq.pop();
		merge_dsu(p.second,pp.second);
		pq.push(make_pair(p.first+pp.first,pp.second));
	}
	int rt1=pq.top().second;
	pq.pop();
	int rt2=pq.top().second;
	id[++im]=id[u];
	id[++im]=id[u];
	for(int v:reach[u]){
		if(ok[v])
			continue;
		if(find_dsu(v)==rt1){
//			cout<<"tp1:"<<v<<endl;
			reachh[curdep][id[u]].push_back(id[v]);
			in[curdep][id[v]]++;
			tochild(v,u);
			reach[im-1].push_back(v);
			reach[v].push_back(im-1);
		}
		else{
//			cout<<"tp2:"<<v<<endl;
			assert(find_dsu(v)==rt2);
			reachh[curdep][id[v]].push_back(id[u]);
			in[curdep][id[u]]++;
			toparent(v,u);
			reach[im].push_back(v);
			reach[v].push_back(im);
		}
	}
//	cout<<endl;
	curdep++;
	cent_decomp(rt1);
	cent_decomp(rt2);
	curdep--;
}
int pos[30009];
inline void topo(int lvl){
	queue<int> q;
	for(int i=0;i<n;i++)
		if(!in[lvl][i])
			q.push(i);
	int timer=0;
	while(!q.empty()){
		int u=q.front();
		q.pop();
		pos[u]=++timer;
		for(int v:reachh[lvl][u]){
			in[lvl][v]--;
			if(!in[lvl][v])
				q.push(v);
		}
	}
//	cout<<timer<<endl;
}
inline bool check(){
	vector<int> qq;
	for(int i=0;i<m;i++)
		qq.push_back((bool)(pos[recu[i]]>pos[recv[i]]));
	return query(qq);
}
inline bool OK(int u){
	vector<int> qq;
	for(int i=0;i<m;i++)
		qq.push_back(((bool)(pos[recu[i]]>pos[recv[i]]))^((bool)((pos[recu[i]]<=u)|(pos[recv[i]]<=u))));
	return query(qq);
}
inline bool OK2(int u){ // deactivate all topo order >= u-> find end's order
	vector<int> qq;
	for(int i=0;i<m;i++)
		qq.push_back(((bool)(pos[recu[i]]>pos[recv[i]]))^((bool)((pos[recu[i]]>=u)|(pos[recv[i]]>=u))));
	return query(qq);
}
inline void found_valid(){
//	cout<<"check order:";
//	for(int i=0;i<n;i++)
//		cout<<pos[i]<<" ";
//	cout<<endl;
	int l=1,r=n;
	int ans;
	while(l<=r){
		int mid=(l+r)>>1;
		if(!OK(mid)){
			ans=mid;
			r=mid-1;
		}
		else
			l=mid+1;
	}
	l=1; r=n;
	int anss;
	while(l<=r){
		int mid=(l+r)>>1;
		if(!OK2(mid)){
			anss=mid;
			l=mid+1;
		}
		else
			r=mid-1;
	}
//	cout<<ans<<" "<<anss<<endl;
	bool ok=1,ok2=1;
	for(int i=0;i<n;i++){
		if(pos[i]==ans&&ok){
			ans=i;
			ok=0;
		}
		if(pos[i]==anss&&ok2){
			anss=i;
			ok2=0;
		}
	}
	answer(ans,anss);
	exit(0);
}
inline int find_len(int l,int r){
	return r-l+1;
}
bool okk[20009];
vector<int> tmp[20009];
inline void tree(int u,int fa){
	okk[u]=1;
	for(int v:reach[u]){
		if(okk[v])
			continue;
		tmp[u].push_back(v);
		tmp[v].push_back(u);
		tree(v,u);
	}
}
void solve(int N,int M,vector<int> U,vector<int> V){
	n=N; m=M;
	recu=U; recv=V;
	im=n-1;
	for(int i=0;i<m;i++){
		reach[recu[i]].push_back(recv[i]);
		reach[recv[i]].push_back(recu[i]);
	}
	tree(0,-1);
	for(int i=0;i<n;i++)
		reach[i]=tmp[i];
	iota(id,id+n,0);
	curdep=0;
	cent_decomp(0);
	for(int i=0;i<=mxdep;i++){
//		for(int j=0;j<n;j++){
//			cout<<j<<":";
//			for(int v:reachh[i][j])
//				cout<<v<<" ";
//			cout<<endl;
//		}
		topo(i);
		if(check())
			found_valid();
		for(int j=0;j<n;j++)
			pos[j]=find_len(pos[j],n);
		if(check())
			found_valid();
	}
}
//inline int read(){
//	int num=0,sign=1;
//	char ch=getchar();
//	while(ch<'0'||ch>'9'){
//		if(ch=='-')
//			sign=-sign;
//		ch=getchar();
//	}
//	while(ch>='0'&&ch<='9'){
//		num=num*10+(int)ch-48;
//		ch=getchar();
//	}
//	return num*sign;
//}
//inline void write(int num){
//	if(num<0){
//		putchar('-');
//		num=-num;
//	}
//	if(num>9)
//		write(num/10);
//	putchar(num%10+'0');
//}
//int query(vector<int> vec){
//	cout<<"ask:";
//	for(int val:vec)
//		cout<<val<<" ";
//	cout<<endl;
//	int tmp;
//	tmp=read();
//	return tmp;
//}
//void answer(int u,int v){
//	cout<<"answer:"<<u<<" "<<v<<endl;
//}
//int main(){
//	solve(5,4,{0,0,1,1},{1,3,2,4});
//}
```