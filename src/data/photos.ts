// Add real photos here once you have them.
// 1. Drop the image file into public/photos/ (e.g. public/photos/dad-outside-first-pub.jpg)
// 2. Add a line below pointing at it, with NO leading slash (Photos.tsx adds the
//    site's base path automatically, which matters once this is deployed under
//    a subpath like /dad_pubs/).
//
// export const photos: Photo[] = [
//   { src: "photos/dad-outside-first-pub.jpg", caption: "Outside the very first pub on the list, 1960." },
// ];

export interface Photo {
  src: string;
  caption: string;
}

export const photos: Photo[] = [];
