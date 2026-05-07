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
    expect(screen.getByRole('button', { name: '简历' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '项目' })).toBeInTheDocument();
  });

  it('shows HomeSection by default', () => {
    renderMainPage();
    expect(screen.getByText('张三')).toBeInTheDocument();
  });

  it('switches to ResumeSection when clicking 简历 tab', async () => {
    renderMainPage();
    await userEvent.click(screen.getByRole('button', { name: '简历' }));
    expect(screen.getByText('教育经历')).toBeInTheDocument();
    expect(screen.getByText('工作经历')).toBeInTheDocument();
  });

  it('switches to ProjectsSection when clicking 项目 tab', async () => {
    renderMainPage();
    await userEvent.click(screen.getByRole('button', { name: '项目' }));
    expect(screen.getByText('个人博客系统')).toBeInTheDocument();
  });

  it('renders footer', () => {
    renderMainPage();
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});
