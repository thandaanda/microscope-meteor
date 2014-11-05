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

Template.postItem.rendered = function(){
  var instance =this;
  var rank = instance._rank;
  var $this = $(this.firstNode);
  var postHeight = 80;
  var newPosition = rank * postHeight;
  if (typeof(instance.currentPosition) !== 'undefined') {
    var previousPosition = instance.currentPosition;
    var delta = previousPosition - newPosition;
    $this.css("top", delta + "px");
  }
  // let it draw in the old position, then..
  Meteor.defer(function() {
    instance.currentPosition = newPosition;
    // bring element back to its new original position
    $this.css("top", "0px");
  });

};

Template.postItem.events({
  'click .upvote' : function(e){
    e.preventDefault();
    console.log('_id' + this._id);
    Meteor.call('upvote', this._id);
  }
});
