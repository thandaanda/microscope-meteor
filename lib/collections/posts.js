Posts= new Mongo.Collection('posts');


Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({

  postInsert : function(postAttributes){
    check(Meteor.userId(), String);
    check(postAttributes,{
      title: String,
      url: String
    });

    var postWithSameLink = Posts.findOne({url : postAttributes.url});

    if(postWithSameLink){
      return{
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    var user = Meteor.user();
    var post = _.extend(postAttributes,{
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime(),
      flagged: false,
      commentsCount: 0,
      upVoters: [],
      votes: 0
    });

    var postId = Posts.insert(post);

    return {
      _id : postId
    };
  },
  postEdit : function(postProperties){
    check(Meteor.userId() , String );
    check(postProperties, {
      title: String,
      url: String,
      _id: String
    });

    var postWithSameLink = Posts.findOne({url: postProperties.url});

    if(postWithSameLink){
      return{
        postExists: true,
        _id: postProperties._id
      };
    }
    console.log(postProperties);
    Posts.update({_id: postProperties._id},{$set: {url: postProperties.url, title:postProperties.title}},{multi:false});

    return{
      _id: postProperties._id
    };
  },
  upvote: function(postId){
     var user = Meteor.user();

     console.log(user);
     console.log(postId);

     if(!user){
       throw new Meteor.Error(401,"You need to login to upvote");
     }

     var post = Posts.findOne(postId);
      console.log(post);
     if(!post){
       throw new Meteor.Error(422,"Post not found");
     }

     if(_.include(post.upVoters,user._id)){
       throw new Meteor.Error(422,"Already upvoted this post");
     }


     Posts.update({_id: post._id, upVoters: { $ne : user._id}},{
       $addToSet: {upVoters: user._id},
       $inc:{votes: 1}
     });
  }
});
