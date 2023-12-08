function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;} // set this to true to enable Chris Gannon's timeline scrubber...
useChrisGannonsScrubber = false;

gsap.registerPlugin(MotionPathPlugin);

class PackedParticles
{

  constructor(element, width, height, count = 100) {
    _defineProperty(this, "particleImages", [{ name: 'particle_dot', url: './circle.png' }, { name: 'particle_hex', url: './hexagon.png' }, 
                                             { name: 'particle_ring', url: './ringData.png' }, { name: 'particle_hex_ring', url: './hexData.png' }, 
                                             { name: 'particle_star', url: './star.png' }]);
    _defineProperty(this, "shapeImages", [{ name: 'shape_G', url: './Group%20139.png' }, { name: 'shape_S', url: './Group%20140.png' }, 
                                          { name: 'shape_A', url: './Group%20141.png' }, { name: 'shape_P', url: './Group%20142.png' }, { name: 'shape_3', url: './Group%20143.png' }]);

    this.colors = {
      background: Utils.hexToNumber(Utils.getVar('--background')) };

    this.app = new PIXI.Application({
      width: width,
      height: height,
      antialias: false,
      backgroundColor: this.colors.background,
      resolution: window.devicePixelRatio || 1 });

    this.width = width;
    this.height = height;
    this.count = count;
    this.shapes = [];
    this.particles = [];
    this.loader = PIXI.Loader.shared;
    this.html = element;
    this.timeline = new gsap.timeline({ repeat: -1 });
    this.scale = 0.5;
    if (useChrisGannonsScrubber) ScrubGSAPTimeline(this.timeline);
    this.resources = null;
    this.loadImages();
  }

  setResources(resources)
  {
    this.resources = resources;
    console.log(this.resources);
    this.createApp();
  }

  loadImages()
  {
    [...new Set(this.particleImages), ...new Set(this.shapeImages)].forEach(item => this.loader.add(item.name, item.url));
    this.loader.load((loader, loaded) => this.setResources(loaded));
  }

  createApp()
  {
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);

    let background = new PIXI.Graphics();
    background.drawRect(0, 0, this.width, this.height);
    background.endFill();
    background.alpha = 0;
    this.container.addChild(background);

    this.container.filters = [
    new PIXI.filters.AdvancedBloomFilter(0.4)];

    this.prepareShapeTemplates();
  }

  prepareShapeTemplates()
  {
    this.shapes = this.shapeImages.map((shape) =>
    {
      const texture = this.resources[shape.name].texture;
      const shapeTemplate = new Shape(new PIXI.Sprite(texture), this.app.renderer.plugins.extract, 0.02, 0.03);
      shapeTemplate.pack(this.count);
      return shapeTemplate;
    });

    this.addParticles();
  }

  addParticles()
  {
    if (this.shapes.length > 0)
    {
      for (let i = 0; i < this.count; i++)
      {
        let particleShape = this.particleImages[Math.floor(Math.random() * this.particleImages.length)];
        let sprite = new PIXI.Sprite(this.resources[particleShape.name].texture);

        sprite.x = this.width / 4 + Math.random() * (this.width / 2);
        sprite.y = this.height / 4 + Math.random() * (this.height / 2);
        sprite.scale.set(0);
        sprite.anchor.set(0.5);
        sprite.i = i;
        sprite.rotateSpeed = 0.1 + Math.random() * 0.3;
        this.container.addChild(sprite);
        this.particles.push(sprite);
        this.startTwinkle(sprite);
      }

      this.setupAnimation();
      this.tick();
    }
  }

  tick()
  {
    this.particles.map(p => p.angle += p.rotateSpeed);
    requestAnimationFrame(() => this.tick());
  }

  startTwinkle(particle)
  {
    gsap.to(particle, {
      duration: Math.random(),
      alpha: 0.25 + Math.random() * 0.75,
      onComplete: () => this.startTwinkle(particle) });

  }

  addToTimeline(particle, shape, offset, count)
  {
    const c = shape && shape.circles ? shape.circles[particle.i] : null;
    const x = c ? offset.x + c.x * (this.width * this.scale) : Math.random() * this.width;
    const y = c ? offset.y + c.y * (this.width * this.scale) : Math.random() * this.height;
    const grad = c ? (c.x + c.y) * 0.3 : 0;
    const angle = Math.random() * 90 - 45;
    const scale = c ? c.radius * (this.width / shape.width * 15 * this.scale) : 0;
    const time = grad + 0.8;
    const delay = grad;
    const opacity = 1;

    this.timeline.to(particle.position, {
      duration: time,
      delay: delay,
      motionPath: {
        path: shape ? [
        { x: this.width / 5 + Math.random() * (this.width * grad),
          y: this.width / 5 + Math.random() * (this.height * grad) },

        { x: this.width / 2 + Math.random() * (this.width / 4) - 80,
          y: 80 + Math.random() * (this.height / 4) },

        { x: x,
          y: y }] :
        [{ x: x, y: y }],
        curviness: 2 },

      ease: 'power3.inOut' },
    count);

    this.timeline.to(particle.scale, {
      duration: time,
      delay: delay,
      x: scale,
      y: scale,
      ease: 'power3.inOut' },
    count);

    this.timeline.to(particle, {
      duration: time,
      delay: delay,
      tint: 0xff0000 + Math.random() * 0x9999,
      ease: 'power3.inOut' },
    count);
  }

  setupAnimation()
  {
    const offset = {
      x: (this.width - this.width * this.scale) * 0.5,
      y: (this.height - this.width * this.scale) * 0.5 };


    this.particles.map((p, i) =>
    {
      let count = 0;
      this.shapes.map((shape) =>
      {
        this.addToTimeline(p, shape, offset, count);
        count += 2;
      });
      this.addToTimeline(p, null, offset, count);
    });

    this.html.innerHTML = "";
    this.html.appendChild(this.app.view);
  }}


class Shape
{
  constructor(sprite, extractor, radius, radiusVariance)
  {
    this.circles = [];
    this.availablePoints = [];
    this.width = sprite.width;
    this.height = sprite.height;
    this.radius = radius;
    this.radiusVariance = radiusVariance;
    this.getAvailable(extractor.pixels(sprite));
  }

  getAvailable(points)
  {
    let x = 0;
    let y = 0;

    for (let i = 0; i < points.length; i += 4)
    {
      let pixel = points.slice(i, i + 4);
      let sum = pixel[0] + pixel[1] + points[2];
      if (sum > 0) this.availablePoints.push({ x: x / this.width * 1, y: y / this.height * 1 });
      x++;

      if (x >= this.width) {
        x = 0;
        y++;
      }
    }

    this.shuffleArray(this.availablePoints);
  }

  getDistance(x1, y1, x2, y2) {return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));}

  shuffleArray(array)
  {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  isOverlapping(newCircle, gap = 0)
  {
    for (let i = 0; i < this.circles.length; i++)
    {

      const existingCircle = this.circles[i];
      const distance = this.getDistance(newCircle.x, newCircle.y, existingCircle.x, existingCircle.y);
      const bothRadius = newCircle.radius + existingCircle.radius + gap;
      if (distance < bothRadius) return true;
    }

    return false;
  }

  pack(count)
  {
    this.circles = [];
    let attempts = 0;
    let p = 0;
    while (this.circles.length < count)
    {
      if (attempts > 100 || p >= this.availablePoints.length)
      {
        this.circles.push(null);
      } else

      {
        let point = this.availablePoints[p];
        let circle = new Circle(point.x, point.y, this.radius, this.radiusVariance);
        if (!this.isOverlapping(circle, 0.003))
        {

          if (circle) while (circle.isGrowing)
          {
            circle.grow();
            if (circle.isGrowing && this.isOverlapping(circle)) circle.isGrowing = false;
          }
          this.circles.push(circle);
          attempts = 0;
        } else

        {
          attempts++;
        }
      }
      p++;
    }

  }}


class Circle
{
  constructor(x, y, maxRadius = 0.02, maxRadiusVariance = 0.03)
  {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.growSpeed = 0.001;
    this.maxRadius = maxRadius + Math.random() * maxRadiusVariance;
    this.isGrowing = true;
  }

  grow()
  {
    if (this.isGrowing)
    {
      this.radius += this.growSpeed;
      if (this.radius >= this.maxRadius) this.isGrowing = false;
    }
  }}


class Utils
{








  static hexToNumber(hexString)
  {
    hexString = hexString.trim();
    while (hexString.charAt(0) === '#') hexString = hexString.substr(1);
    return Number('0x' + hexString);
  }}_defineProperty(Utils, "getVar", (name, node = document.documentElement) => {let str = getComputedStyle(node).getPropertyValue(name);let num = Number(str);if (isNaN(num)) return str;return num;});


const width = Utils.getVar('--width');
const height = Utils.getVar('--height');

let pp = new PackedParticles(document.getElementById('container'), width, height, 500);