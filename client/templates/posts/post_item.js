Template.postItem.helpers({
  ownPost: function(){
    return this.userId === Meteor.userId();
  },
  domain: function(){
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  upVotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upVoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  }
})

Template.postItem.events({
  'click .upvote' : function(e){
    e.preventDefault();
    console.log('_id' + this._id);
    Meteor.call('upvote', this._id);
  }
});
