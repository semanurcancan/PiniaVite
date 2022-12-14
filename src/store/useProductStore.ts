import { defineStore } from "pinia";
import axios from "axios";
//  import type ProductModels from "../models/entities/ProductModels.ts"
import { Product } from "../models/entities/ProductModels";
import { statusTypeEnum } from "../models/enums/statusTypeEnum";
import { FavoriteObjectType } from "../models/entities/Icontype";

const loadFromStorage = (key: string, defaultValue: any): any => {
  const item = localStorage.getItem(key);
  if (item) {
    return JSON.parse(item);
  }
  return defaultValue;
};

export const useProductStore = defineStore("product", {
  //burada içi boş verisi olamayan  ama type tanımlanan product var bunu için product model belirledim.api den gelecke olan verilerin type ı bu model içeriisnde belirlendi.
  state: () => {
    return {
      totalPrice: 0,
      product: [] as Array<Product>,
      basket: [] as Array<Product>,
      basketLength: 0,
      filterCategory: [] as Array<Product>,
      favorites:loadFromStorage(
        "userFavorites", [] as Array<Product>),
      loading: false,
    };
  },

  //actions da içerisine api verileri atanan product ı getters da bir func atadım.computed da cagırdım.
  getters: {
    getProductGetters: (state) => {
      return state.product;
    },
    getBasketGetters: (state) => {
      return state.basket;
    },
    GetBasketPrice: (state) => {
      return state.totalPrice.toFixed(2);
    },
    getBasketLength: (state) => {
      return state.basketLength;
    },
    getFilterCategory: (state) => {
      return state.filterCategory;
    },
    getFavoritesState(state) {
      return state.favorites;
    },
  },
  //actions da api verilerini cektim.state de içi boş ve type ı tanımlanan product a attım içerisindeki bilgileri api den gelen.methods da cagırıdm!!!
  actions: {
    //data apı aul ile cekildi!!!
    async getProductAction() {
      await axios
        .get("https://api.escuelajs.co/api/v1/products?offset=0&limit=70")
        .then((product) => {
          this.product = product.data;
          //quantity entrübütü yoktu gelen data da ekledim.
          this.product.forEach((x: any) => {
            x.quantity = 0;
          });
        });
    },
    setfilter(catName: string) {
      this.filterCategory = this.getProductGetters.filter(
        (x) => x.category.name == catName
      );
      console.log("actions girdi");
    },
    //set addl ile actıons component içine cagırıldığında parametle oalrak "pro" alacak.
    setAddBasket(pro: Product) {
      this.basket = [...this.basket, pro];
      this.totalPrice += pro.price;
      pro.quantity++;
    },
    //silme func.eğert yollanan ürün id si ile sepetteki ürünün id si eşleşiyor ise siliyor.
    //toplam paradan silinen ürünün parasını cıkartıyor.ve ürün miktarını bir azaltıyor.
    setDltBasket(pro: Product) {
      let equalId = this.basket.find((x) => x.id == pro.id);
      if (equalId) {
        this.basket.pop(pro);
        this.totalPrice -= pro.price;
        pro.quantity--;
      } else {
        return this.totalPrice;
      }
    },

    addOrRemoveFavorite(pro: Product) {
      const findedIndex = this.favorites.findIndex(
        (fav: any) => fav.id === pro.id
      );
      if (findedIndex === -1) {
        this.favorites = [...this.favorites, pro];
      } else {
        this.favorites = this.favorites.filter((fav: any) => fav.id !== pro.id);
      }
      localStorage.setItem("userFavorites", JSON.stringify(this.favorites));
    },
    setLoadingState(state: boolean) {
      this.loading = state;
    },
  },
});
