import React from 'react';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p>&copy; 2024 Property Store. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;