import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import { MainPage } from '../pages/MainPage';

function renderMainPage() {
  return render(
    <DataProvider>
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    </DataProvider>
  );
}

describe('MainPage', () => {
  it('renders NavBar with tabs', () => {
    renderMainPage();
    expect(screen.getByRole('button', { name: '首页' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '新闻' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '个人信息' })).toBeInTheDocument();
  });

  it('shows HomeSection by default', () => {
    renderMainPage();
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  it('switches to personal section when clicking 个人信息 tab', async () => {
    renderMainPage();
    await userEvent.click(screen.getByRole('button', { name: '个人信息' }));
    expect(screen.getByText('教育经历')).toBeInTheDocument();
    expect(screen.getByText('工作经历')).toBeInTheDocument();
    expect(screen.getByText('个人博客系统')).toBeInTheDocument();
  });

  it('switches to GamesSection when clicking 游戏 tab', async () => {
    renderMainPage();
    await userEvent.click(screen.getByRole('button', { name: '游戏' }));
    expect(screen.getByText('贪吃蛇')).toBeInTheDocument();
    expect(screen.getByText('扫雷')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderMainPage();
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});
