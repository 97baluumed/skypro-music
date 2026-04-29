import { render, screen, fireEvent } from '@testing-library/react';
import Search from './Search';

describe('Search Component', () => {
    const mockOnSearchChange = jest.fn();

    beforeEach(() => {
        mockOnSearchChange.mockClear();
    });

    test('рендерит компонент поиска', () => {
        render(<Search />);
        
        const searchInput = screen.getByPlaceholderText('Поиск');
        expect(searchInput).toBeInTheDocument();
        
        // Ищем SVG по классу, так как role="img" не работает с SVG
        const searchIcon = screen.getByTestId('search-icon');
        expect(searchIcon).toBeInTheDocument();
    });

    test('вызывает onSearchChange при изменении значения', () => {
        render(<Search onSearchChange={mockOnSearchChange} />);
        
        const searchInput = screen.getByPlaceholderText('Поиск');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
        expect(mockOnSearchChange).toHaveBeenCalledWith('test');
    });

    test('обновляет состояние при вводе', () => {
        render(<Search />);
        
        const searchInput = screen.getByPlaceholderText('Поиск');
        fireEvent.change(searchInput, { target: { value: 'hello' } });
        
        expect(searchInput).toHaveValue('hello');
    });

    test('не вызывает onSearchChange если колбэк не передан', () => {
        render(<Search />);
        
        const searchInput = screen.getByPlaceholderText('Поиск');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        
        expect(mockOnSearchChange).not.toHaveBeenCalled();
    });
});