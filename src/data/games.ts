export interface GameEntry {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  playUrl: string;
}

export const games: GameEntry[] = [
  {
    id: 'snake',
    name: '贪吃蛇',
    description: '经典贪吃蛇游戏。用方向键控制蛇的方向，吃到食物变长，碰到墙壁或自己则游戏结束。',
    coverUrl: '',
    playUrl: '/game/snake',
  },
  {
    id: 'minesweeper',
    name: '扫雷',
    description: '经典扫雷游戏。左键翻开格子，右键标记地雷，找出所有地雷即可获胜。支持双键齐按快速翻开。',
    coverUrl: '',
    playUrl: '/game/minesweeper',
  },
  {
    id: 'schulte',
    name: '舒尔特方格',
    description: '注意力训练经典工具。按顺序依次点击数字，越快越好。提供 3×3、5×5、8×8 三种难度。',
    coverUrl: '',
    playUrl: '/game/schulte',
  },
  {
    id: 'runner',
    name: '跑酷',
    description: '三条跑道跑酷游戏。跳跃或蹲下躲避障碍物，收集金币，速度越来越快。支持键盘和触屏操作。',
    coverUrl: '',
    playUrl: '/game/runner',
  },
];
