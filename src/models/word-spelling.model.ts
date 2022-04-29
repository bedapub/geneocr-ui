
export interface SpellCheckItem {
  suggestions: string[];
  initial_word: string;
  gene_exists: boolean;
  best_canditate: string;
}

export interface SpellCheckItemView extends SpellCheckItem {
    final_word: string;
}
