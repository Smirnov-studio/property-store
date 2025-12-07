import React from 'react';
import { useComplexes } from '../../hooks/useComplexes';
import styles from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const { complexes, loading } = useComplexes();

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="container">
          <p>Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.homePage}>
      <header className={styles.header}>
        <div className="container">
          <h1>Property Store</h1>
          <nav>
            <a href="#catalog">Каталог ({complexes.length})</a>
            <a href="#calculator">Калькулятор</a>
          </nav>
        </div>
      </header>
      
      <main>
        <section className={styles.hero}>
          <div className="container">
            <h2>Найдите свою идеальную квартиру</h2>
            <p>Лучшие жилые комплексы от надежного застройщика</p>
          </div>
        </section>

        <section id="calculator" className={styles.section}>
          <div className="container">
            <h3>Калькулятор стоимости</h3>
            <p>Скоро здесь будет форма расчета</p>
          </div>
        </section>

        <section id="catalog" className={styles.section}>
          <div className="container">
            <h3>Каталог ЖК</h3>
            <div className={styles.complexesGrid}>
              {complexes.map(complex => (
                <div key={complex.id} className={styles.complexCard}>
                  <h4>{complex.name}</h4>
                  <p className={styles.location}>{complex.location}</p>
                  <p className={styles.price}>
                    от {complex.pricePerSquare.toLocaleString()} ₽/м²
                  </p>
                  <p className={styles.description}>{complex.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <p>&copy; 2024 Property Store</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;