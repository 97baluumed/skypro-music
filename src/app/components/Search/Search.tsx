'use client'

import { useState } from 'react';
import styles from './search.module.css';

type SearchProps = {
    onSearchChange?: (value: string) => void;
}

export default function Search({ onSearchChange }: SearchProps) {
    const [searchInput, setSearchInput] = useState('')

    const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        if (onSearchChange) {
            onSearchChange(value);
        }
    }

    return (
        <div className={styles.centerblock__search}>
            <svg className={styles.search__svg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-search"></use>
            </svg>
            <input
                className={styles.search__text}
                type="search"
                placeholder="Поиск"
                name="search"
                value={searchInput}
                onChange={onSearchInput}
            />
        </div>
    )
}