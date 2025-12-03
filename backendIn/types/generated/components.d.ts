import type { Schema, Struct } from '@strapi/strapi';

export interface CardCasestudyCard extends Struct.ComponentSchema {
  collectionName: 'components_card_casestudy_cards';
  info: {
    displayName: 'CasestudyCard';
    icon: 'bell';
  };
  attributes: {
    Contents: Schema.Attribute.Component<'lists.card-list', true>;
    title: Schema.Attribute.String;
    TitleDescription: Schema.Attribute.String;
    titleNumber: Schema.Attribute.String;
  };
}

export interface ExperiencInfinitasExperience extends Struct.ComponentSchema {
  collectionName: 'components_experienc_infinitas_experiences';
  info: {
    displayName: 'Experience';
  };
  attributes: {
    aboutexperiencedescription: Schema.Attribute.String;
    aboutexperiencetitle: Schema.Attribute.String;
  };
}

export interface FaqsFaqTitle extends Struct.ComponentSchema {
  collectionName: 'components_faqs_faq_titles';
  info: {
    displayName: 'FaqTitle';
    icon: 'briefcase';
  };
  attributes: {
    FaqContent: Schema.Attribute.Component<'faqs.faqs', true>;
    Title: Schema.Attribute.String;
  };
}

export interface FaqsFaqs extends Struct.ComponentSchema {
  collectionName: 'components_faqs_faqs';
  info: {
    displayName: 'Faqs';
  };
  attributes: {
    Anwser: Schema.Attribute.Blocks;
    Question: Schema.Attribute.Blocks;
  };
}

export interface ListCta extends Struct.ComponentSchema {
  collectionName: 'components_list_ctas';
  info: {
    displayName: 'CTA';
    icon: 'book';
  };
  attributes: {
    Title: Schema.Attribute.String;
  };
}

export interface ListcontentHomeGlobalExpertise extends Struct.ComponentSchema {
  collectionName: 'components_listcontent_home_global_expertises';
  info: {
    displayName: 'Home-Global-Expertise';
    icon: 'briefcase';
  };
  attributes: {
    description: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface ListsCardList extends Struct.ComponentSchema {
  collectionName: 'components_lists_card_lists';
  info: {
    displayName: 'CardList';
    icon: 'briefcase';
  };
  attributes: {
    keytitle: Schema.Attribute.String;
    Keywords: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface ServicesSubService extends Struct.ComponentSchema {
  collectionName: 'components_services_sub_services';
  info: {
    displayName: 'SubService';
    icon: 'bulletList';
  };
  attributes: {
    ServiceHead: Schema.Attribute.Component<'services.sub-service-head', true>;
    ServiceTitle: Schema.Attribute.String;
  };
}

export interface ServicesSubServiceContent extends Struct.ComponentSchema {
  collectionName: 'components_services_sub_service_contents';
  info: {
    displayName: 'SubServiceContent';
    icon: 'bulletList';
  };
  attributes: {
    Content: Schema.Attribute.Blocks;
    CTA: Schema.Attribute.Blocks;
  };
}

export interface ServicesSubServiceHead extends Struct.ComponentSchema {
  collectionName: 'components_services_sub_service_heads';
  info: {
    displayName: 'SubServiceHead';
    icon: 'bulletList';
  };
  attributes: {
    ServiceBody: Schema.Attribute.Component<
      'services.sub-service-content',
      true
    >;
    ServiceDescription: Schema.Attribute.Blocks;
    ServiceImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    ServiceTitle: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'bold';
  };
  attributes: {
    breadcrumbSchema: Schema.Attribute.JSON;
    businessAddress: Schema.Attribute.String;
    businessPhone: Schema.Attribute.String;
    canonicalURL: Schema.Attribute.String;
    faqSchema: Schema.Attribute.JSON;
    geoCity: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String;
    metaImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    metaRobots: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String;
    metaViewport: Schema.Attribute.String;
    ogType: Schema.Attribute.String;
    schemaJSON: Schema.Attribute.JSON;
    schemaType: Schema.Attribute.String;
    Title: Schema.Attribute.String;
  };
}

export interface TeamListTeam extends Struct.ComponentSchema {
  collectionName: 'components_team_list_teams';
  info: {
    displayName: 'Team';
    icon: 'chartBubble';
  };
  attributes: {
    Description: Schema.Attribute.Blocks;
    Designation: Schema.Attribute.String;
    Name: Schema.Attribute.String;
    TeamImage: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
  };
}

export interface ValuesListOurValues extends Struct.ComponentSchema {
  collectionName: 'components_values_list_our_values';
  info: {
    displayName: 'OurValues';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text;
    Header: Schema.Attribute.String;
    Number: Schema.Attribute.BigInteger;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'card.casestudy-card': CardCasestudyCard;
      'experienc-infinitas.experience': ExperiencInfinitasExperience;
      'faqs.faq-title': FaqsFaqTitle;
      'faqs.faqs': FaqsFaqs;
      'list.cta': ListCta;
      'listcontent.home-global-expertise': ListcontentHomeGlobalExpertise;
      'lists.card-list': ListsCardList;
      'services.sub-service': ServicesSubService;
      'services.sub-service-content': ServicesSubServiceContent;
      'services.sub-service-head': ServicesSubServiceHead;
      'shared.seo': SharedSeo;
      'team-list.team': TeamListTeam;
      'values-list.our-values': ValuesListOurValues;
    }
  }
}
