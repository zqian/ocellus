'use strict';
/* global $, _ */

var vote = function(e) {
    var $thisTarget = $(e.target);
    if ($thisTarget.hasClass("glyphicon")) {
        $thisTarget = $thisTarget.parent('button');
    }
    var $thisTargetContainer = $thisTarget.closest('.voteControls');

    var voteVal = $thisTarget.attr('data_vote');
    var voteValInt = parseInt(voteVal);

    var id = $thisTarget.attr('data_id');
    var data = { 'message': id, 'vote': voteVal };
    $.post("/api/votes/", data, function(result) {
        var currVoteNum = parseInt($thisTargetContainer.find('.voteNum').text());
        $thisTargetContainer.find('.voteNum').text(currVoteNum + voteValInt);
    }).fail(function() {
        // do some failure things
    }).always(function(){
        $thisTargetContainer.find('.btn-group').fadeOut('slow');
    });
};

var leafletize = function(data){
  var leafletList = [];
  _.each(data.data, function(event){
    leafletList.push({
      lat: event.latitude,
      lng: event.longitude,
      category: event.category || 'cat1',
      message:event.messageText,
      layer: 'bofs',
      icon: resolveIcon( 'cat1' ),
      endTime: event.endTime,
      startTime: event.startTime,
      hashTag: event.hashtag,
      votes: event.votes,
      owner: event.owner
    });
});
    return leafletList;
};


var resolveCategory = function ( category ) {
  if ( category ) {
    return '<strong>' + category + '</strong>';
  } else {
    return '';
  }
};

var resolveIcon = function ( category ) {
  return ( {
    'cat1': {
      type: 'awesomeMarker',
      icon: 'cutlery',
      markerColor: 'green'
    },
    'cat2': {
      type: 'awesomeMarker',
      icon: 'heart',
      markerColor: 'red'
    },
    'cat3': {
      type: 'awesomeMarker',
      icon: 'music',
      markerColor: 'orange'
    }
  }[ String( category ).toLowerCase() ] || {
    type: 'awesomeMarker',
    icon: 'record',
    markerColor: 'blue'
  } );
};

var validate = function(data) {
  var validationFailures = [];
  _.each(data, function(value, key, list){
    if(value ===undefined || value==='Invalid date') {
      validationFailures.push(key);
    }
  });
  if (validationFailures.length){
    return validationFailures;
  } else {
    return false;
  }
};



var popupLink = document.createElement('a');
popupLink.setAttribute('data-toggle','modal');
popupLink.setAttribute('data-target','#bofModal');
popupLink.setAttribute('href','');
popupLink.setAttribute('data-target', '#bofModal');
var linktext = document.createTextNode('Add an event here?');
popupLink.appendChild(linktext);
