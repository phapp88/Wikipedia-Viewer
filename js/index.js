// handle search button click - create a search form
function searchButtonClick() {
  var html = '<div class="btn-group">' +
      '<input id="searchInput" type="search" class="form-control">' +
      '<span id="searchClear" class="glyphicon glyphicon-remove-circle"></span>' +
      '</div>';
  $('#search').html(html).hide().fadeIn();
  $('#searchInput').css({
    'font-size': '18px',
    'color': 'white',
    'background-color': 'teal',
    'width': '240px',
    'height': '45px',
    'border-width': '3px',
    'border-color': 'BlueViolet',
    'border-radius': '12px',
    'margin': '10px 0 10px 0'
  });
  $('#searchClear').css({
    'color': 'white',
    'position': 'absolute',
    'right': '9px',
    'top': '0',
    'bottom': '0',
    'height': '18px',
    'margin': 'auto',
    'font-size': '18px',
    'cursor': 'pointer'
  });
    
  // handle clear button
  $('#searchClear').on('click', function() {
    $('.jumbotron').remove();
    $('h1').show();
    $('p').show();
    $('#search').html('<i class="fa fa-search btn" id="icon"></i>').hide().fadeIn();
    $('#icon').on('click', searchButtonClick);
  });
    
  // handle input
  $('input').keypress(function (key) {
    if (key.which == 13) {
      var input = $('#searchInput').val();
      $('h1').hide();
      $('p').hide();
      $('.jumbotron').remove();
      $('#searchInput').css('margin-bottom', '20px');
      $('#searchClear').css('bottom', '10px');
      
      // search for wikipedia page options 
      $.ajax({
        url: '//en.wikipedia.org/w/api.php',
        data: { action: 'query', list: 'search', srsearch: input, format: 'json' },
        dataType: 'jsonp',
        success: function (data) {
          var searchResults = data.query.search;
          for (var i = 0; i < searchResults.length; i++) {
            (function(i) {
              var title = searchResults[i].title;
              
              // get links & snippets for each page from search
              $.getJSON('https://en.wikipedia.org/w/api.php?action=query&titles='+title+' &prop=extracts&exintro=&explaintext=&format=json&callback=?', function(result) {
                var pageResult = result.query.pages;
                var linkId = Object.keys(pageResult)[0];
                var link = 'https://en.wikipedia.org/?curid=' + linkId;
                var intro = pageResult[linkId].extract;
                var endOfSentence = intro.search(/[.!?]\s{1,2}[A-Z0-9]/);
                var snippet = intro.slice(0, endOfSentence + 1);
                if (snippet === '') {
                  snippet = intro;
                }
                  
                // generate html and append to webpage
                var resultHtml = '<a href="' + link +
                  '" target="_blank" class="target">' +
                  '<div class="jumbotron">' +
                  '<h2>' + title + '</h2>' +
                  '<p>' + snippet + '</p>' +
                  '</div></a>';           
                $('#app').append(resultHtml);
                $('.target').mouseup(function() {
                  $(this).blur();
                })
              });
            })(i);
          }        
        }
      });
      return false;
      }
  });
};  

$(document).ready(function() {
  $('#icon').on('click', searchButtonClick);
  
  $('#random').mouseup(function() {
    $(this).blur();
  });
});