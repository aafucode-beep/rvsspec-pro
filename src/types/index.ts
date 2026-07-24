// Product spec sheet types

export interface ProductSpec {
  id: string;
  name: string;
  brand: string;
  series: string;
  description: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  // Images stored as base64 data URLs
  logo: string | null;
  productImage: string | null;
  productDiagram: string | null;
  accessories: (string | null)[]; // up to 4
  curves: (string | null)[]; // up to 4
  // Parameters
  params: SpecParam[];
  // Footer
  footer: FooterData;
}

export interface SpecParam {
  id: string;
  label: string;
  value: string;
  unit: string;
  editable: boolean; // can rename the label
}

export interface FooterData {
  website: string;
  company: string;
  email: string;
  addressSh: string;
  addressSz: string;
  rights: string;
  version: string;
}

export type Locale = 'zh' | 'en';

// Default spec params template
export const DEFAULT_PARAMS: Omit<SpecParam, 'id'>[] = [
  { label: '开孔尺寸', value: '', unit: 'mm', editable: false },
  { label: '适用天花厚度', value: '', unit: 'mm', editable: false },
  { label: '功率', value: '', unit: 'W', editable: false },
  { label: '光通量', value: '', unit: 'lm', editable: false },
  { label: '光束角', value: '', unit: '°', editable: false },
  { label: '光斑风格', value: '', unit: '', editable: false },
  { label: '色温', value: '', unit: 'K', editable: false },
  { label: '显色指数Ra', value: '', unit: '', editable: false },
  { label: '色彩保真度Rf', value: '', unit: '', editable: false },
  { label: '色彩饱和度Rg', value: '', unit: '', editable: false },
  { label: '色容差SDCM', value: '', unit: '', editable: false },
  { label: '控制方式', value: '', unit: '', editable: false },
  { label: '外观颜色', value: '', unit: '', editable: false },
  { label: '反射器颜色', value: '', unit: '', editable: false },
  { label: '输入信号', value: '', unit: '', editable: false },
  { label: '防护等级', value: '', unit: '', editable: false },
  { label: '材质', value: '', unit: '', editable: false },
  { label: '补充信息', value: '', unit: '', editable: true },
  { label: '补充信息2', value: '', unit: '', editable: true },
  { label: '补充信息3', value: '', unit: '', editable: true },
  { label: '补充信息4', value: '', unit: '', editable: true },
  { label: '补充信息5', value: '', unit: '', editable: true },
];

export const DEFAULT_FOOTER: FooterData = {
  website: 'www.rvs-lighting.com',
  company: '上海芮维溪智能科技有限公司',
  email: 'sales@rvs-lighting.com',
  addressSh: '上海市黄浦区巨鹿路417号701室',
  addressSz: '深圳市南山区南山云谷南风楼A座405室',
  rights: '芮光保留对产品进行不定期设计更新的权利',
  version: '2025.2',
};

export function createEmptyProduct(): ProductSpec {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: '新产品',
    brand: '芮光',
    series: '产品系列',
    description: '产品描述',
    model: '',
    createdAt: now,
    updatedAt: now,
    logo: null,
    productImage: null,
    productDiagram: null,
    accessories: [null, null, null, null],
    curves: [null, null, null, null],
    params: DEFAULT_PARAMS.map((p) => ({ ...p, id: crypto.randomUUID() })),
    footer: { ...DEFAULT_FOOTER },
  };
}
