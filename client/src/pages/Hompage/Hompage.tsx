// client/src/pages/HomePage/HomePage.tsx
import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout/MainLayout';
import ProductCard from '../../components/ProductsGrid/ProductCard/ProductCard';
import styles from './HomePage.module.css';
import * as productServices from '../../services/productService';

type FetchedProduct = {
  id: string;
  title: string;
  price: string | number;
  stock: number;
  description: string;
  imageUrl?: string | null;
};

export default function HomePage() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [products, setProducts] = useState<FetchedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // hero slides (placeholder images)
  const heroSlides = [
    {
      id: 'h1',
      title: 'Big savings on electronics',
      subtitle: 'New arrivals — limited time',
      bg: '/images/placeholder.jpg',
    },
    {
      id: 'h2',
      title: 'Home & Living highlights',
      subtitle: 'Quality items for your home',
      bg: '/images/placeholder.jpg',
    },
    {
      id: 'h3',
      title: 'Trending fashion',
      subtitle: 'Fresh styles, great prices',
      bg: '/images/placeholder.jpg',
    },
  ];

  // derive slidesLen once so we can safely include it in deps
  const slidesLen = heroSlides.length;

  useEffect(() => {
    const t = setInterval(() => {
      setSlideIndex((s) => (s + 1) % slidesLen);
    }, 4000);
    return () => clearInterval(t);
  }, [slidesLen]); // include slidesLen so linter is happy

  // fetch 4 products from server (any page)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // fetch 4 items
        const { products: fetched } = await productServices.fetchProducts(1, 4);
        if (!mounted) return;
        setProducts(
          fetched.map((p) => ({
            id: p.id,
            title: p.title,
            // ensure price is number in UI
            price: typeof p.price === 'string' ? parseFloat(p.price) || 0 : (p.price as number),
            stock: p.stock ?? 0,
            description: p.description ?? '',
            imageUrl: p.imageUrl ?? null,
          }))
        );
      } catch (err) {
        console.error('Failed loading homepage products', err);
        if (!mounted) return;
        setError('Failed to load featured products');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // categories to show (we reuse the same 4 fetched products for each)
  const categories = ['Electronics', 'Home & Living', 'Clothing', 'Accessories'];

  // helper: ensure array length is at least n by repeating
  // replaced previous .map((_, i) => ...) pattern to avoid unused-param lint errors
  const ensureCount = <T,>(arr: T[], n: number): (T | null)[] => {
    if (arr.length === 0) return Array.from({ length: n }, () => null);
    if (arr.length >= n) return arr.slice(0, n);
    const res: (T | null)[] = [];
    let i = 0;
    while (res.length < n) {
      res.push(arr[i % arr.length]);
      i++;
    }
    return res;
  };

  // 4 products per row
  const rowProducts = ensureCount(products, 4);

  return (
    <MainLayout>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div
            className={styles.heroCard}
            style={{
              backgroundImage: `url(${heroSlides[slideIndex].bg})`,
            }}
            aria-live="polite"
          >
            <div className={styles.heroText}>
              <h2>{heroSlides[slideIndex].title}</h2>
              <p>{heroSlides[slideIndex].subtitle}</p>
            </div>

            <div className={styles.heroControls}>
              <button
                className={styles.pill}
                onClick={() => setSlideIndex((s) => (s - 1 + slidesLen) % slidesLen)}
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button className={styles.pill} onClick={() => setSlideIndex((s) => (s + 1) % slidesLen)} aria-label="Next slide">
                ›
              </button>
            </div>
          </div>
        </section>

        {loading && <div style={{ padding: 12 }}>Loading products...</div>}
        {error && <div style={{ padding: 12, color: 'crimson' }}>{error}</div>}

        {/* Category rows */}
        {categories.map((cat) => (
          <section key={cat} className={styles.categorySection}>
            <h3 className={styles.categoryTitle}>{cat}</h3>
            <div className={styles.row}>
              {rowProducts.map((p, idx) => {
                // p may be null when nothing returned; render placeholder card then
                if (!p) {
                  return (
                    <div key={`${cat}-placeholder-${idx}`} className={styles.cardWrapper}>
                      <ProductCard
                        id={`placeholder-${idx}`}
                        title={`Placeholder ${idx + 1}`}
                        price={0}
                        stock={0}
                        description="Placeholder product"
                        imageUrl={undefined}
                        isAdmin={false}
                      />
                    </div>
                  );
                }

                return (
                  <div key={`${cat}-${p.id}`} className={styles.cardWrapper}>
                    <ProductCard
                      id={p.id}
                      title={p.title}
                      price={Number(p.price)} // ensure number
                      stock={p.stock}
                      description={p.description}
                      imageUrl={p.imageUrl ?? undefined}
                      isAdmin={false}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </MainLayout>
  );
}
