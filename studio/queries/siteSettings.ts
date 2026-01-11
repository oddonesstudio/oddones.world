import groq from "groq";

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
      navigation[] {
        _key,
        label,
        "slug": page->slug.current,
        iconType,
        pixelIcon->{
          title,
          svg
        },
        "uploadedIcon": uploadedIcon.asset->url
      },
      footerText,
      socialLinks[] {
        platform,
        url,
        iconType,
        pixelIcon->{
          title,
          svg
        },
        "uploadedIcon": uploadedIcon.asset->url
      }
    }`;
