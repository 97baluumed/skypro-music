import { render, screen, fireEvent } from '@testing-library/react';
import ProgressBar from './ProgressBar';

describe('ProgressBar Component', () => {
    const mockOnChange = jest.fn();

    beforeEach(() => {
        mockOnChange.mockClear();
    });

    test('рендерит прогресс-бар с правильными атрибутами', () => {
        render(<ProgressBar max={100} value={50} onChange={mockOnChange} />);
        
        const progressBar = screen.getByRole('slider');
        expect(progressBar).toBeInTheDocument();
        expect(progressBar).toHaveAttribute('aria-valuenow', '50');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    test('отображает правильный процент заполнения', () => {
        const { container } = render(<ProgressBar max={200} value={100} onChange={mockOnChange} />);
        
        const fill = container.querySelector(`.${'progress__fill'}`);
        expect(fill).toHaveStyle('width: 50%');
    });

    test('вызывает onChange при клике на прогресс-бар', () => {
        render(<ProgressBar max={100} value={0} onChange={mockOnChange} />);
        
        const progressBar = screen.getByRole('slider');
        Object.defineProperty(progressBar, 'getBoundingClientRect', {
            writable: true,
            value: () => ({ width: 100, left: 0 })
        });
        
        fireEvent.click(progressBar, { clientX: 75, clientY: 0 });
        
        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalledWith(75);
    });

    test('обрабатывает клавиши стрелок для изменения значения', () => {
        render(<ProgressBar max={100} value={50} onChange={mockOnChange} />);
        
        const progressBar = screen.getByRole('slider');
        progressBar.focus();
        
        fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalledWith(55);
        
        fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
        expect(mockOnChange).toHaveBeenCalledWith(45);
    });

    test('ограничивает максимальное и минимальное значение', () => {
        render(<ProgressBar max={100} value={95} onChange={mockOnChange} />);
        
        const progressBar = screen.getByRole('slider');
        progressBar.focus();
        
        fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalledWith(100);
        
        fireEvent.keyDown(progressBar, { key: 'ArrowRight' });
        expect(mockOnChange).toHaveBeenCalledWith(100);
        
        fireEvent.keyDown(progressBar, { key: 'ArrowLeft' });
        expect(mockOnChange).toHaveBeenCalledWith(90);
    });
});