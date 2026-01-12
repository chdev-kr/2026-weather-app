import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface Favorite {
  id: string;
  name: string; // 사용자가 지정한 별칭
  address: string; // 실제 주소
  latitude: number;
  longitude: number;
}

interface FavoritesState {
  favorites: Favorite[];
  addFavorite: (favorite: Omit<Favorite, 'id'>) => boolean;
  removeFavorite: (id: string) => void;
  updateFavoriteName: (id: string, name: string) => void;
  isFavorite: (address: string) => boolean;
  getFavoriteByAddress: (address: string) => Favorite | undefined;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (favorite) => {
        const { favorites } = get();

        // 최대 6개 제한
        if (favorites.length >= 6) {
          toast.warning('즐겨찾기는 최대 6개까지 추가할 수 있습니다.');
          return false;
        }

        // 중복 체크
        const isDuplicate = favorites.some(
          (fav) => fav.address === favorite.address
        );

        if (isDuplicate) {
          toast.warning('이미 즐겨찾기에 추가된 장소입니다.');
          return false;
        }

        const newFavorite: Favorite = {
          ...favorite,
          id: crypto.randomUUID(),
        };

        set({ favorites: [...favorites, newFavorite] });
        return true;
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },

      updateFavoriteName: (id, name) => {
        set((state) => ({
          favorites: state.favorites.map((fav) =>
            fav.id === id ? { ...fav, name } : fav
          ),
        }));
      },

      isFavorite: (address) => {
        return get().favorites.some((fav) => fav.address === address);
      },

      getFavoriteByAddress: (address) => {
        return get().favorites.find((fav) => fav.address === address);
      },
    }),
    {
      name: 'favorites-storage', // LocalStorage 키
    }
  )
);
