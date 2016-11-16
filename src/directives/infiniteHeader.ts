import {Directive, EventEmitter, ElementRef, OnInit, NgZone, Output} from '@angular/core';

import { Content } from 'ionic-angular';

var STATE_ENABLED = 'enabled';
var STATE_DISABLED = 'disabled';
var STATE_LOADING = 'loading';
 
@Directive({
  selector: '[infinite-header]',
})
export class InfiniteHeader implements OnInit{

  private _zone;
  private _elementRef;
  private _content;

  _thrPc: number = 0.15;
  _lastCheck: number;

  state: string;
  _init: boolean;
  ionInfinite: EventEmitter<InfiniteHeader>;

  @Output() scrolledUp: EventEmitter<InfiniteHeader>;

  constructor(content: Content, element: ElementRef, _zone: NgZone ){
    this._elementRef = element.nativeElement;
    this._zone = _zone;
    this._content = content;
    this.scrolledUp = new EventEmitter();
  }

  ngOnInit() {
    this._init = true;
    this._setListeners(this.state !== STATE_DISABLED);
  }

  private _onScroll = function () {

    var _this = this;
    if (this.state === STATE_LOADING || this.state === STATE_DISABLED) {
      return 1;
    }
    var now = Date.now();
    if (this._lastCheck + 100 > now) {
      return 2;
    }
    this._lastCheck = now;
    var d = this._content.getContentDimensions();

    var reloadY = d.contentHeight;
    if (this._thrPc) {
      reloadY = (reloadY * this._thrPc);
    }
    else {
      reloadY = this._thrPx;
    }

    var distanceFromInfinite = (d.scrollTop) - reloadY;

    if (distanceFromInfinite < 0) {
      this._zone.run(function () {
        if (_this.state !== STATE_LOADING && _this.state !== STATE_DISABLED) {
          _this.state = STATE_LOADING;
          if( _this.scrolledUp ){
            _this.scrolledUp.emit(_this);
          }
        }
      });
      return 5;
    }
    return 6;
  };

  private _setListeners = function (shouldListen) {
    var _this = this;
    if (this._init) {
      if (shouldListen) {
        if (!this._scLsn) {
          this._zone.runOutsideAngular(function () {
            _this._scLsn = _this._content.addScrollListener(_this._onScroll.bind(_this));
          });
        }
      }
      else {
        this._scLsn && this._scLsn();
        this._scLsn = null;
      }
    }
  }

  public enable = function (shouldEnable) {
    this.state = (shouldEnable ? STATE_ENABLED : STATE_DISABLED);
    this._setListeners(shouldEnable);
  };

  public complete = function () {
    this.state = STATE_ENABLED;
  };
}