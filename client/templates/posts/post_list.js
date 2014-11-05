Template.postsList.helpers({
 hasMorePosts: function(){
 this.posts.rewind();
 return Router.current().postsLimit() == this.posts.count();
 },
 postsWithRank: function(){
   this.posts.rewind();
   return this.posts.map(function(post,index,cursor){
     post._rank = index;
     return post;
   });
 }
});
