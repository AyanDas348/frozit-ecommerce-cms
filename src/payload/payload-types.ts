/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export type CartItems =
  | {
    product?: (string | null) | Product;
    quantity?: number | null;
    id?: string | null;
    imageUrl?: string | '';
    price: number | 0;
  }[]
  | null;

export interface Config {
  collections: {
    pages: Page;
    products: Product;
    orders: Order;
    media: Media;
    categories: Category;
    users: User;
    redirects: Redirect;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {
    settings: Settings;
    header: Header;
    footer: Footer;
  };
}
export interface Page {
  id: string;
  title: string;
  publishedOn?: string | null;
  hero: {
    type: 'none' | 'highImpact' | 'mediumImpact' | 'lowImpact' | 'customHero';
    richText: {
      [k: string]: unknown;
    }[];
    links?:
    | {
      link: {
        type?: ('reference' | 'custom') | null;
        newTab?: boolean | null;
        reference?: {
          relationTo: 'pages';
          value: string | Page;
        } | null;
        url?: string | null;
        label: string;
        icon?: string | Media | null;
        appearance?: ('default' | 'primary' | 'secondary') | null;
      };
      id?: string | null;
    }[]
    | null;
    media?: string | Media | null;
    bgImages?: string[]
  };
  layout: (
    | {
      invertBackground?: boolean | null;
      richText: {
        [k: string]: unknown;
      }[];
      links?:
      | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
          icon?: string | Media | null;
          appearance?: ('primary' | 'secondary') | null;
        };
        id?: string | null;
      }[]
      | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'cta';
    }
    | {
      invertBackground?: boolean | null;
      columns?:
      | {
        size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
        richText: {
          [k: string]: unknown;
        }[];
        enableLink?: boolean | null;
        link?: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
          icon?: string | Media | null;
          appearance?: ('default' | 'primary' | 'secondary') | null;
        };
        id?: string | null;
      }[]
      | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'content';
    }
    | {
      invertBackground?: boolean | null;
      position?: ('default' | 'fullscreen') | null;
      media: string | Media;
      id?: string | null;
      blockName?: string | null;
      blockType: 'mediaBlock';
    }
    | {
      introContent: {
        [k: string]: unknown;
      }[];
      populateBy?: ('collection' | 'selection') | null;
      relationTo?: 'products' | null;
      categories?: (string | Category)[] | null;
      limit?: number | null;
      selectedDocs?:
      | {
        relationTo: 'products';
        value: string | Product;
      }[]
      | null;
      populatedDocs?:
      | {
        relationTo: 'products';
        value: string | Product;
      }[]
      | null;
      populatedDocsTotal?: number | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'archive';
    }
  )[];
  slug?: string | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: string | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
}
export interface Media {
  id: string;
  alt: string;
  caption?:
  | {
    [k: string]: unknown;
  }[]
  | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  // has_attachment: boolean | false;
}
export interface Category {
  id: string;
  title: string;
  media?: string | Media | null;
  parent?: (string | null) | Category;
  breadcrumbs?:
  | {
    doc?: (string | null) | Category;
    url?: string | null;
    label?: string | null;
    id?: string | null;
  }[]
  | null;
  updatedAt: string;
  createdAt: string;
}
export interface Product {
  id: string;
  item_id?: string;
  title: string;
  publishedOn?: string | null;
  layout?: (
    | {
      invertBackground?: boolean | null;
      richText: {
        [k: string]: unknown;
      }[];
      links?:
      | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
          icon?: string | Media | null;
          appearance?: ('primary' | 'secondary') | null;
        };
        id?: string | null;
      }[]
      | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'cta';
    }
    | {
      invertBackground?: boolean | null;
      columns?:
      | {
        size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
        richText: {
          [k: string]: unknown;
        }[];
        enableLink?: boolean | null;
        link?: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
          icon?: string | Media | null;
          appearance?: ('default' | 'primary' | 'secondary') | null;
        };
        id?: string | null;
      }[]
      | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'content';
    }
    | {
      invertBackground?: boolean | null;
      position?: ('default' | 'fullscreen') | null;
      media: string | Media;
      id?: string | null;
      blockName?: string | null;
      blockType: 'mediaBlock';
    }
    | {
      introContent: {
        [k: string]: unknown;
      }[];
      populateBy?: ('collection' | 'selection') | null;
      relationTo?: 'products' | null;
      categories?: (string | Category)[] | null;
      limit?: number | null;
      selectedDocs?:
      | {
        relationTo: 'products';
        value: string | Product;
      }[]
      | null;
      populatedDocs?:
      | {
        relationTo: 'products';
        value: string | Product;
      }[]
      | null;
      populatedDocsTotal?: number | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'archive';
    }
  )[];
  stripeProductID?: string | null;
  priceJSON?: number | 0;
  enablePaywall?: boolean | null;
  paywall?:
  | (
    | {
      invertBackground?: boolean | null;
      richText: {
        [k: string]: unknown;
      }[];
      links?:
      | {
        link: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
          icon?: string | Media | null;
          appearance?: ('primary' | 'secondary') | null;
        };
        id?: string | null;
      }[]
      | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'cta';
    }
    | {
      invertBackground?: boolean | null;
      columns?:
      | {
        size?: ('oneThird' | 'half' | 'twoThirds' | 'full') | null;
        richText: {
          [k: string]: unknown;
        }[];
        enableLink?: boolean | null;
        link?: {
          type?: ('reference' | 'custom') | null;
          newTab?: boolean | null;
          reference?: {
            relationTo: 'pages';
            value: string | Page;
          } | null;
          url?: string | null;
          label: string;
          icon?: string | Media | null;
          appearance?: ('default' | 'primary' | 'secondary') | null;
        };
        id?: string | null;
      }[]
      | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'content';
    }
    | {
      invertBackground?: boolean | null;
      position?: ('default' | 'fullscreen') | null;
      media: string | Media;
      id?: string | null;
      blockName?: string | null;
      blockType: 'mediaBlock';
    }
    | {
      introContent: {
        [k: string]: unknown;
      }[];
      populateBy?: ('collection' | 'selection') | null;
      relationTo?: 'products' | null;
      categories?: (string | Category)[] | null;
      limit?: number | null;
      selectedDocs?:
      | {
        relationTo: 'products';
        value: string | Product;
      }[]
      | null;
      populatedDocs?:
      | {
        relationTo: 'products';
        value: string | Product;
      }[]
      | null;
      populatedDocsTotal?: number | null;
      id?: string | null;
      blockName?: string | null;
      blockType: 'archive';
    }
  )[]
  | null;
  categories?: (string | Category)[] | null;
  relatedProducts?: (string | Product)[] | null;
  slug?: string | null;
  skipSync?: boolean | null;
  meta?: {
    title?: string | null;
    description?: string | null;
    image?: string | Media | null;
  };
  updatedAt: string;
  createdAt: string;
  _status?: ('draft' | 'published') | null;
  stock: number | 0;
}
export interface Order {
  id: string;
  orderedBy?: (string | null) | User;
  stripePaymentIntentID?: string | null;
  total: number;
  items?:
  | {
    product: string | Product;
    price?: number | null;
    quantity?: number | null;
    id?: string | null;
  }[]
  | null;
  updatedAt: string;
  createdAt: string;
}
export interface User {
  id: string;
  name?: string | null;
  roles?: ('admin' | 'customer')[] | null;
  purchases?: (string | Product)[] | null;
  stripeCustomerID?: string | null;
  cart?: {
    items?: CartItems;
  };
  skipSync?: boolean | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
  jwt: string,
  msg: string,
  userData: {
    address: {
      street: string,
      city: string,
      state: string,
      pinCode: string,
      country: string,
      plotNo: string,
    }[],
    createdAt: string,
    email: string,
    phoneNumber: string,
    uid: string,
    _id: string,
  }
}
export interface Redirect {
  id: string;
  from: string;
  to?: {
    type?: ('reference' | 'custom') | null;
    reference?:
    | ({
      relationTo: 'pages';
      value: string | Page;
    } | null)
    | ({
      relationTo: 'products';
      value: string | Product;
    } | null);
    url?: string | null;
  };
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: 'users';
    value: string | User;
  };
  key?: string | null;
  value?:
  | {
    [k: string]: unknown;
  }
  | unknown[]
  | string
  | number
  | boolean
  | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
export interface Settings {
  id: string;
  productsPage?: (string | null) | Page;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface Header {
  id: string;
  navItems?:
  | {
    link: {
      type?: ('reference' | 'custom') | null;
      newTab?: boolean | null;
      reference?: {
        relationTo: 'pages';
        value: string | Page;
      } | null;
      url?: string | null;
      label: string;
      icon?: string | Media | null;
    };
    id?: string | null;
  }[]
  | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}
export interface Footer {
  id: string;
  copyright: string;
  navItems?:
  | {
    link: {
      type?: ('reference' | 'custom') | null;
      newTab?: boolean | null;
      reference?: {
        relationTo: 'pages';
        value: string | Page;
      } | null;
      url?: string | null;
      label: string;
      icon?: string | Media | null;
    };
    id?: string | null;
  }[]
  | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name: string;
    email: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

interface Razorpay {
  new(options: RazorpayOptions): {
    open: () => void;
    on: (event: string, callback: (response: any) => void) => void;
  };
}

declare global {
  interface Window {
    Razorpay: Razorpay;
  }
}


declare module 'payload' {
  export interface GeneratedTypes extends Config { }
}