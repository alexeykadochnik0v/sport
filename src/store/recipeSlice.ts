import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loadState, saveState } from './localStorage';

export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  time: number;
}

// Начальные данные для рецептов
const initialRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Куриная грудка с овощами',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    ingredients: ['Куриная грудка - 400г', 'Брокколи - 200г', 'Морковь - 2шт', 'Оливковое масло - 2ст.л.', 'Соль и перец по вкусу', 'Чеснок - 2 зубчика'],
    instructions: [
      'Нарежьте куриную грудку на средние кусочки',
      'Нарежьте брокколи на соцветия, морковь - тонкими кружочками',
      'Разогрейте оливковое масло в сковороде на среднем огне',
      'Обжарьте курицу до золотистой корочки (7-8 минут)',
      'Добавьте измельченный чеснок и обжаривайте еще 1 минуту',
      'Добавьте овощи и готовьте еще 5-7 минут до желаемой мягкости',
      'Приправьте солью и перцем по вкусу'
    ],
    calories: 320,
    protein: 35,
    fat: 12,
    carbs: 15,
    time: 30
  },
  {
    id: '2',
    title: 'Греческий салат',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    ingredients: ['Огурцы - 2шт', 'Помидоры - 3шт', 'Сыр фета - 150г', 'Маслины - 100г', 'Красный лук - 1шт', 'Оливковое масло - 3ст.л.', 'Орегано - 1ч.л.'],
    instructions: [
      'Нарежьте огурцы и помидоры крупными кусочками',
      'Нарежьте красный лук тонкими полукольцами',
      'Нарежьте сыр фета кубиками',
      'Смешайте все ингредиенты в большой миске',
      'Добавьте маслины',
      'Полейте оливковым маслом',
      'Посыпьте орегано и слегка перемешайте'
    ],
    calories: 250,
    protein: 8,
    fat: 20,
    carbs: 10,
    time: 15
  },
  {
    id: '3',
    title: 'Овсяная каша с фруктами',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
    ingredients: ['Овсяные хлопья - 1 стакан', 'Банан - 1шт', 'Яблоко - 1шт', 'Мед - 2ст.л.', 'Корица - 1/2ч.л.', 'Молоко - 2 стакана'],
    instructions: [
      'Вскипятите молоко в кастрюле',
      'Добавьте овсяные хлопья и варите на медленном огне 5-7 минут, помешивая',
      'Нарежьте банан и яблоко',
      'Когда каша будет готова, добавьте фрукты',
      'Добавьте мед и корицу',
      'Перемешайте и дайте постоять 2-3 минуты'
    ],
    calories: 280,
    protein: 8,
    fat: 5,
    carbs: 55,
    time: 10
  },
  {
    id: '4',
    title: 'Запеченный лосось',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
    ingredients: ['Филе лосося - 400г', 'Лимон - 1шт', 'Розмарин - 2 веточки', 'Чеснок - 3 зубчика', 'Оливковое масло - 2ст.л.', 'Соль и перец по вкусу'],
    instructions: [
      'Разогрейте духовку до 200°C',
      'Выложите филе лосося на противень, застеленный пергаментом',
      'Измельчите чеснок и смешайте с оливковым маслом',
      'Смажьте рыбу чесночным маслом',
      'Выложите сверху веточки розмарина и ломтики лимона',
      'Посолите и поперчите',
      'Запекайте 15-20 минут до готовности'
    ],
    calories: 400,
    protein: 46,
    fat: 22,
    carbs: 0,
    time: 25
  },
  {
    id: '5',
    title: 'Смузи боул с ягодами',
    imageUrl: 'https://images.unsplash.com/photo-1628557044797-f21a177c37ec',
    ingredients: ['Замороженные ягоды - 200г', 'Банан - 1шт', 'Греческий йогурт - 200г', 'Мюсли - 50г', 'Мед - 1ст.л.', 'Миндаль - 20г'],
    instructions: [
      'Поместите замороженные ягоды, банан и йогурт в блендер',
      'Взбивайте до однородной консистенции',
      'Перелейте смузи в миску',
      'Посыпьте мюсли сверху',
      'Украсьте нарезанным миндалем',
      'Полейте медом'
    ],
    calories: 290,
    protein: 12,
    fat: 6,
    carbs: 52,
    time: 15
  },
  {
    id: '6',
    title: 'Киноа с овощами',
    imageUrl: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',
    ingredients: ['Киноа - 1 стакан', 'Помидоры черри - 200г', 'Огурец - 1шт', 'Авокадо - 1шт', 'Оливковое масло - 2ст.л.', 'Лимонный сок - 2ст.л.', 'Зелень по вкусу'],
    instructions: [
      'Промойте киноа и варите в подсоленной воде 15-20 минут',
      'Разрежьте помидоры черри пополам',
      'Нарежьте огурец и авокадо кубиками',
      'Когда киноа остынет, смешайте с овощами',
      'Сбрызните оливковым маслом и лимонным соком',
      'Добавьте нарезанную зелень',
      'Посолите и поперчите по вкусу'
    ],
    calories: 310,
    protein: 10,
    fat: 15,
    carbs: 40,
    time: 20
  }
];

interface RecipeState {
  recipes: Recipe[];
}

const savedState = loadState();
const initialState: RecipeState = {
  recipes: savedState?.recipes?.recipes || initialRecipes
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
      saveState({ recipes: state });
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(recipe => recipe.id === action.payload.id);
      if (index !== -1) {
        state.recipes[index] = action.payload;
        saveState({ recipes: state });
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(recipe => recipe.id !== action.payload);
      saveState({ recipes: state });
    },
    resetRecipes: (state) => {
      state.recipes = initialRecipes;
      localStorage.removeItem('sport_app_state');
    },
  },
});

export const { addRecipe, updateRecipe, deleteRecipe, resetRecipes } = recipeSlice.actions;

export default recipeSlice.reducer;
