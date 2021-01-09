import { FeaturedImageItem } from 'interfaces/FeaturedImageItem';

const data = { image: '/images/featured/featured1.jpg', imageText: 'Main featured image' };
// const data = { image: '/images/featured/featured2.jpeg', imageText: 'Main featured image' };

export const useFetchFeaturedImageItem = (): FeaturedImageItem => {
  return data;
};
