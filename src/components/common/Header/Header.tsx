import React from 'react';
import styles from './Header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.logo}>
          <h1>Property Store</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#catalog">Каталог</a>
          <a href="#calculator">Подбор квартиры</a>
          <a href="#contacts">Контакты</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;