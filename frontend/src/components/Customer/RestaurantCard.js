import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiClock, FiTruck } from 'react-icons/fi';
import styles from './RestaurantCard.module.css';

export default function RestaurantCard({ restaurant }) {
  const { _id, name, image, cuisineTypes, rating, deliveryInfo, isFeatured, tags } = restaurant;

  return (
    <Link to={`/restaurants/${_id}`} className={`${styles.card} card card-hover`}>
      <div className={styles.imageWrap}>
        <img
          src={image || `https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400`}
          alt={name}
          className={styles.image}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'; }}
        />
        {isFeatured && <span className={styles.featuredBadge}>⭐ Featured</span>}
        {tags?.[0] && <span className={styles.tag}>{tags[0]}</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.cuisine}>{cuisineTypes?.join(' · ')}</p>

        <div className={styles.meta}>
          <span className={styles.rating}>
            <FiStar size={13} fill="#F59E0B" stroke="#F59E0B" />
            {rating?.average?.toFixed(1)} ({rating?.count})
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.metaItem}>
            <FiClock size={13} /> {deliveryInfo?.estimatedTime}
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.metaItem}>
            <FiTruck size={13} />
            {deliveryInfo?.deliveryFee === 0 ? 'Free' : `$${deliveryInfo?.deliveryFee} delivery`}
          </span>
        </div>

        {deliveryInfo?.freeDeliveryAbove > 0 && (
          <p className={styles.freeDelivery}>
            Free delivery above ${deliveryInfo.freeDeliveryAbove}
          </p>
        )}
      </div>
    </Link>
  );
}
