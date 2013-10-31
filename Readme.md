
# slider

  a simple horizontal slider or range-slider with touch support.

## Installation

  Install with [component(1)](http://component.io):

    $ component install bmcmahen/slider

## Use

```javascript
var Slider = require('slider');
var range = new Slider()
  .numberRange(0, 100)
  .addHandle()
  .addHandle()
  .appendTo(document.body)
  .setValue(20, 50);

// when adding a second handle, the slider assumes that you
// want a range slider.

// listen for when the value of our first handle changes
range.on('val', function(v){
  console.log('ONE', v)
});

// listen for when the value of our second handle changes
range.on('val2', function(v){
  console.log('TWO', v);
});

// refresh the slider when the window resizes
window.onresize = function(){
  range.refresh();
};
```


## License

  MIT
