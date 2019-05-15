var exports = window;
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var POSITION;
    (function (POSITION) {
        POSITION[POSITION["LEFT_TOP"] = 0] = "LEFT_TOP";
        POSITION[POSITION["LEFT_CENTER"] = 1] = "LEFT_CENTER";
        POSITION[POSITION["LEFT_BOTTOM"] = 2] = "LEFT_BOTTOM";
        POSITION[POSITION["TOP_CENTER"] = 3] = "TOP_CENTER";
        POSITION[POSITION["CENTER"] = 4] = "CENTER";
        POSITION[POSITION["BOTTOM_CENTER"] = 5] = "BOTTOM_CENTER";
        POSITION[POSITION["RIGHT_TOP"] = 6] = "RIGHT_TOP";
        POSITION[POSITION["RIGHT_CENTER"] = 7] = "RIGHT_CENTER";
        POSITION[POSITION["RIGHT_BOTTOM"] = 8] = "RIGHT_BOTTOM";
    })(POSITION = exports.POSITION || (exports.POSITION = {}));
    var EDGE;
    (function (EDGE) {
        EDGE[EDGE["START"] = 1] = "START";
        EDGE[EDGE["MIDDLE"] = 0] = "MIDDLE";
        EDGE[EDGE["END"] = 2] = "END";
    })(EDGE = exports.EDGE || (exports.EDGE = {}));
    var FillMode;
    (function (FillMode) {
        // 几何拉伸
        FillMode[FillMode["STRETCH"] = 4096] = "STRETCH";
        // 居中
        FillMode[FillMode["CENTER"] = 8192] = "CENTER";
        // 不变形拉伸(留黑边)
        FillMode[FillMode["ASPECTSTRETCH"] = 12288] = "ASPECTSTRETCH";
        // 不变形填充(无黑边，有裁剪)
        FillMode[FillMode["ASPECTFILL"] = 16384] = "ASPECTFILL";
        // 不变形近似拉伸(无黑边使用阈值拉伸)
        FillMode[FillMode["NEARESTSTRETCH"] = 20480] = "NEARESTSTRETCH";
        // 置于区域中
        FillMode[FillMode["MAPIN"] = 24576] = "MAPIN";
        // 附加参数
        FillMode[FillMode["NOBORDER"] = 1] = "NOBORDER";
        FillMode[FillMode["MAXIMUM"] = 2] = "MAXIMUM";
        FillMode[FillMode["NEAREST"] = 4] = "NEAREST";
        FillMode[FillMode["MASK_MAJOR"] = 61440] = "MASK_MAJOR";
    })(FillMode = exports.FillMode || (exports.FillMode = {}));
    var Mask = /** @class */ (function () {
        function Mask() {
        }
        Mask.isset = function (mask, value) {
            return (value & mask) == mask;
        };
        Mask.unset = function (mask, value) {
            if (this.isset(mask, value))
                return (value & (~mask));
            return value;
        };
        Mask.set = function (mask, value) {
            if (this.isset(mask, value))
                return value;
            return (value | mask);
        };
        return Mask;
    }());
    exports.Mask = Mask;
    var ArrayT = /** @class */ (function () {
        function ArrayT() {
        }
        /** 清空数组，并挨个回调 */
        ArrayT.Clear = function (arr, cb, ctx) {
            if (cb)
                arr.forEach(cb, ctx);
            arr.length = 0;
        };
        return ArrayT;
    }());
    function Integral(v) {
        return (v + 0.5) >> 0;
    }
    exports.Integral = Integral;
    /** 点 */
    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Point.prototype.reset = function (x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
            return this;
        };
        Point.prototype.clone = function () {
            var r = new Point();
            r.x = this.x;
            r.y = this.y;
            return r;
        };
        Point.prototype.copy = function (r) {
            this.x = r.x;
            this.y = r.y;
            return this;
        };
        Point.prototype.addPoint = function (r) {
            this.x += r.x;
            this.y += r.y;
            return this;
        };
        Point.prototype.subPoint = function (r) {
            this.x -= r.x;
            this.y -= r.y;
            return this;
        };
        Point.prototype.add = function (x, y) {
            if (x)
                this.x += x;
            if (y)
                this.y += y;
            return this;
        };
        Point.prototype.multiPoint = function (r) {
            this.x *= r.x;
            this.y *= r.y;
            return this;
        };
        Point.prototype.scale = function (v, vy) {
            if (vy == null)
                vy = v;
            this.x *= v;
            this.y *= vy;
            return this;
        };
        Point.prototype.isEqual = function (r) {
            return this.x == r.x &&
                this.y == r.y;
        };
        Point.prototype.invert = function () {
            var t = this.x;
            this.x = this.y;
            this.y = t;
            return this;
        };
        Point.prototype.toString = function () {
            return this.x + ',' + this.y;
        };
        Point.prototype.fromString = function (s) {
            if (s == null) {
                this.x = this.y = 0;
                return;
            }
            var c = s.split(',');
            this.x = parseFloat(c[0]);
            this.y = parseFloat(c[1]);
        };
        Point.AnchorCC = new Point(0.5, 0.5);
        Point.AnchorLT = new Point(0, 0);
        Point.AnchorLC = new Point(0, 0.5);
        Point.AnchorLB = new Point(0, 1);
        Point.AnchorTC = new Point(0.5, 0);
        Point.AnchorBC = new Point(0.5, 1);
        Point.AnchorRT = new Point(1, 0);
        Point.AnchorRC = new Point(1, 0.5);
        Point.AnchorRB = new Point(1, 1);
        Point.Zero = new Point();
        return Point;
    }());
    exports.Point = Point;
    var Size = /** @class */ (function (_super) {
        __extends(Size, _super);
        function Size(w, h) {
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            return _super.call(this, w, h) || this;
        }
        Object.defineProperty(Size.prototype, "width", {
            get: function () {
                return this.x;
            },
            set: function (w) {
                this.x = w;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Size.prototype, "height", {
            get: function () {
                return this.y;
            },
            set: function (h) {
                this.y = h;
            },
            enumerable: true,
            configurable: true
        });
        Size.prototype.toRect = function () {
            return new Rect(0, 0, this.width, this.height);
        };
        Size.prototype.addSize = function (r) {
            this.x += r.x;
            this.y += r.y;
            return this;
        };
        Size.Zero = new Size();
        return Size;
    }(Point));
    exports.Size = Size;
    /** 多边形 */
    var Polygon = /** @class */ (function () {
        function Polygon() {
            this._pts = new Array();
        }
        Polygon.prototype.add = function (pt) {
            this._pts.push(pt);
            return this;
        };
        Polygon.prototype.clear = function () {
            this._pts.length = 0;
            return this;
        };
        Object.defineProperty(Polygon.prototype, "length", {
            get: function () {
                return this._pts.length;
            },
            enumerable: true,
            configurable: true
        });
        return Polygon;
    }());
    exports.Polygon = Polygon;
    /** 边距 */
    var EdgeInsets = /** @class */ (function () {
        function EdgeInsets(t, b, l, r) {
            if (t === void 0) { t = 0; }
            if (b === void 0) { b = 0; }
            if (l === void 0) { l = 0; }
            if (r === void 0) { r = 0; }
            this.top = t;
            this.bottom = b;
            this.left = l;
            this.right = r;
        }
        EdgeInsets.All = function (v) {
            return new EdgeInsets(v, v, v, v);
        };
        EdgeInsets.prototype.add = function (t, b, l, r) {
            this.top += t;
            this.bottom += b;
            this.left += l;
            this.right += r;
            return this;
        };
        EdgeInsets.prototype.scale = function (v) {
            this.top *= v;
            this.bottom *= v;
            this.left *= v;
            this.right *= v;
            return this;
        };
        EdgeInsets.prototype.addEdgeInsets = function (r) {
            if (r == null)
                return this;
            this.top += r.top;
            this.bottom += r.bottom;
            this.left += r.left;
            this.right += r.right;
            return this;
        };
        Object.defineProperty(EdgeInsets.prototype, "width", {
            get: function () {
                return this.left + this.right;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EdgeInsets.prototype, "height", {
            get: function () {
                return this.top + this.bottom;
            },
            enumerable: true,
            configurable: true
        });
        EdgeInsets.Width = function (o) {
            if (o == null)
                return 0;
            return o.width;
        };
        EdgeInsets.Height = function (o) {
            if (o == null)
                return 0;
            return o.height;
        };
        EdgeInsets.Top = function (o) {
            return o ? o.top : 0;
        };
        EdgeInsets.Left = function (o) {
            return o ? o.left : 0;
        };
        return EdgeInsets;
    }());
    exports.EdgeInsets = EdgeInsets;
    /** 尺寸 */
    var Rect = /** @class */ (function () {
        function Rect(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        }
        Object.defineProperty(Rect.prototype, "isnan", {
            get: function () {
                return isNaN(this.x) || isNaN(this.y) || isNaN(this.width) || isNaN(this.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "position", {
            get: function () {
                return new Point(this.x, this.y);
            },
            set: function (p) {
                this.x = p.x;
                this.y = p.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.origin = function (anchor) {
            if (anchor)
                return new Point(this.x + this.width * anchor.x, this.y + this.height * anchor.y);
            return new Point(this.x, this.y);
        };
        Rect.prototype.setOrigin = function (pt, anchor) {
            if (anchor) {
                this.x = pt.x - this.width * anchor.x;
                this.y = pt.y - this.height * anchor.y;
            }
            else {
                this.x = pt.x;
                this.y = pt.y;
            }
            return this;
        };
        Rect.prototype.alignTo = function (rc, posto, posmy) {
            if (posmy == null)
                posmy = posto;
            this.setPosition(rc.getPosition(posto), posmy);
            return this;
        };
        Rect.prototype.edgeTo = function (rc, edge) {
            switch (edge) {
                case EDGE.START:
                    {
                        this.setLeftTop(rc.leftTop);
                    }
                    break;
                case EDGE.MIDDLE:
                    {
                        this.setCenter(rc.center);
                    }
                    break;
                case EDGE.END:
                    {
                        this.setRightBottom(rc.rightBottom);
                    }
                    break;
            }
            return this;
        };
        Rect.prototype.getPosition = function (pos) {
            switch (pos) {
                case POSITION.LEFT_TOP:
                    return this.leftTop;
                case POSITION.LEFT_CENTER:
                    return this.leftCenter;
                case POSITION.LEFT_BOTTOM:
                    return this.leftBottom;
                case POSITION.CENTER:
                    return this.center;
                case POSITION.TOP_CENTER:
                    return this.topCenter;
                case POSITION.BOTTOM_CENTER:
                    return this.bottomCenter;
                case POSITION.RIGHT_TOP:
                    return this.rightTop;
                case POSITION.RIGHT_CENTER:
                    return this.rightCenter;
                case POSITION.RIGHT_BOTTOM:
                    return this.rightBottom;
            }
        };
        Rect.prototype.setPosition = function (pt, pos) {
            switch (pos) {
                case POSITION.LEFT_TOP:
                    this.leftTop = pt;
                    break;
                case POSITION.LEFT_CENTER:
                    this.leftCenter = pt;
                    break;
                case POSITION.LEFT_BOTTOM:
                    this.leftBottom = pt;
                    break;
                case POSITION.CENTER:
                    this.center = pt;
                    break;
                case POSITION.TOP_CENTER:
                    this.topCenter = pt;
                    break;
                case POSITION.BOTTOM_CENTER:
                    this.bottomCenter = pt;
                    break;
                case POSITION.RIGHT_TOP:
                    this.rightTop = pt;
                    break;
                case POSITION.RIGHT_CENTER:
                    this.rightCenter = pt;
                    break;
                case POSITION.RIGHT_BOTTOM:
                    this.rightBottom = pt;
                    break;
            }
        };
        Object.defineProperty(Rect.prototype, "size", {
            get: function () {
                return new Size(this.width, this.height);
            },
            set: function (v) {
                this.width = v.width;
                this.height = v.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setSize = function (w, h) {
            this.width = w;
            this.height = h;
            return this;
        };
        Rect.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Rect.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Rect.prototype.setWidth = function (w) {
            this.width = w;
            return this;
        };
        Rect.prototype.setHeight = function (h) {
            this.height = h;
            return this;
        };
        Rect.prototype.integral = function () {
            this.x = Integral(this.x);
            this.y = Integral(this.y);
            this.width = Integral(this.width);
            this.height = Integral(this.height);
            return this;
        };
        Rect.prototype.invert = function () {
            var self = this;
            var t = self.x;
            self.x = self.y;
            self.y = t;
            t = self.width;
            self.width = self.height;
            self.height = t;
            return self;
        };
        Rect.prototype.clone = function () {
            var self = this;
            var ret = new Rect();
            ret.x = self.x;
            ret.y = self.y;
            ret.width = self.width;
            ret.height = self.height;
            return ret;
        };
        Rect.prototype.copy = function (r) {
            var self = this;
            self.x = r.x;
            self.y = r.y;
            self.width = r.width;
            self.height = r.height;
            return self;
        };
        Rect.prototype.applyEdgeInsets = function (ei) {
            if (ei == null)
                return this;
            this.x += ei.left;
            this.y += ei.top;
            this.width -= ei.left + ei.right;
            this.height -= ei.top + ei.bottom;
            return this;
        };
        Rect.prototype.unapplyEdgeInsets = function (ei) {
            if (ei == null)
                return this;
            this.x -= ei.left;
            this.y -= ei.top;
            this.width += ei.left + ei.right;
            this.height += ei.top + ei.bottom;
            return this;
        };
        Rect.prototype.applyAnchor = function (ax, ay) {
            this.x -= this.width * ax;
            this.y -= this.height * ay;
            return this;
        };
        Rect.prototype.unapplyAnchor = function (ax, ay) {
            this.x += this.width * ax;
            this.y += this.height * ay;
            return this;
        };
        Rect.prototype.containsPoint = function (pt) {
            return pt.x >= this.x && pt.x <= this.x + this.width &&
                pt.y >= this.y && pt.y <= this.y + this.height;
        };
        Rect.ContainsPoint = function (x, y, rx, ry, rw, rh) {
            return x >= rx && x <= rx + rw &&
                y >= ry && y <= ry + rh;
        };
        Rect.Area = function (o) {
            return o.width * o.height;
        };
        Rect.Swap = function (l, r) {
            var x = l.x, y = l.y, w = l.width, h = l.height;
            l.x = r.x;
            l.y = r.y;
            l.width = r.width;
            l.height = r.height;
            r.x = x;
            r.y = y;
            r.width = w;
            r.height = h;
        };
        Rect.prototype.maxSize = function (w, h) {
            if (w != undefined && this.width > w)
                this.width = w;
            if (h != undefined && this.height > h)
                this.height = h;
            return this;
        };
        Rect.prototype.minSize = function (w, h) {
            if (w != undefined && this.width < w)
                this.width = w;
            if (h != undefined && this.height < h)
                this.height = h;
            return this;
        };
        Rect.prototype.isEqual = function (r) {
            return this.x == r.x && this.y == r.y &&
                this.width == r.width && this.height == r.height;
        };
        Rect.prototype.add = function (x, y, w, h) {
            this.x += x;
            this.y += y;
            if (w)
                this.width += w;
            if (h)
                this.height += h;
            return this;
        };
        Rect.prototype.union = function (r) {
            var maxX = this.maxX;
            var maxY = this.maxY;
            if (this.x > r.x)
                this.x = r.x;
            if (this.y > r.y)
                this.y = r.y;
            if (maxX < r.maxX)
                this.width += r.maxX - maxX;
            if (maxY < r.maxY)
                this.height += r.maxY - maxY;
            return this;
        };
        Rect.prototype.deflate = function (w, h) {
            return this.add(w * 0.5, h * 0.5, -w, -h);
        };
        Rect.prototype.deflateR = function (rw, rh) {
            return this.deflate(this.width * rw, this.height * rh);
        };
        Rect.prototype.scale = function (s, anchor) {
            if (anchor == undefined) {
                this.x *= s;
                this.y *= s;
            }
            else {
                this.x -= (this.width * s - this.width) * anchor.x;
                this.y -= (this.height * s - this.height) * anchor.y;
            }
            this.width *= s;
            this.height *= s;
            return this;
        };
        Object.defineProperty(Rect.prototype, "outterRadius", {
            // 外接圆的半径
            get: function () {
                var len = Math.max(this.width, this.height);
                return Math.sqrt(len * len * 2) / 2;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.multiRect = function (x, y, w, h) {
            if (x != null)
                this.x *= x;
            if (y != null)
                this.y *= y;
            if (w != null)
                this.width *= w;
            if (h != null)
                this.height *= h;
            return this;
        };
        Rect.prototype.scaleWidth = function (w) {
            this.width *= w;
            return this;
        };
        Rect.prototype.scaleHeight = function (h) {
            this.height *= h;
            return this;
        };
        Rect.prototype.clipCenter = function (w, h) {
            if (w) {
                var d = this.width - w;
                this.x += d * 0.5;
                this.width -= d;
            }
            if (h) {
                var d = this.height - h;
                this.y += d * 0.5;
                this.height -= d;
            }
            return this;
        };
        Rect.prototype.reset = function (x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
            return this;
        };
        Object.defineProperty(Rect.prototype, "minX", {
            get: function () {
                return this.x;
            },
            set: function (v) {
                this.x = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "maxX", {
            get: function () {
                return this.x + this.width;
            },
            set: function (v) {
                this.x = v - this.width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "minY", {
            get: function () {
                return this.y;
            },
            set: function (v) {
                this.y = v;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "maxY", {
            get: function () {
                return this.y + this.height;
            },
            set: function (v) {
                this.y = v - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "minL", {
            get: function () {
                return Math.min(this.width, this.height);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "maxL", {
            get: function () {
                return Math.max(this.width, this.height);
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.toPolygon = function () {
            return new Polygon()
                .add(new Point(this.x, this.y))
                .add(new Point(this.x, this.y + this.height))
                .add(new Point(this.x + this.width, this.y + this.height))
                .add(new Point(this.x + this.width, this.y));
        };
        Rect.prototype.offset = function (pt) {
            this.x += pt.x;
            this.y += pt.y;
            return this;
        };
        Object.defineProperty(Rect.prototype, "center", {
            get: function () {
                return new Point(this.x + this.width * 0.5, this.y + this.height * 0.5);
            },
            set: function (pt) {
                this.x = pt.x - this.width * 0.5;
                this.y = pt.y - this.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setCenter = function (pt) {
            this.center = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "leftTop", {
            get: function () {
                return new Point(this.x, this.y);
            },
            set: function (pt) {
                this.x = pt.x;
                this.y = pt.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setLeftTop = function (pt) {
            this.leftTop = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "leftBottom", {
            get: function () {
                return new Point(this.x, this.y + this.height);
            },
            set: function (pt) {
                this.x = pt.x;
                this.y = pt.y - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setLeftBottom = function (pt) {
            this.leftBottom = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "rightTop", {
            get: function () {
                return new Point(this.x + this.width, this.y);
            },
            set: function (pt) {
                this.x = pt.x - this.width;
                this.y = pt.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setRightTop = function (pt) {
            this.rightTop = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "rightBottom", {
            get: function () {
                return new Point(this.x + this.width, this.y + this.height);
            },
            set: function (pt) {
                this.x = pt.x - this.width;
                this.y = pt.y - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setRightBottom = function (pt) {
            this.rightBottom = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "topCenter", {
            get: function () {
                return new Point(this.x + this.width * 0.5, this.y);
            },
            set: function (pt) {
                this.x = pt.x - this.width * 0.5;
                this.y = pt.y;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setTopCenter = function (pt) {
            this.topCenter = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "bottomCenter", {
            get: function () {
                return new Point(this.x + this.width * 0.5, this.y + this.height);
            },
            set: function (pt) {
                this.x = pt.x - this.width * 0.5;
                this.y = pt.y - this.height;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setBottomCenter = function (pt) {
            this.bottomCenter = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "leftCenter", {
            get: function () {
                return new Point(this.x, this.y + this.height * 0.5);
            },
            set: function (pt) {
                this.x = pt.x;
                this.y = pt.y - this.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setLeftCenter = function (pt) {
            this.leftCenter = pt;
            return this;
        };
        Object.defineProperty(Rect.prototype, "rightCenter", {
            get: function () {
                return new Point(this.x + this.width, this.y + this.height * 0.5);
            },
            set: function (pt) {
                this.x = pt.x - this.width;
                this.y = pt.y - this.height * 0.5;
            },
            enumerable: true,
            configurable: true
        });
        Rect.prototype.setRightCenter = function (pt) {
            this.rightCenter = pt;
            return this;
        };
        Rect.prototype.toString = function () {
            return this.x + "," + this.y + "," + this.width + "," + this.height;
        };
        Object.defineProperty(Rect.prototype, "nearest", {
            get: function () {
                return this._nearest == null ? 0.1 : this._nearest;
            },
            enumerable: true,
            configurable: true
        });
        /** 将当前的rc映射到目标rc中，默认会居中结果 */
        Rect.prototype.fill = function (to, mode) {
            var self = this;
            if (self.width == 0 || self.height == 0)
                return self;
            var needcenter = true;
            switch (mode & FillMode.MASK_MAJOR) {
                case FillMode.STRETCH:
                    {
                        self.copy(to);
                    }
                    break;
                case FillMode.MAPIN:
                    {
                        if (this.maxX > to.maxX)
                            this.maxX = to.maxX;
                        if (this.maxY > to.maxY)
                            this.maxY = to.maxY;
                        if (this.minX < to.minX)
                            this.minX = to.minX;
                        if (this.minY < to.minY)
                            this.minY = to.minY;
                        needcenter = false;
                    }
                    break;
                case FillMode.NEARESTSTRETCH:
                    {
                        // 先做 as，如果接近，则拉伸
                        var rw = self.width / to.width;
                        var rh = self.height / to.height;
                        if (rw < rh) {
                            self.width /= rh;
                            self.height = to.height;
                        }
                        else {
                            self.height /= rw;
                            self.width = to.width;
                        }
                        rw = self.width / to.width;
                        rh = self.height / to.height;
                        if (Math.abs(rw - rh) < self.nearest) {
                            self.copy(to);
                        }
                    }
                    break;
                case FillMode.ASPECTSTRETCH:
                    {
                        var rw = self.width / to.width;
                        var rh = self.height / to.height;
                        if (rw < rh) {
                            self.width /= rh;
                            self.height = to.height;
                        }
                        else {
                            self.height /= rw;
                            self.width = to.width;
                        }
                    }
                    break;
                case FillMode.ASPECTFILL:
                    {
                        var rw = self.width / to.width;
                        var rh = self.height / to.height;
                        if (rw < rh) {
                            self.height /= rw;
                            self.width = to.width;
                        }
                        else {
                            self.width /= rh;
                            self.height = to.height;
                        }
                    }
                    break;
            }
            if (Mask.isset(FillMode.NOBORDER, mode)) {
                var r1 = to.width / to.height;
                if (self.width / to.width < self.height / to.height) {
                    self.width = self.height * r1;
                }
                else {
                    self.height = self.width / r1;
                }
            }
            if (Mask.isset(FillMode.NEAREST, mode)) {
                var rw = self.width / to.width;
                var rh = self.height / to.height;
                if (Math.abs(rw - rh) < self.nearest) {
                    if (rw < rh) {
                        self.width /= rw;
                    }
                    else {
                        self.height /= rh;
                    }
                }
            }
            if (needcenter)
                self.center = to.center;
            return self;
        };
        // 转换到笛卡尔坐标系
        Rect.prototype.applyCartesian = function (tfm) {
            var self = this;
            self.y = tfm.height - self.y - self.height - tfm.y;
            self.x += tfm.x;
            return self;
        };
        Rect.prototype.unapplyCartesian = function (tfm) {
            var self = this;
            self.y = tfm.height - self.y - tfm.y;
            self.x -= tfm.x;
            return self;
        };
        Rect.Zero = new Rect();
        Rect.Max = new Rect(-999999, -999999, 999999, 999999);
        return Rect;
    }());
    exports.Rect = Rect;
    var UnionRect = /** @class */ (function (_super) {
        __extends(UnionRect, _super);
        function UnionRect(x, y, w, h) {
            var _this = _super.call(this) || this;
            _this.x = x;
            _this.y = y;
            _this.width = w;
            _this.height = h;
            return _this;
        }
        UnionRect.prototype.union = function (r) {
            var self = this;
            if (self.x == null || self.y == null || self.width == null || self.height == null) {
                self.x = r.x;
                self.y = r.y;
                self.width = r.width;
                self.height = r.height;
                return self;
            }
            return _super.prototype.union.call(this, r);
        };
        return UnionRect;
    }(Rect));
    exports.UnionRect = UnionRect;
    var Layout = /** @class */ (function () {
        function Layout(ctx) {
            this._ctx = ctx;
        }
        Layout.prototype.useAnchor = function (b) {
            this.anchor = b;
            return this;
        };
        /** 设置整体大小 */
        Layout.prototype.setRect = function (rc) {
            if (this._orc == null) {
                this._orc = rc;
            }
            else {
                this._orc.x = rc.x;
                this._orc.y = rc.y;
                this._orc.width = rc.width;
                this._orc.height = rc.height;
            }
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return this;
        };
        Object.defineProperty(Layout.prototype, "frame", {
            /** 获得整体大小 */
            get: function () {
                this._avaRect();
                return this._orc.clone();
            },
            set: function (rc) {
                this.setRect(rc);
            },
            enumerable: true,
            configurable: true
        });
        // 初始化 rect
        Layout.prototype._avaRect = function () {
            if (this._orc)
                return false;
            if (this._ctx) {
                this._orc = this._ctx.boundsForLayout();
            }
            else {
                this._orc = new Rect();
                console.warn("没有设置 Box 的 Rect");
            }
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return true;
        };
        Layout.prototype.frameForLayout = function () {
            this._avaRect();
            return this._rc.clone();
        };
        /** 设置布局的边距 */
        Layout.prototype.padding = function (ei) {
            this.edgeInsets = ei;
            if (this._avaRect() == false)
                this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
            return this;
        };
        /** 偏移 */
        Layout.prototype.offset = function (pt) {
            this._avaRect();
            this._orc.offset(pt);
            this._rc.offset(pt);
            return this;
        };
        /** 应用布局 */
        Layout.prototype.apply = function () {
            // 确保 rect 不是 null
            this._avaRect();
            this._offset = 0;
            // 如果有依赖的 view，则之后的布局均按照在 view 内部布局来处理
            if (this.view) {
                this.view.setFrame(this._rc);
                this.setRect(this.view.boundsForLayout());
            }
            // 不能在此处理结束，由子类负责
        };
        Layout.prototype.complete = function (cb, ctx) {
            this._cbcomplete = cb;
            this._ctxcomplete = ctx;
        };
        return Layout;
    }());
    exports.Layout = Layout;
    var LinearSegment = /** @class */ (function () {
        function LinearSegment() {
        }
        LinearSegment.prototype.dispose = function () {
            this.obj = undefined;
            this.cb = undefined;
            this.ctx = undefined;
            this.data = undefined;
        };
        LinearSegment.prototype.setRect = function (x, y, w, h) {
            if (this.cb) {
                this.cb.call(this.ctx, this.obj, new Rect(x, y, w, h), this.data);
            }
            else if (this.obj) {
                this.obj.setFrame(new Rect(x, y, w, h), this.anchor);
            }
        };
        return LinearSegment;
    }());
    exports.LinearSegment = LinearSegment;
    var LinearLayout = /** @class */ (function (_super) {
        __extends(LinearLayout, _super);
        function LinearLayout() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._segments = new Array();
            /** 间距 */
            _this.spacing = 0;
            return _this;
        }
        LinearLayout.prototype.setSpacing = function (v) {
            this.spacing = v;
            return this;
        };
        LinearLayout.prototype.clear = function () {
            ArrayT.Clear(this._segments, function (o) {
                o.dispose();
            });
        };
        /** 按照像素划分 */
        LinearLayout.prototype.addPixel = function (pixel, obj, cb, ctx, data) {
            var seg = new LinearSegment();
            seg.val = pixel;
            seg.isp = true;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        };
        /** 按照定比来划分，总比例为各个 flex 之和，每一个 flex 的长度为 (总长 - 固定像素长) / 总 flex */
        LinearLayout.prototype.addFlex = function (flex, obj, cb, ctx, data) {
            var seg = new LinearSegment();
            seg.val = flex;
            seg.isp = false;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        };
        LinearLayout.prototype.addPixelHBox = function (pixel, boxcb, ctx, data) {
            this.addPixel(pixel, null, function (obj, rc, data) {
                var box = new HBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addPixelVBox = function (pixel, boxcb, ctx, data) {
            this.addPixel(pixel, null, function (obj, rc, data) {
                var box = new VBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addFlexHBox = function (flex, boxcb, ctx, data) {
            this.addFlex(flex, null, function (obj, rc, data) {
                var box = new HBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addFlexVBox = function (flex, boxcb, ctx, data) {
            this.addFlex(flex, null, function (obj, rc, data) {
                var box = new VBox(this).setRect(rc);
                boxcb.call(this, box, data);
                box.apply();
            }, ctx, data);
            return this;
        };
        LinearLayout.prototype.addAspect = function (w, h, obj, cb, ctx, data) {
            return this.addPixel(w / h * this.against(), obj, cb, ctx, data);
        };
        LinearLayout.prototype.addAspectHBox = function (w, h, boxcb, ctx, data) {
            return this.addPixelHBox(w / h * this.against(), boxcb, ctx, data);
        };
        LinearLayout.prototype.addAspectVBox = function (w, h, boxcb, ctx, data) {
            return this.addPixelVBox(w / h * this.against(), boxcb, ctx, data);
        };
        LinearLayout.prototype.apply = function () {
            var _this = this;
            _super.prototype.apply.call(this);
            // 计算所有的定长度，扣除后，计算所有的占比和单份占比
            var sumpixel = 0, sumflex = 0;
            this._segments.forEach(function (seg) {
                if (seg.isp)
                    sumpixel += seg.val;
                else
                    sumflex += seg.val;
            }, this);
            var lftlen = this.length() - sumpixel;
            var seglen = sumflex ? lftlen / sumflex : 0;
            // 应用长度
            this._segments.forEach(function (seg, idx) {
                var val = 0;
                if (seg.isp)
                    val = seg.val;
                else
                    val = seg.val * seglen;
                _this._offset += _this.setSegmentLength(val, seg, idx);
            }, this);
            // 处理结束
            if (this._cbcomplete)
                this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);
            // 清空
            this.clear();
        };
        // 获得间距占的长度
        LinearLayout.prototype._spacingsLength = function () {
            var self = this;
            if (self.spacing == 0)
                return 0;
            var cnt = self._segments.length;
            if (cnt > 1)
                return self.spacing * (cnt - 1);
            return 0;
        };
        // 一些工具函数
        // 按照比例来从中间拿出固定大小
        LinearLayout.prototype.clipPixel = function (pix, obj, lflex, rflex, cb, ctx, data) {
            if (lflex === void 0) { lflex = 1; }
            if (rflex === void 0) { rflex = 1; }
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixel(pix, obj, cb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        };
        LinearLayout.prototype.clipFlex = function (flex, obj, lpix, rpix, cb, ctx, data) {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlex(flex, obj, cb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        };
        LinearLayout.prototype.clipPixelHBox = function (pix, boxcb, lflex, rflex, ctx, data) {
            if (lflex === void 0) { lflex = 1; }
            if (rflex === void 0) { rflex = 1; }
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixelHBox(pix, boxcb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        };
        LinearLayout.prototype.clipFlexHBox = function (flex, boxcb, lpix, rpix, ctx, data) {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlexHBox(flex, boxcb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        };
        LinearLayout.prototype.clipPixelVBox = function (pix, boxcb, lflex, rflex, ctx, data) {
            if (lflex === void 0) { lflex = 1; }
            if (rflex === void 0) { rflex = 1; }
            if (lflex != 0)
                this.addFlex(lflex);
            this.addPixelVBox(pix, boxcb, ctx, data);
            if (rflex != 0)
                this.addFlex(rflex);
            return this;
        };
        LinearLayout.prototype.clipFlexVBox = function (flex, boxcb, lpix, rpix, ctx, data) {
            if (lpix != 0)
                this.addPixel(lpix);
            this.addFlexVBox(flex, boxcb, ctx, data);
            if (rpix != 0)
                this.addPixel(rpix);
            return this;
        };
        return LinearLayout;
    }(Layout));
    exports.LinearLayout = LinearLayout;
    var HBox = /** @class */ (function (_super) {
        __extends(HBox, _super);
        function HBox(ctx) {
            return _super.call(this, ctx) || this;
        }
        HBox.prototype.length = function () {
            return this._rc.width - this._spacingsLength();
        };
        HBox.prototype.against = function () {
            this._avaRect();
            return this._rc.height;
        };
        HBox.prototype.setSegmentLength = function (len, seg, idx) {
            var self = this;
            seg.setRect(self._offset + self._rc.x, self._rc.y, len, self._rc.height);
            if (self.spacing && (idx + 1) < self._segments.length)
                len += self.spacing;
            return len;
        };
        return HBox;
    }(LinearLayout));
    exports.HBox = HBox;
    var VBox = /** @class */ (function (_super) {
        __extends(VBox, _super);
        function VBox(ctx) {
            return _super.call(this, ctx) || this;
        }
        VBox.prototype.length = function () {
            return this._rc.height - this._spacingsLength();
        };
        VBox.prototype.against = function () {
            this._avaRect();
            return this._rc.width;
        };
        VBox.prototype.setSegmentLength = function (len, seg, idx) {
            var self = this;
            seg.setRect(self._rc.x, self._offset + self._rc.y, self._rc.width, len);
            if (self.spacing && (idx + 1) < self._segments.length)
                len += self.spacing;
            return len;
        };
        return VBox;
    }(LinearLayout));
    exports.VBox = VBox;
    var FlowOption;
    (function (FlowOption) {
        FlowOption[FlowOption["Fix"] = 0] = "Fix";
        FlowOption[FlowOption["Stretch"] = 1] = "Stretch";
    })(FlowOption = exports.FlowOption || (exports.FlowOption = {}));
    ;
    var FlowSegment = /** @class */ (function () {
        function FlowSegment() {
        }
        FlowSegment.prototype.dispose = function () {
            this.obj = undefined;
            this.cb = undefined;
            this.ctx = undefined;
            this.data = undefined;
        };
        FlowSegment.prototype.setRect = function (x, y, w) {
            if (this.cb) {
                this.cb.call(this.ctx, this.obj, new Rect(x, y, w, this.h), this.data);
            }
            else if (this.obj) {
                this.obj.setFrame(new Rect(x, y, w, this.h), this.anchor);
            }
        };
        return FlowSegment;
    }());
    exports.FlowSegment = FlowSegment;
    var HFlow = /** @class */ (function (_super) {
        __extends(HFlow, _super);
        function HFlow(ctx) {
            var _this = _super.call(this, ctx) || this;
            _this._segments = new Array();
            return _this;
        }
        HFlow.prototype.clear = function () {
            ArrayT.Clear(this._segments, function (o) {
                o.dispose();
            });
        };
        HFlow.prototype.addSize = function (w, h, option, obj, cb, ctx, data) {
            if (option === void 0) { option = 0; }
            var seg = new FlowSegment();
            seg.w = w;
            seg.h = h;
            seg.option = option;
            seg.obj = obj;
            seg.cb = cb;
            seg.ctx = ctx ? ctx : this._ctx;
            seg.data = data;
            seg.anchor = this.anchor;
            this._segments.push(seg);
            return this;
        };
        HFlow.prototype.apply = function () {
            var _this = this;
            _super.prototype.apply.call(this);
            this._avaRect();
            this.position = this._rc.leftTop;
            var w = this._rc.width;
            var h = this._rc.height;
            // 按照行划分格子
            var sw = 0, sh = 0;
            var rows = new Array();
            this._segments.forEach(function (seg) {
                if (sw + seg.w <= w) {
                    sw += seg.w;
                    if (sh < seg.h)
                        sh = seg.h;
                    rows.push(seg);
                }
                else {
                    // 超出了当前行的宽度，需要换行并应用掉
                    _this.applyRows(rows, _this.position, w);
                    ArrayT.Clear(rows);
                    // 开始下一行
                    _this.position.y += sh;
                    sw = seg.w;
                    sh = seg.h;
                    rows.push(seg);
                }
            }, this);
            // 如果最后一行没有遇到换行，则需要附加计算一次
            if (rows.length) {
                this.applyRows(rows, this.position, w);
                ArrayT.Clear(rows);
                this.position.y += sh;
            }
            // 处理结束
            if (this._cbcomplete)
                this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);
            // 清理
            this.clear();
        };
        HFlow.prototype.applyRows = function (rows, pos, w) {
            var _this = this;
            this._offset = 0;
            // 和 linear 的 flex 算法类似
            var flex = 0, pix = 0;
            rows.forEach(function (seg) {
                if (seg.option == FlowOption.Stretch)
                    flex += 1;
                pix += seg.w;
            }, this);
            // 计算可以拉伸的控件需要拉大多少
            flex = flex ? ((w - pix) / flex) : 0;
            // 布局
            rows.forEach(function (seg) {
                var w = seg.w;
                if (seg.option == FlowOption.Stretch)
                    w += flex;
                seg.setRect(_this._offset + pos.x, pos.y, w);
                _this._offset += w;
            });
        };
        return HFlow;
    }(Layout));
    exports.HFlow = HFlow;
});
