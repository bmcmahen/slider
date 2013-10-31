var draggable = require('draggable');
var linearConversion = require('linear-conversion');
var events = require('events');
var Emitter = require('emitter');
var translate = require('translate');
var domify = require('domify');

function Slider(){
  if (!(this instanceof Slider)) return new Slider();
  this.el = domify(require('./template'));

  this.handles = [];
  this.handleEvents = [];

  // defaults
  this.v1 = 0;
  this.v2 = 10;
  this.p1 = 0;
  this.p2 = 10;
  this.min = 0;
  this.max = 10;
  this.isRange = false;
};

module.exports = Slider;
Emitter(Slider.prototype);

Slider.prototype.bind = function(){
  this.handleEvents = events(this.draggable, this);
  this.handleEvents.bind('drag');
  // TODO: 
  // this.clickEvents = events(this.el, this);
  // this.clickEvents.bind('click', 'onsliderclick');
};

Slider.prototype.addHandle = function(){

  // create our handle element
  var el = document.createElement('div');
  el.className = 'ui-slider-handle';
  this.el.appendChild(el);

  // make it draggable
  var drag = draggable(el)
    .disableYAxis()
    .containment(this.el)
    .build();

  this.handles.push(drag);
  var len = this.handles.length;

  // bind our event handlers
  var handleEvents = events(drag, this);
  handleEvents.bind('drag', 'ondrag', len);
  handleEvents.bind('start', 'ondragstart', len);
  this.handleEvents.push(handleEvents);

  // if we have more than one handle, assume we are working
  // with a range slider
  if (len > 1) {
    this.isRange = true;
    var rangeEl = this.rangeEl = document.createElement('div');
    rangeEl.className = 'range-element';
    this.el.appendChild(rangeEl);
  }
  return this;
}

// TODO:
// Slider.prototype.onsliderclick = function(e){
//   console.log('on slider click');
// }

/**
 * ondragstart event handler.
 * If we are working with a range, we need to ensure
 * that our two handles don't crossover eachother.
 * @param  {Number} i index of the handle
 */

Slider.prototype.ondragstart = function(i){
  if (!this.isRange) return;
  if (i === 1) this.handles[0].maxLeft(this.handles[1].ox);
  else this.handles[1].minLeft(this.handles[0].ox + this.handles[1].el.clientWidth);
};

Slider.prototype.ondrag = function(x, y, i){
  if (i === 1){
    this.v1 = this.scale(x);
    this.p1 = x;
    this.emit('val', this.v1);
  } else {
    this.v2 = this.scale(x);
    this.p2 = x;
    this.emit('v2', this.v2);
  }
  if (this.isRange) this.updateRange();
};

Slider.prototype.updateRange = function(){
  this.rangeEl.style.width = this.p2 - this.p1;
  translate(this.rangeEl, this.p1, 0);
  return this;
};

Slider.prototype.numberRange = function(min, max){
  this.min = min;
  this.max = max;
  return this;
};

Slider.prototype.setValue = function(v, v2){
  this.v1 = v;
  this.p1 = this.reverse(v);
  this.handles[0].moveTo(this.p1, 0);
  if (v2 && this.handles[1]){
    this.v2 = v2;
    this.p2 = this.reverse(v2);
    this.handles[1].moveTo(this.p2, 0);
  }
  if (this.isRange) this.updateRange();
  return this;
};

Slider.prototype.createScale = function(){
  var len = this.el.clientWidth - (this.handles[0].el.clientWidth || 0);
  this.scale = linearConversion([0, len], [this.min, this.max]);
  this.reverse = linearConversion([this.min, this.max], [0, len]);
  return this;
};

Slider.prototype.appendTo = function(el){
  el.appendChild(this.el);
  this.refresh();
  return this;
};

Slider.prototype.refresh = function(){
  this.createScale();
  this.setValue(this.v1, this.v2);
  if (this.isRange) this.updateRange();
  return this;
};