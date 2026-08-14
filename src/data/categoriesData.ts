import rawCategories from '../../assets/categories.json';

export interface SubSubCategory {
  name: string;
}

export interface SubCategory {
  name: string;
  sub_subcategories: string[];
}

export interface CategoryTreeItem {
  id: number | string;
  name: string;
  icon?: string;
  subcategories: SubCategory[];
}

export const CATEGORY_TREE: CategoryTreeItem[] = (rawCategories as any[]).map((cat) => ({
  id: cat.id,
  name: cat.name,
  subcategories: Array.isArray(cat.subcategories)
    ? cat.subcategories.map((sub: any) => ({
        name: sub.name,
        sub_subcategories: Array.isArray(sub.sub_subcategories) ? sub.sub_subcategories : []
      }))
    : []
}));

export const MAIN_CATEGORY_NAMES = CATEGORY_TREE.map((c) => c.name);
