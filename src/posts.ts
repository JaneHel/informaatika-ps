export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body: string[];
}

export const posts: Post[] = [
  {
    slug: 'algoritmid-igapaevaelus',
    title: 'Algoritmid igapäevaelus',
    date: '2026-10-02',
    excerpt: 'Kuidas retsept, sõiduplaan ja otsingumootor on kõik algoritmid.',
    body: [
      'Algoritm on täpne juhend, mis viib lähteandmetelt tulemuseni. Iga kord, kui järgid toiduretsepti, täidad tegelikult algoritmi.',
      'Arvutiteaduses huvitab meid lisaks õigele tulemusele ka see, kui kiiresti ja kui vähese mäluga sinna jõuame.',
    ],
  },
  {
    slug: 'mis-on-webgl',
    title: 'Mis on WebGL?',
    date: '2026-10-20',
    excerpt: 'Lühike sissejuhatus 3D-graafikasse veebibrauseris.',
    body: [
      'WebGL võimaldab brauseril kasutada arvuti graafikaprotsessorit, et joonistada kolmemõõtmelisi kujundeid otse veebilehele.',
      'Kõigis seadmetes see siiski ei tööta – seepärast peab hea veebileht toimima ka ilma selleta.',
    ],
  },
];
