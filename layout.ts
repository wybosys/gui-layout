export enum POSITION {
    LEFT_TOP = 0,
    LEFT_CENTER = 1,
    LEFT_BOTTOM = 2,
    TOP_CENTER = 3,
    CENTER = 4,
    BOTTOM_CENTER = 5,
    RIGHT_TOP = 6,
    RIGHT_CENTER = 7,
    RIGHT_BOTTOM = 8,
}

export enum EDGE {
    START = 1,
    MIDDLE = 0,
    END = 2
}

export enum FillMode {
    // 几何拉伸
    STRETCH = 0x1000,

    // 居中
    CENTER = 0x2000,

    // 不变形拉伸(留黑边)
    ASPECTSTRETCH = 0x3000,

    // 不变形填充(无黑边，有裁剪)
    ASPECTFILL = 0x4000,

    // 不变形近似拉伸(无黑边使用阈值拉伸)
    NEARESTSTRETCH = 0x5000,

    // 置于区域中
    MAPIN = 0x6000,

    // 附加参数
    NOBORDER = 0x1, // 没有黑边，只在CENTER时起作用
    MAXIMUM = 0x2, // 控制最大尺寸, 不设置代表控制最小尺寸
    NEAREST = 0x4, // 近似调整

    MASK_MAJOR = 0xf000,
}

export class Mask {
    static isset<T>(mask: T, value: T): boolean {
        return (<any>value & <any>mask) == <any>mask;
    }

    static unset<T>(mask: T, value: T): T {
        if (this.isset(mask, value))
            return <any>((<any>value) & (~<any>mask));
        return value;
    }

    static set<T>(mask: T, value: T): T {
        if (this.isset(mask, value))
            return value;
        return <any>(<any>value | <any>mask);
    }
}

class ArrayT {

    /** 清空数组，并挨个回调 */
    static Clear<T>(arr: T[], cb?: (o: T) => void, ctx?: any) {
        if (cb)
            arr.forEach(cb, ctx);
        arr.length = 0;
    }
}

export function Integral(v: number): number {
    return (v + 0.5) >> 0;
}

/** 点 */
export class Point {
    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    x: number;
    y: number;

    reset(x: number = 0, y: number = 0): this {
        this.x = x;
        this.y = y;
        return this;
    }

    clone(): Point {
        let r = new Point();
        r.x = this.x;
        r.y = this.y;
        return r;
    }

    copy(r: Point): this {
        this.x = r.x;
        this.y = r.y;
        return this;
    }

    addPoint(r: Point): this {
        this.x += r.x;
        this.y += r.y;
        return this;
    }

    subPoint(r: Point): this {
        this.x -= r.x;
        this.y -= r.y;
        return this;
    }

    add(x?: number, y?: number): this {
        if (x)
            this.x += x;
        if (y)
            this.y += y;
        return this;
    }

    multiPoint(r: Point): this {
        this.x *= r.x;
        this.y *= r.y;
        return this;
    }

    scale(v: number, vy?: number): this {
        if (vy == null)
            vy = v;
        this.x *= v;
        this.y *= vy;
        return this;
    }

    isEqual(r: Point): boolean {
        return this.x == r.x &&
            this.y == r.y;
    }

    invert(): this {
        let t = this.x;
        this.x = this.y;
        this.y = t;
        return this;
    }

    static AnchorCC = new Point(0.5, 0.5);
    static AnchorLT = new Point(0, 0);
    static AnchorLC = new Point(0, 0.5);
    static AnchorLB = new Point(0, 1);
    static AnchorTC = new Point(0.5, 0);
    static AnchorBC = new Point(0.5, 1);
    static AnchorRT = new Point(1, 0);
    static AnchorRC = new Point(1, 0.5);
    static AnchorRB = new Point(1, 1);

    toString(): string {
        return this.x + ',' + this.y;
    }

    fromString(s: string) {
        if (s == null) {
            this.x = this.y = 0;
            return;
        }
        let c = s.split(',');
        this.x = parseFloat(c[0]);
        this.y = parseFloat(c[1]);
    }

    static Zero = new Point();
}

export class Size extends Point {
    constructor(w: number = 0, h: number = 0) {
        super(w, h);
    }

    get width(): number {
        return this.x;
    }

    set width(w: number) {
        this.x = w;
    }

    get height(): number {
        return this.y;
    }

    set height(h: number) {
        this.y = h;
    }

    toRect(): Rect {
        return new Rect(0, 0, this.width, this.height);
    }

    addSize(r: Size): Size {
        this.x += r.x;
        this.y += r.y;
        return this;
    }

    static Zero = new Size();
}

/** 多边形 */
export class Polygon {
    add(pt: Point): Polygon {
        this._pts.push(pt);
        return this;
    }

    clear(): Polygon {
        this._pts.length = 0;
        return this;
    }

    get length(): number {
        return this._pts.length;
    }

    _pts = new Array<Point>();
}

/** 边距 */
export class EdgeInsets {
    top: number;
    bottom: number;
    left: number;
    right: number;

    constructor(t = 0, b = 0, l = 0, r = 0) {
        this.top = t;
        this.bottom = b;
        this.left = l;
        this.right = r;
    }

    static All(v: number): EdgeInsets {
        return new EdgeInsets(v, v, v, v);
    }

    add(t: number, b: number, l: number, r: number): EdgeInsets {
        this.top += t;
        this.bottom += b;
        this.left += l;
        this.right += r;
        return this;
    }

    scale(v: number): EdgeInsets {
        this.top *= v;
        this.bottom *= v;
        this.left *= v;
        this.right *= v;
        return this;
    }

    addEdgeInsets(r: EdgeInsets): EdgeInsets {
        if (r == null)
            return this;
        this.top += r.top;
        this.bottom += r.bottom;
        this.left += r.left;
        this.right += r.right;
        return this;
    }

    get width(): number {
        return this.left + this.right;
    }

    get height(): number {
        return this.top + this.bottom;
    }

    static Width(o: EdgeInsets): number {
        if (o == null)
            return 0;
        return o.width;
    }

    static Height(o: EdgeInsets): number {
        if (o == null)
            return 0;
        return o.height;
    }

    static Top(o: EdgeInsets): number {
        return o ? o.top : 0;
    }

    static Left(o: EdgeInsets): number {
        return o ? o.left : 0;
    }
}

/** 尺寸 */
export class Rect {
    constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    x: number;
    y: number;
    width: number;
    height: number;

    static Zero = new Rect();
    static Max = new Rect(-999999, -999999, 999999, 999999);

    get isnan(): boolean {
        return isNaN(this.x) || isNaN(this.y) || isNaN(this.width) || isNaN(this.height);
    }

    get position(): Point {
        return new Point(this.x, this.y);
    }

    set position(p: Point) {
        this.x = p.x;
        this.y = p.y;
    }

    origin(anchor?: Point): Point {
        if (anchor)
            return new Point(this.x + this.width * anchor.x,
                this.y + this.height * anchor.y);
        return new Point(this.x, this.y);
    }

    setOrigin(pt: Point, anchor?: Point): this {
        if (anchor) {
            this.x = pt.x - this.width * anchor.x;
            this.y = pt.y - this.height * anchor.y;
        } else {
            this.x = pt.x;
            this.y = pt.y;
        }
        return this;
    }

    alignTo(rc: Rect, posto: POSITION, posmy?: POSITION): this {
        if (posmy == null)
            posmy = posto;
        this.setPosition(rc.getPosition(posto), posmy);
        return this;
    }

    edgeTo(rc: Rect, edge: EDGE): this {
        switch (edge) {
            case EDGE.START: {
                this.setLeftTop(rc.leftTop);
            }
                break;
            case EDGE.MIDDLE: {
                this.setCenter(rc.center);
            }
                break;
            case EDGE.END: {
                this.setRightBottom(rc.rightBottom);
            }
                break;
        }
        return this;
    }

    getPosition(pos: POSITION): Point {
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
    }

    setPosition(pt: Point, pos: POSITION) {
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
    }

    get size(): Size {
        return new Size(this.width, this.height);
    }

    set size(v: Size) {
        this.width = v.width;
        this.height = v.height;
    }

    setSize(w: number, h: number): this {
        this.width = w;
        this.height = h;
        return this;
    }

    setX(x: number): this {
        this.x = x;
        return this;
    }

    setY(y: number): this {
        this.y = y;
        return this;
    }

    setWidth(w: number): this {
        this.width = w;
        return this;
    }

    setHeight(h: number): this {
        this.height = h;
        return this;
    }

    integral(): this {
        this.x = Integral(this.x);
        this.y = Integral(this.y);
        this.width = Integral(this.width);
        this.height = Integral(this.height);
        return this;
    }

    invert(): this {
        let self = this;
        let t = self.x;
        self.x = self.y;
        self.y = t;
        t = self.width;
        self.width = self.height;
        self.height = t;
        return self;
    }

    clone(): Rect {
        let self = this;
        let ret = new Rect();
        ret.x = self.x;
        ret.y = self.y;
        ret.width = self.width;
        ret.height = self.height;
        return ret;
    }

    copy(r: Rect): this {
        let self = this;
        self.x = r.x;
        self.y = r.y;
        self.width = r.width;
        self.height = r.height;
        return self;
    }

    applyEdgeInsets(ei: EdgeInsets): this {
        if (ei == null)
            return this;
        this.x += ei.left;
        this.y += ei.top;
        this.width -= ei.left + ei.right;
        this.height -= ei.top + ei.bottom;
        return this;
    }

    unapplyEdgeInsets(ei: EdgeInsets): this {
        if (ei == null)
            return this;
        this.x -= ei.left;
        this.y -= ei.top;
        this.width += ei.left + ei.right;
        this.height += ei.top + ei.bottom;
        return this;
    }

    applyAnchor(ax: number, ay: number): this {
        this.x -= this.width * ax;
        this.y -= this.height * ay;
        return this;
    }

    unapplyAnchor(ax: number, ay: number): this {
        this.x += this.width * ax;
        this.y += this.height * ay;
        return this;
    }

    containsPoint(pt: Point): boolean {
        return pt.x >= this.x && pt.x <= this.x + this.width &&
            pt.y >= this.y && pt.y <= this.y + this.height;
    }

    static ContainsPoint(x: number, y: number, rx: number, ry: number, rw: number, rh: number) {
        return x >= rx && x <= rx + rw &&
            y >= ry && y <= ry + rh;
    }

    static Area(o: any): number {
        return o.width * o.height;
    }

    static Swap(l: any, r: any) {
        let x = l.x, y = l.y, w = l.width, h = l.height;
        l.x = r.x;
        l.y = r.y;
        l.width = r.width;
        l.height = r.height;
        r.x = x;
        r.y = y;
        r.width = w;
        r.height = h;
    }

    maxSize(w?: number, h?: number): this {
        if (w != undefined && this.width > w)
            this.width = w;
        if (h != undefined && this.height > h)
            this.height = h;
        return this;
    }

    minSize(w?: number, h?: number): this {
        if (w != undefined && this.width < w)
            this.width = w;
        if (h != undefined && this.height < h)
            this.height = h;
        return this;
    }

    isEqual(r: Rect): boolean {
        return this.x == r.x && this.y == r.y &&
            this.width == r.width && this.height == r.height;
    }

    add(x: number, y: number, w?: number, h?: number): this {
        this.x += x;
        this.y += y;
        if (w)
            this.width += w;
        if (h)
            this.height += h;
        return this;
    }

    union(r: Rect): this {
        let maxX = this.maxX;
        let maxY = this.maxY;
        if (this.x > r.x)
            this.x = r.x;
        if (this.y > r.y)
            this.y = r.y;
        if (maxX < r.maxX)
            this.width += r.maxX - maxX;
        if (maxY < r.maxY)
            this.height += r.maxY - maxY;
        return this;
    }

    deflate(w: number, h: number): this {
        return this.add(w * 0.5, h * 0.5,
            -w, -h);
    }

    deflateR(rw: number, rh: number): this {
        return this.deflate(this.width * rw, this.height * rh);
    }

    scale(s: number, anchor?: Point): this {
        if (anchor == undefined) {
            this.x *= s;
            this.y *= s;
        } else {
            this.x -= (this.width * s - this.width) * anchor.x;
            this.y -= (this.height * s - this.height) * anchor.y;
        }
        this.width *= s;
        this.height *= s;
        return this;
    }

    // 外接圆的半径
    get outterRadius(): number {
        let len = Math.max(this.width, this.height);
        return Math.sqrt(len * len * 2) / 2;
    }

    multiRect(x: number, y: number, w: number, h: number): this {
        if (x != null)
            this.x *= x;
        if (y != null)
            this.y *= y;
        if (w != null)
            this.width *= w;
        if (h != null)
            this.height *= h;
        return this;
    }

    scaleWidth(w: number): this {
        this.width *= w;
        return this;
    }

    scaleHeight(h: number): this {
        this.height *= h;
        return this;
    }

    clipCenter(w?: number, h?: number): this {
        if (w) {
            let d = this.width - w;
            this.x += d * 0.5;
            this.width -= d;
        }
        if (h) {
            let d = this.height - h;
            this.y += d * 0.5;
            this.height -= d;
        }
        return this;
    }

    reset(x: number = 0, y: number = 0, w: number = 0, h: number = 0): this {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        return this;
    }

    get minX(): number {
        return this.x;
    }

    set minX(v: number) {
        this.x = v;
    }

    get maxX(): number {
        return this.x + this.width;
    }

    set maxX(v: number) {
        this.x = v - this.width;
    }

    get minY(): number {
        return this.y;
    }

    set minY(v: number) {
        this.y = v;
    }

    get maxY(): number {
        return this.y + this.height;
    }

    set maxY(v: number) {
        this.y = v - this.height;
    }

    get minL(): number {
        return Math.min(this.width, this.height);
    }

    get maxL(): number {
        return Math.max(this.width, this.height);
    }

    toPolygon(): Polygon {
        return new Polygon()
            .add(new Point(this.x, this.y))
            .add(new Point(this.x, this.y + this.height))
            .add(new Point(this.x + this.width, this.y + this.height))
            .add(new Point(this.x + this.width, this.y));
    }

    offset(pt: Point): this {
        this.x += pt.x;
        this.y += pt.y;
        return this;
    }

    get center(): Point {
        return new Point(this.x + this.width * 0.5,
            this.y + this.height * 0.5);
    }

    set center(pt: Point) {
        this.x = pt.x - this.width * 0.5;
        this.y = pt.y - this.height * 0.5;
    }

    setCenter(pt: Point): this {
        this.center = pt;
        return this;
    }

    get leftTop(): Point {
        return new Point(this.x, this.y);
    }

    set leftTop(pt: Point) {
        this.x = pt.x;
        this.y = pt.y;
    }

    setLeftTop(pt: Point): this {
        this.leftTop = pt;
        return this;
    }

    get leftBottom(): Point {
        return new Point(this.x, this.y + this.height);
    }

    set leftBottom(pt: Point) {
        this.x = pt.x;
        this.y = pt.y - this.height;
    }

    setLeftBottom(pt: Point): this {
        this.leftBottom = pt;
        return this;
    }

    get rightTop(): Point {
        return new Point(this.x + this.width, this.y);
    }

    set rightTop(pt: Point) {
        this.x = pt.x - this.width;
        this.y = pt.y;
    }

    setRightTop(pt: Point): this {
        this.rightTop = pt;
        return this;
    }

    get rightBottom(): Point {
        return new Point(this.x + this.width, this.y + this.height);
    }

    set rightBottom(pt: Point) {
        this.x = pt.x - this.width;
        this.y = pt.y - this.height;
    }

    setRightBottom(pt: Point): this {
        this.rightBottom = pt;
        return this;
    }

    get topCenter(): Point {
        return new Point(this.x + this.width * 0.5, this.y);
    }

    set topCenter(pt: Point) {
        this.x = pt.x - this.width * 0.5;
        this.y = pt.y;
    }

    setTopCenter(pt: Point): this {
        this.topCenter = pt;
        return this;
    }

    get bottomCenter(): Point {
        return new Point(this.x + this.width * 0.5, this.y + this.height);
    }

    set bottomCenter(pt: Point) {
        this.x = pt.x - this.width * 0.5;
        this.y = pt.y - this.height;
    }

    setBottomCenter(pt: Point): this {
        this.bottomCenter = pt;
        return this;
    }

    get leftCenter(): Point {
        return new Point(this.x, this.y + this.height * 0.5);
    }

    set leftCenter(pt: Point) {
        this.x = pt.x;
        this.y = pt.y - this.height * 0.5;
    }

    setLeftCenter(pt: Point): this {
        this.leftCenter = pt;
        return this;
    }

    get rightCenter(): Point {
        return new Point(this.x + this.width, this.y + this.height * 0.5);
    }

    set rightCenter(pt: Point) {
        this.x = pt.x - this.width;
        this.y = pt.y - this.height * 0.5;
    }

    setRightCenter(pt: Point): this {
        this.rightCenter = pt;
        return this;
    }

    toString(): string {
        return this.x + "," + this.y + "," + this.width + "," + this.height;
    }

    // 近似填充时采用的阈值
    private _nearest: number;
    get nearest(): number {
        return this._nearest == null ? 0.1 : this._nearest;
    }

    /** 将当前的rc映射到目标rc中，默认会居中结果 */
    fill(to: Rect, mode: FillMode): this {
        let self = this;
        if (self.width == 0 || self.height == 0)
            return self;

        let needcenter = true;

        switch (mode & FillMode.MASK_MAJOR) {
            case FillMode.STRETCH: {
                self.copy(to);
            }
                break;
            case FillMode.MAPIN: {
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
            case FillMode.NEARESTSTRETCH: {
                // 先做 as，如果接近，则拉伸
                let rw = self.width / to.width;
                let rh = self.height / to.height;
                if (rw < rh) {
                    self.width /= rh;
                    self.height = to.height;
                } else {
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
            case FillMode.ASPECTSTRETCH: {
                let rw = self.width / to.width;
                let rh = self.height / to.height;
                if (rw < rh) {
                    self.width /= rh;
                    self.height = to.height;
                } else {
                    self.height /= rw;
                    self.width = to.width;
                }
            }
                break;
            case FillMode.ASPECTFILL: {
                let rw = self.width / to.width;
                let rh = self.height / to.height;
                if (rw < rh) {
                    self.height /= rw;
                    self.width = to.width;
                } else {
                    self.width /= rh;
                    self.height = to.height;
                }
            }
                break;
        }

        if (Mask.isset(FillMode.NOBORDER, mode)) {
            let r1 = to.width / to.height;
            if (self.width / to.width < self.height / to.height) {
                self.width = self.height * r1;
            } else {
                self.height = self.width / r1;
            }
        }

        if (Mask.isset(FillMode.NEAREST, mode)) {
            let rw = self.width / to.width;
            let rh = self.height / to.height;
            if (Math.abs(rw - rh) < self.nearest) {
                if (rw < rh) {
                    self.width /= rw;
                } else {
                    self.height /= rh;
                }
            }
        }

        if (needcenter)
            self.center = to.center;
        return self;
    }

    // 转换到笛卡尔坐标系
    applyCartesian(tfm: Rect): this {
        let self = this;
        self.y = tfm.height - self.y - self.height - tfm.y;
        self.x += tfm.x;
        return self;
    }

    unapplyCartesian(tfm: Rect): this {
        let self = this;
        self.y = tfm.height - self.y - tfm.y;
        self.x -= tfm.x;
        return self;
    }
}

export class UnionRect extends Rect {
    constructor(x?: number, y?: number, w?: number, h?: number) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    union(r: Rect): this {
        let self = this;
        if (self.x == null || self.y == null || self.width == null || self.height == null) {
            self.x = r.x;
            self.y = r.y;
            self.width = r.width;
            self.height = r.height;
            return self;
        }
        return <any>super.union(r);
    }
}

export abstract class Layout {
    constructor(ctx?: any) {
        this._ctx = ctx;
    }

    // 是否使用 anchor，默认为 false
    anchor: boolean;

    useAnchor(b: boolean): this {
        this.anchor = b;
        return this;
    }

    protected _ctx: any;
    protected _rc: Rect;
    protected _orc: Rect;
    protected _offset: number;

    /** 把 layout 放到某一个具有 bounds 函数的对象中， apply 时的 rect 会变成 bounds */
    view: any;

    /** 设置整体大小 */
    setRect(rc: Rect): this {
        if (this._orc == null) {
            this._orc = rc;
        } else {
            this._orc.x = rc.x;
            this._orc.y = rc.y;
            this._orc.width = rc.width;
            this._orc.height = rc.height;
        }
        this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
        return this;
    }

    /** 获得整体大小 */
    get frame(): Rect {
        this._avaRect();
        return this._orc.clone();
    }

    set frame(rc: Rect) {
        this.setRect(rc);
    }

    // 初始化 rect
    protected _avaRect(): boolean {
        if (this._orc)
            return false;

        if (this._ctx) {
            this._orc = this._ctx.boundsForLayout();
        } else {
            this._orc = new Rect();
            console.warn("没有设置 Box 的 Rect");
        }
        this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
        return true;
    }

    frameForLayout(): Rect {
        this._avaRect();
        return this._rc.clone();
    }

    edgeInsets: EdgeInsets;

    /** 设置布局的边距 */
    padding(ei: EdgeInsets): this {
        this.edgeInsets = ei;
        if (this._avaRect() == false)
            this._rc = this._orc.clone().applyEdgeInsets(this.edgeInsets);
        return this;
    }

    /** 偏移 */
    offset(pt: Point): this {
        this._avaRect();
        this._orc.offset(pt);
        this._rc.offset(pt);
        return this;
    }

    /** 应用布局 */
    apply() {
        // 确保 rect 不是 null
        this._avaRect();
        this._offset = 0;

        // 如果有依赖的 view，则之后的布局均按照在 view 内部布局来处理
        if (this.view) {
            this.view.setFrame(this._rc);
            this.setRect(this.view.boundsForLayout());
        }

        // 不能在此处理结束，由子类负责
    }

    /** 布局结束的回调 */
    protected _cbcomplete: (lyt: Layout) => void;
    protected _ctxcomplete: any;

    complete(cb: (lyt: Layout) => void, ctx?: any) {
        this._cbcomplete = cb;
        this._ctxcomplete = ctx;
    }

    /** 清空布局 */
    abstract clear();
}

export type layoutcb_t = ((obj: any, rc: Rect) => void) | ((obj: any, rc: Rect, data: any) => void);
export type hboxcb_t = ((box: HBox) => void) | ((box: HBox, data: any) => void);
export type vboxcb_t = ((box: VBox) => void) | ((box: VBox, data: any) => void);

export class LinearSegment {
    val: number;
    isp: boolean;
    obj: any;
    anchor: boolean;

    cb: layoutcb_t;
    ctx: any;
    data: any;

    dispose() {
        this.obj = undefined;
        this.cb = undefined;
        this.ctx = undefined;
        this.data = undefined;
    }

    setRect(x: number, y: number, w: number, h: number) {
        if (this.cb) {
            this.cb.call(this.ctx, this.obj, new Rect(x, y, w, h), this.data);
        } else if (this.obj) {
            this.obj.setFrame(new Rect(x, y, w, h), this.anchor);
        }
    }
}

export abstract class LinearLayout extends Layout {
    /** 获得总长 */
    abstract length(): number;

    /** 获得对边长 */
    abstract against(): number;

    /** 设置每段的长度
     @note 长度、段、第几份，返回具体设置了多长，可以通过修改return来做到附加偏移
     */
    protected abstract setSegmentLength(len: number, seg: LinearSegment, idx: number): number;

    protected _segments = new Array<LinearSegment>();

    /** 间距 */
    spacing: number = 0;

    setSpacing(v: number): this {
        this.spacing = v;
        return this;
    }

    clear() {
        ArrayT.Clear(this._segments, (o: LinearSegment) => {
            o.dispose();
        });
    }

    /** 按照像素划分 */
    addPixel(pixel: number, obj?: any, cb?: layoutcb_t, ctx?: any, data?: any): this {
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
    }

    /** 按照定比来划分，总比例为各个 flex 之和，每一个 flex 的长度为 (总长 - 固定像素长) / 总 flex */
    addFlex(flex: number, obj?: any, cb?: layoutcb_t, ctx?: any, data?: any): this {
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
    }

    addPixelHBox(pixel: number, boxcb: hboxcb_t, ctx?: any, data?: any): this {
        this.addPixel(pixel, null, <any>function (obj: any, rc: Rect, data: any) {
            var box = new HBox(this).setRect(rc);
            boxcb.call(this, box, data);
            box.apply();
        }, ctx, data);
        return this;
    }

    addPixelVBox(pixel: number, boxcb: vboxcb_t, ctx?: any, data?: any): this {
        this.addPixel(pixel, null, <any>function (obj: any, rc: Rect, data: any) {
            var box = new VBox(this).setRect(rc);
            boxcb.call(this, box, data);
            box.apply();
        }, ctx, data);
        return this;
    }

    addFlexHBox(flex: number, boxcb: hboxcb_t, ctx?: any, data?: any): this {
        this.addFlex(flex, null, <any>function (obj: any, rc: Rect, data: any) {
            var box = new HBox(this).setRect(rc);
            boxcb.call(this, box, data);
            box.apply();
        }, ctx, data);
        return this;
    }

    addFlexVBox(flex: number, boxcb: vboxcb_t, ctx?: any, data?: any): this {
        this.addFlex(flex, null, <any>function (obj: any, rc: Rect, data: any) {
            var box = new VBox(this).setRect(rc);
            boxcb.call(this, box, data);
            box.apply();
        }, ctx, data);
        return this;
    }

    addAspect(w: number, h: number, obj?: any, cb?: layoutcb_t, ctx?: any, data?: any): this {
        return this.addPixel(w / h * this.against(), obj, cb, ctx, data);
    }

    addAspectHBox(w: number, h: number, boxcb: hboxcb_t, ctx?: any, data?: any): this {
        return this.addPixelHBox(w / h * this.against(), boxcb, ctx, data);
    }

    addAspectVBox(w: number, h: number, boxcb: vboxcb_t, ctx?: any, data?: any): this {
        return this.addPixelVBox(w / h * this.against(), boxcb, ctx, data);
    }

    apply() {
        super.apply();

        // 计算所有的定长度，扣除后，计算所有的占比和单份占比
        var sumpixel = 0, sumflex = 0;
        this._segments.forEach((seg) => {
            if (seg.isp)
                sumpixel += seg.val;
            else
                sumflex += seg.val;
        }, this);
        var lftlen = this.length() - sumpixel;
        var seglen = sumflex ? lftlen / sumflex : 0;
        // 应用长度
        this._segments.forEach((seg: LinearSegment, idx: number) => {
            var val = 0;
            if (seg.isp)
                val = seg.val;
            else
                val = seg.val * seglen;
            this._offset += this.setSegmentLength(val, seg, idx);
        }, this);

        // 处理结束
        if (this._cbcomplete)
            this._cbcomplete.call(this._ctxcomplete ? this._ctxcomplete : this._ctx);

        // 清空
        this.clear();
    }

    // 获得间距占的长度
    protected _spacingsLength(): number {
        let self = this;
        if (self.spacing == 0)
            return 0;
        let cnt = self._segments.length;
        if (cnt > 1)
            return self.spacing * (cnt - 1);
        return 0;
    }

    // 一些工具函数

    // 按照比例来从中间拿出固定大小
    clipPixel(pix: number, obj: any, lflex = 1, rflex = 1,
              cb?: layoutcb_t, ctx?: any, data?: any): this {
        if (lflex != 0)
            this.addFlex(lflex);
        this.addPixel(pix, obj, cb, ctx, data);
        if (rflex != 0)
            this.addFlex(rflex);
        return this;
    }

    clipFlex(flex: number, obj: any, lpix: number, rpix: number,
             cb?: layoutcb_t, ctx?: any, data?: any): this {
        if (lpix != 0)
            this.addPixel(lpix)
        this.addFlex(flex, obj, cb, ctx, data);
        if (rpix != 0)
            this.addPixel(rpix);
        return this;
    }

    clipPixelHBox(pix: number, boxcb: hboxcb_t, lflex = 1, rflex = 1,
                  ctx?: any, data?: any): this {
        if (lflex != 0)
            this.addFlex(lflex);
        this.addPixelHBox(pix, boxcb, ctx, data);
        if (rflex != 0)
            this.addFlex(rflex);
        return this;
    }

    clipFlexHBox(flex: number, boxcb: hboxcb_t, lpix: number, rpix: number,
                 ctx?: any, data?: any): this {
        if (lpix != 0)
            this.addPixel(lpix);
        this.addFlexHBox(flex, boxcb, ctx, data);
        if (rpix != 0)
            this.addPixel(rpix);
        return this;
    }

    clipPixelVBox(pix: number, boxcb: vboxcb_t, lflex = 1, rflex = 1,
                  ctx?: any, data?: any): this {
        if (lflex != 0)
            this.addFlex(lflex);
        this.addPixelVBox(pix, boxcb, ctx, data);
        if (rflex != 0)
            this.addFlex(rflex);
        return this;
    }

    clipFlexVBox(flex: number, boxcb: vboxcb_t, lpix: number, rpix: number,
                 ctx?: any, data?: any): this {
        if (lpix != 0)
            this.addPixel(lpix);
        this.addFlexVBox(flex, boxcb, ctx, data);
        if (rpix != 0)
            this.addPixel(rpix);
        return this;
    }
}

export class HBox
    extends LinearLayout {
    constructor(ctx?: any) {
        super(ctx);
    }

    length(): number {
        return this._rc.width - this._spacingsLength();
    }

    against(): number {
        this._avaRect();
        return this._rc.height;
    }

    protected setSegmentLength(len: number, seg: LinearSegment, idx: number): number {
        let self = this;
        seg.setRect(self._offset + self._rc.x, self._rc.y,
            len, self._rc.height);
        if (self.spacing && (idx + 1) < self._segments.length)
            len += self.spacing;
        return len;
    }
}

export class VBox extends LinearLayout {
    constructor(ctx?: any) {
        super(ctx);
    }

    length(): number {
        return this._rc.height - this._spacingsLength();
    }

    against(): number {
        this._avaRect();
        return this._rc.width;
    }

    protected setSegmentLength(len: number, seg: LinearSegment, idx: number): number {
        var self = this;
        seg.setRect(self._rc.x, self._offset + self._rc.y,
            self._rc.width, len);
        if (self.spacing && (idx + 1) < self._segments.length)
            len += self.spacing;
        return len;
    }
}

export type layoutflowcb_t = (obj: any, rc: Rect, data?: any) => void;

export enum FlowOption {
    Fix = 0,
    Stretch = 1,
};

export class FlowSegment {

    w: number;
    h: number;
    obj: any;
    anchor: boolean;
    option: FlowOption;

    cb: layoutflowcb_t;
    ctx: any;
    data: any;

    dispose() {
        this.obj = undefined;
        this.cb = undefined;
        this.ctx = undefined;
        this.data = undefined;
    }

    setRect(x: number, y: number, w: number) {
        if (this.cb) {
            this.cb.call(this.ctx, this.obj, new Rect(x, y, w, this.h), this.data);
        } else if (this.obj) {
            this.obj.setFrame(new Rect(x, y, w, this.h), this.anchor);
        }
    }
}

export class HFlow extends Layout {
    constructor(ctx?: any) {
        super(ctx);
    }

    clear() {
        ArrayT.Clear(this._segments, (o: FlowSegment) => {
            o.dispose();
        });
    }

    protected _segments = new Array<FlowSegment>();

    addSize(w: number, h: number, option: FlowOption = 0,
            obj?: any, cb?: layoutflowcb_t, ctx?: any, data?: any): HFlow {
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
    }

    position: Point;

    apply() {
        super.apply();
        this._avaRect();

        this.position = this._rc.leftTop;
        var w = this._rc.width;
        var h = this._rc.height;

        // 按照行划分格子
        var sw = 0, sh = 0;
        var rows = new Array<FlowSegment>();
        this._segments.forEach((seg) => {
            if (sw + seg.w <= w) {
                sw += seg.w;
                if (sh < seg.h)
                    sh = seg.h;
                rows.push(seg);
            } else {
                // 超出了当前行的宽度，需要换行并应用掉
                this.applyRows(rows, this.position, w);
                ArrayT.Clear(rows);

                // 开始下一行
                this.position.y += sh;
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
    }

    protected applyRows(rows: Array<FlowSegment>, pos: Point, w: number) {
        this._offset = 0;

        // 和 linear 的 flex 算法类似
        var flex = 0, pix = 0;
        rows.forEach((seg) => {
            if (seg.option == FlowOption.Stretch)
                flex += 1;
            pix += seg.w;
        }, this);

        // 计算可以拉伸的控件需要拉大多少
        flex = flex ? ((w - pix) / flex) : 0;
        // 布局
        rows.forEach((seg) => {
            var w = seg.w;
            if (seg.option == FlowOption.Stretch)
                w += flex;
            seg.setRect(this._offset + pos.x, pos.y,
                w);
            this._offset += w;
        });
    }
}
