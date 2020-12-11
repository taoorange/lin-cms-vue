<template>
  <div class="dial">
    <div class="times">抽奖次数{{LuckyClick}}</div>
    <!-- 转盘包裹 -->
    <div class="rotate">
      <!-- 转盘图片 -->
      <img
        class="dish"
        src="../../assets/image/dial.png"
        :style="{transform:rotate_deg,transition:rotate_transition}"
      />
      <!-- 指针图片 -->
      <img class="pointer" src="../../assets/image/click.png" @click="start" />
    </div>
  </div>
</template>
 
<script>
let light_timer // 灯光定时器
let timer_delay // 转盘延迟期
 
export default {
  name: "dial",
  data() {
    return {
      LuckyClick: 3,
      circleList: [], //原点设置
      colorCircleFirst: "#FE4D32", //圆点颜色
      colorCircleSecond: "#fff", //圆点颜色
      cat: 45, //总共8个扇形区域，每个区域约45度
      isAllowClick: true, //是否能够点击
      rotate_deg: 0, //指针旋转的角度
      rotate_transition: "transform 3s ease-in-out" //初始化选中的过度属性控制
    };
  },
  components: {
    // Calendar: Calendar
  },
  created() {
    // this.showcircleList();
  },
  beforeRouterLeave() {
    clearInterval(light_timer)
    clearTimeout(timer_delay)
    console.log(timer_delay)
  },
  methods: {
    //绘制圆点设置
    showcircleList() {
      let circleList = [];
      for (var i = 0; i < 16; i++) {
        circleList.push(i);
      }
      this.circleList = circleList;
      this.light();
    },
    //闪动效果
    light: function() {
      var that = this;
      clearInterval(light_timer);
      light_timer = setInterval(function() {
        if (that.colorCircleFirst == "#FE4D32") {
          that.colorCircleFirst = "#fff";
          that.colorCircleSecond = "#FE4D32";
        } else {
          that.colorCircleFirst = "#FE4D32";
          that.colorCircleSecond = "#fff";
        }
      }, 300); //设置圆点闪烁的效果
    },
    start() {
      if (this.LuckyClick == 0) {
        alert("机会已经用完了");
        return;
      }
      this.rotating();
    },
    async rotating() {
      if (!this.isAllowClick) return
      this.isAllowClick = false
      this.rotate_transition = "transform 3s ease-in-out"
      this.LuckyClick--
      var rand_circle = 5 //默认多旋转5圈
      //   var winningIndex = Math.floor(Math.random() * 8); //获奖的下标   0-7   没有概率每个平均
      var winningIndex = await this.set() //设置了概率的
      var randomDeg = 360 - winningIndex * 45 //当前下标对应的角度    45是总共8个扇形区域，每个区域约45度
 
      var deg = rand_circle * 360 + randomDeg //将要旋转的度数  由于是顺时针的转动方向需要用360度来减
      this.rotate_deg = "rotate(" + deg + "deg)"
 
      var that = this
      timer_delay = setTimeout(function() {
        that.isAllowClick = true
        that.rotate_deg = "rotate(" + 0 + "deg)" // 定时器关闭的时候重置角度
        that.rotate_transition = ""
        if (winningIndex == 0) {
          alert("恭喜您，IphoneX")
        } else if (winningIndex == 1) {
          alert("恭喜您，获得10元现金")
        } else if (winningIndex == 2) {
          alert("很遗憾，重在参与")
        } else if (winningIndex == 3) {
          alert("恭喜您，获得30元现金")
        } else if (winningIndex == 4) {
          alert("恭喜您，获得20元现金")
        } else if (winningIndex == 5) {
          alert("恭喜您，获得50元现金")
        } else if (winningIndex == 6) {
          alert("恭喜您，获得5元现金")
        } else if (winningIndex == 7) {
          alert("恭喜您，获得100元现金")
        }
      }, 3500)
    },
    //设置概率
    set() {
      var winIndex;
    
      //方法2
      const __rand__ = Math.random();
      const f_rand = Number(__rand__.toFixed(2))
      if (f_rand < 0.3) winIndex = 2;
      else if (f_rand < 0.55) winIndex = 6;
      else if (f_rand < 0.75) winIndex = 1;
      else if (f_rand < 0.85) winIndex = 4;
      else if (f_rand < 0.92) winIndex = 3;
      else if (f_rand < 0.97) winIndex = 5;
      else if (f_rand < 0.99) winIndex = 7;
      else if (f_rand = 0.99) winIndex = 0;
      return winIndex;
    }
  },
}
</script>
 
 
<style  scoped lang="scss">
.times {
  text-align: center;
  line-height: 0.8rem;
  background: #fff;
}
.rotate {
  width: 300px;
  height:300px;
  background: #ffbe04;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
  .dish {
    width: 300px;
    height: 300px;
  }
}
.pointer {
  width: 70px;
  height: 100px;
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>