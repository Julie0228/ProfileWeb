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
    description: '经典扫雷游戏。左键翻开格子，右键标记地雷，找出所有地雷即可获胜。',
    coverUrl: '',
    playUrl: '/game/minesweeper',
  },
];
