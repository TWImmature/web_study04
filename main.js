// 获取画布元素并设置其宽高为浏览器窗口的宽高
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成指定范围内的随机数
function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// 生成随机颜色
function randomColor() {
  return "rgb(" + random(0, 255) + ", " + random(0, 255) + ", " + random(0, 255) + ")";
}

// 球对象构造函数
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// 球对象的绘制方法
Ball.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI); // 绘制圆形
  ctx.fill();
};

// 球对象的更新方法，用于移动球的位置
Ball.prototype.update = function () {
  // 检测球是否碰到画布边缘，并反转速度方向
  if (this.x + this.size >= width || this.x - this.size <= 0) {
    this.velX = -this.velX;
  }
  if (this.y + this.size >= height || this.y - this.size <= 0) {
    this.velY = -this.velY;
  }

  // 更新球的位置
  this.x += this.velX;
  this.y += this.velY;
};

// 球对象的碰撞检测方法
Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (this !== balls[j]) {
      // 计算两球之间的距离
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 如果两球距离小于两球半径之和，则发生碰撞，改变颜色
      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = randomColor();
      }
    }
  }
};

// 初始化球数组
let balls = [];

// 创建25个球并添加到数组中
while (balls.length < 25) {
  let size = random(10, 20);
  let ball = new Ball(
      random(0 + size, width - size),  // 确保球不会超出画布边缘
      random(0 + size, height - size),
      random(-7, 7),
      random(-7, 7),
      randomColor(),
      size
  );
  balls.push(ball);
}

// 主循环函数，用于不断更新和绘制球
function loop() {
  // 使用半透明的黑色矩形覆盖整个画布，创建拖尾效果
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // 遍历所有球，绘制、更新和检测碰撞
  for (let i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].collisionDetect();
  }

  // 使用requestAnimationFrame来优化动画循环
  requestAnimationFrame(loop);
}

// 开始动画循环
loop();
