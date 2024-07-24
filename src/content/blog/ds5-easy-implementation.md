---
author: gg_gong
pubDatetime: 2024-07-24
title: ds5-easy-implementation
draft: false
tags:
  - data-structure
  - link-cut-tree
description:
  Implementation to ds5easy
---

trivial template problem

Here is the implementation:

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
int n,m,rec;
int stk[100009];
struct linkcuttree{
	int son[2];
	int fa;
	int mn,mx;
	int sz,val,sum;
	int tg,tg2,tg3;
	bool rec;
}tr[100009];
inline bool isleftson_lct(int u){
	return u==tr[tr[u].fa].son[0];
}
inline bool isroot_lct(int u){
	return u!=tr[tr[u].fa].son[0]&&u!=tr[tr[u].fa].son[1];
}
inline void pushup_lct(int u){
	tr[u].mx=tr[u].val; tr[u].mn=tr[u].val;
	tr[u].sum=tr[tr[u].son[0]].sum+tr[tr[u].son[1]].sum+tr[u].val;
	tr[u].sz=tr[tr[u].son[0]].sz+tr[tr[u].son[1]].sz+1;
	if(tr[u].son[0]){
		tr[u].mx=max(tr[u].mx,tr[tr[u].son[0]].mx);
		tr[u].mn=min(tr[u].mn,tr[tr[u].son[0]].mn);
	}
	if(tr[u].son[1]){
		tr[u].mx=max(tr[u].mx,tr[tr[u].son[1]].mx);
		tr[u].mn=min(tr[u].mn,tr[tr[u].son[1]].mn);
	}
}
inline void pushdown_lct(int u){
	if(tr[u].tg){
		tr[tr[u].son[0]].tg^=1;
		tr[tr[u].son[1]].tg^=1;
		swap(tr[u].son[0],tr[u].son[1]);
		tr[u].tg=0;
	}
	if(tr[u].rec){
		tr[tr[u].son[0]].mx=tr[u].tg2;
		tr[tr[u].son[0]].mn=tr[u].tg2;
		tr[tr[u].son[1]].mx=tr[u].tg2;
		tr[tr[u].son[1]].mn=tr[u].tg2;
		tr[tr[u].son[0]].sum=tr[tr[u].son[0]].sz*tr[u].tg2;
		tr[tr[u].son[1]].sum=tr[tr[u].son[1]].sz*tr[u].tg2;
		tr[tr[u].son[0]].tg3=0;
		tr[tr[u].son[1]].tg3=0;
		tr[tr[u].son[0]].val=tr[u].tg2;
		tr[tr[u].son[1]].val=tr[u].tg2;
		tr[tr[u].son[0]].rec=1;
		tr[tr[u].son[1]].rec=1;
		tr[tr[u].son[0]].tg2=tr[u].tg2;
		tr[tr[u].son[1]].tg2=tr[u].tg2;
		tr[u].rec=0;
	}
	if(tr[u].tg3){
		tr[tr[u].son[0]].mx+=tr[u].tg3;
		tr[tr[u].son[0]].mn+=tr[u].tg3;
		tr[tr[u].son[1]].mx+=tr[u].tg3;
		tr[tr[u].son[1]].mn+=tr[u].tg3;
		tr[tr[u].son[0]].sum+=tr[tr[u].son[0]].sz*tr[u].tg3;
		tr[tr[u].son[1]].sum+=tr[tr[u].son[1]].sz*tr[u].tg3;
		tr[tr[u].son[0]].val+=tr[u].tg3;
		tr[tr[u].son[1]].val+=tr[u].tg3;
		tr[tr[u].son[0]].tg3+=tr[u].tg3;
		tr[tr[u].son[1]].tg3+=tr[u].tg3;
		tr[u].tg3=0;
	}
}
inline void rotate_lct(int u){
	int father=tr[u].fa,grandfather=tr[tr[u].fa].fa;
	bool rec1=!isleftson_lct(u),rec2=!isleftson_lct(father);
	tr[u].fa=grandfather;
	if(!isroot_lct(father))
		tr[grandfather].son[rec2]=u;
	tr[father].son[rec1]=tr[u].son[rec1^1];
	tr[tr[u].son[rec1^1]].fa=father;
	tr[u].son[rec1^1]=father;
	tr[father].fa=u; 
	pushup_lct(father); pushup_lct(u);
}
inline void splay_lct(int u){
	int tp=0,cur=u;
	stk[++tp]=cur;
	while(!isroot_lct(cur)){
		cur=tr[cur].fa;
		stk[++tp]=cur;
	}
	while(tp)
		pushdown_lct(stk[tp--]);
	while(!isroot_lct(u)){
		int father=tr[u].fa,grandfather=tr[tr[u].fa].fa;
		bool rec1=isleftson_lct(u),rec2=isleftson_lct(father);
		if(!isroot_lct(father)){
			if(rec1==rec2)
				rotate_lct(father);
			else	
				rotate_lct(u);
		}
		rotate_lct(u);
	}
	pushup_lct(u);
}
inline void access_lct(int u){
	int rec=0;
	while(u){
		splay_lct(u);
		tr[u].son[1]=rec;
		pushup_lct(u);
		rec=u;
		u=tr[u].fa;
	}
}
inline int access2_lct(int u){
	int rec=0;
	while(u){
		splay_lct(u);
		tr[u].son[1]=rec;
		pushup_lct(u);
		rec=u;
		u=tr[u].fa;
	}
	return rec;
}
inline void makeroot_lct(int u){
	access_lct(u);
	splay_lct(u);
	tr[u].tg^=1;
	pushdown_lct(u);
}
inline int findroot_lct(int u){
	access_lct(u); splay_lct(u); pushdown_lct(u);
	while(tr[u].son[0]){
		u=tr[u].son[0];
		pushdown_lct(u);
	}
	return u;
}
inline bool diffpart_lct(int u,int v){
	makeroot_lct(u);
	if(findroot_lct(v)==u)
		return 0;
	return 1;
}
inline void split_lct(int u,int v){
	makeroot_lct(u);
	access_lct(v);
	splay_lct(v);
}
inline void addedge_lct(int u,int v){
	makeroot_lct(u);
	if(findroot_lct(v)!=u)
		tr[u].fa=v;	
}
inline void cut_lct(int u){
	access_lct(u);
	splay_lct(u);
	tr[tr[u].son[0]].fa=0;
	tr[u].son[0]=0;
	pushup_lct(u);
}
inline int finddep_lct(int u){
	access_lct(u);
	splay_lct(u);
	return tr[u].sz;
}
inline int findlca_lct(int u,int v){
	if(u==v)
		return u;
	if(finddep_lct(u)>finddep_lct(v))
		swap(u,v);
	access2_lct(v);
	return access2_lct(u);
}
signed main(){
	n=read(); m=read();
	for(int i=1;i<=n;i++)
		tr[i].val=read();
	for(int i=1;i<n;i++){
		int u,v;
		u=read(); v=read();
		addedge_lct(u,v);
	}
	rec=read();
	makeroot_lct(rec);
	while(m--){
		int op;
		op=read();
		if(op==0)
			rec=read();
		else if(op==1){
			int u,v,w;
			u=read(); v=read(); w=read();
			split_lct(u,v);
			tr[v].mn=w; tr[v].mx=w;
			tr[v].sum=tr[v].sz*w; tr[v].val=w;
			tr[v].tg2=w; tr[v].rec=1;
		}
		else if(op==2){
			int u,v,w;
			u=read(); v=read(); w=read();
			split_lct(u,v);
			tr[v].mn+=w; tr[v].mx+=w;
			tr[v].sum+=tr[v].sz*w; tr[v].val+=w;
			tr[v].tg3+=w;
		}
		else if(op==3){
			int u,v;
			u=read(); v=read();
			split_lct(u,v);
			printf("%lld\n",tr[v].mn);
		}
		else if(op==4){
			int u,v;
			u=read(); v=read();
			split_lct(u,v);
			printf("%lld\n",tr[v].mx);
		}
		else if(op==5){
			int u,v;
			u=read(); v=read();
			split_lct(u,v);
			printf("%lld\n",tr[v].sum);
		}
		else if(op==6){
			int u,v;
			u=read(); v=read();
			makeroot_lct(rec);
			if(findlca_lct(u,v)==u)
				continue;
			cut_lct(u);
			addedge_lct(u,v);
		}
		else{
			int u,v;
			u=read(); v=read();
			makeroot_lct(rec);
			int lca=findlca_lct(u,v);
			printf("%lld\n",lca);
		}
	}
	return 0;
}
```