type CategoryName = 'FAMILY' |
  'PETS' |
  'SOCIAL_INTERESTS' |
  'EDUCATION_CAREER' |
  'TRAVEL' |
  'HEALTH_BEAUTY' |
  'HOME_GARDEN' |
  'FINANCE' |
  'TRANSPORT'

type Category = {
  is_enabled: boolean;
  is_premium: boolean;
  id: number;
  name: CategoryName;
  readable_name: string;
};

export { CategoryName, Category };
