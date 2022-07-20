type ModelType = {
  model_name: string;
}

type Category = {
  is_enabled: boolean;
  is_premium: boolean;
  id: number;
  name: string;
  readable_name: string;
  model_types: ModelType[];
};

export { Category };
