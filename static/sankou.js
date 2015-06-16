// forked from naga3's "クッキーに保存できる付箋" http://jsdo.it/naga3/iEvs
$(function() {
  $('#new').click(function() {
    make();
    save();
  });

var getCornerPositions = function(left, top, width, height){
    var obj = [];
    obj.push({left: left, top: top}); //左上
    obj.push({left: left + width, top: top}); //右上
    obj.push({left: left, top: top + height}); //左下
    obj.push({left: left + width, top: top + height}); //右下
    return obj;
};


  function make() {
    var sticky = $('<div class="sticky">Drag & Double Click! </div>');
    sticky.appendTo('body')
      .draggable()
      .dblclick(function() {
        $(this).html('<textarea>' + $(this).html() + '</textarea>')
          .children()
          .focus()
          .blur(function() {
            $(this).parent().html($(this).val());
            save();
          });
      }).mousedown(function() {
        $('.sticky').removeClass('selected');
        $(this).addClass('selected');
      });
    return sticky;
  }
  function save() {
    var items = [];
    $('.sticky').each(function() {
      items.push({
        css: {
          left: $(this).css('left'),
          top: $(this).css('top'),
          backgroundColor: $(this).css('background-color')
        },
        html: $(this).html()
      });
    });
    localStorage.sticky = JSON.stringify(items);
  }

  function load() {
    if (!localStorage.sticky) return;
    var items = JSON.parse(localStorage.sticky);
    $.each(items, function(i, item) {
      make().css(item.css).html(item.html);
    });
  }
  load();
  
});
